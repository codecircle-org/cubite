import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const REPO_CONFIG = {
  owner: 'amirtds',
  repo: 'jupyterlite',
  base: 'main'
};

interface CreateNotebookParams {
  projectName: string;
  contentUrl: string;
  contentBranch: string;
}

export async function createNotebook({ projectName, contentUrl, contentBranch }: CreateNotebookParams) {
  try {
    // 1. Check if branch exists
    let branchExists = true;
    try {
      await octokit.git.getRef({
        ...REPO_CONFIG,
        ref: `heads/project/${projectName}`
      });
    } catch (error) {
      if (error.status === 404) {
        branchExists = false;
      } else {
        throw error;
      }
    }

    if (!branchExists) {
      // 2. Get the base branch SHA for new branch
      const { data: baseRef } = await octokit.git.getRef({
        ...REPO_CONFIG,
        ref: `heads/${REPO_CONFIG.base}`
      });

      // 3. Create new branch
      await octokit.git.createRef({
        ...REPO_CONFIG,
        ref: `refs/heads/project/${projectName}`,
        sha: baseRef.object.sha
      });
    }

    // 4. Get the latest commit from content repo
    const contentRepoPath = new URL(contentUrl).pathname.slice(1);
    const [contentOwner, contentRepo] = contentRepoPath.split('/');
    
    const { data: contentRef } = await octokit.git.getRef({
      owner: contentOwner,
      repo: contentRepo,
      ref: `heads/${contentBranch}`
    });

    // 5. Get current branch reference
    const { data: currentRef } = await octokit.git.getRef({
      ...REPO_CONFIG,
      ref: `heads/project/${projectName}`
    });

    // 6. Create a tree with both .gitmodules and submodule entry
    const { data: tree } = await octokit.git.createTree({
      ...REPO_CONFIG,
      base_tree: currentRef.object.sha,
      tree: [
        {
          path: '.gitmodules',
          mode: '100644',
          type: 'blob',
          content: `[submodule "notebooks/${projectName}"]
    path = notebooks/${projectName}
    url = ${contentUrl}`
        },
        {
          path: `notebooks/${projectName}`,
          mode: '160000',
          type: 'commit',
          sha: contentRef.object.sha
        }
      ]
    });

    // 7. Create a commit with the new tree
    const { data: commit } = await octokit.git.createCommit({
      ...REPO_CONFIG,
      message: branchExists 
        ? `Update submodule for ${projectName}`
        : `Add submodule for ${projectName}`,
      tree: tree.sha,
      parents: [currentRef.object.sha]
    });

    // 8. Update the branch reference to point to the new commit
    await octokit.git.updateRef({
      ...REPO_CONFIG,
      ref: `heads/project/${projectName}`,
      sha: commit.sha,
      force: true
    });

    // Wait a few seconds to allow the workflow to start
    await new Promise(resolve => setTimeout(resolve, 5000));

    // After updating the reference, wait for the workflow to complete
    const maxAttempts = 30; // 5 minutes total (30 attempts * 10 seconds)
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      // Get the latest workflow runs
      const { data: workflows } = await octokit.actions.listWorkflowRunsForRepo({
        ...REPO_CONFIG,
        branch: `project/${projectName}`,
        per_page: 5, // Get more runs to ensure we find the right one
      });

      if (workflows.total_count > 0) {
        // Find the workflow run that matches our commit
        const matchingRun = workflows.workflow_runs.find(run => run.head_sha === commit.sha);
        
        if (matchingRun) {
          if (matchingRun.status === 'completed') {
            if (matchingRun.conclusion === 'success') {
              const jupyterLiteUrl = `https://amirtds.github.io/jupyterlite/project/${projectName}/`;
              return {
                success: true,
                url: jupyterLiteUrl,
                isNew: !branchExists,
                deploymentStatus: 'success'
              };
            } else {
              return {
                success: false,
                error: 'Deployment failed',
                isNew: !branchExists,
                deploymentStatus: 'failed'
              };
            }
          }
        } else if (attempts === 0) {
          // If we don't find the matching run on first attempt, wait longer
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
      }

      // Wait 10 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 10000));
      attempts++;
    }

    // If we've exceeded max attempts, return timeout status
    return {
      success: false,
      error: 'Deployment timeout',
      isNew: !branchExists,
      deploymentStatus: 'timeout'
    };

  } catch (error) {
    console.error('Error in createNotebook:', error);
    return {
      success: false,
      error: error,
      isNew: false,
      deploymentStatus: 'error'
    };
  }
}
