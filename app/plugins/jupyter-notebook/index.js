import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { toast } from "react-hot-toast";

class JupyterNotebook {
  static get toolbox() {
    return {
      title: "Jupyter Notebook",
      icon: '<svg width="800" height="800" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M26.233 3.588A1.69 1.69 0 1124.473 2a1.67 1.67 0 011.76 1.585z" fill="#767677"/><path d="M16.375 23.111c-4.487 0-8.43-1.61-10.469-3.988a11.162 11.162 0 0020.938 0c-2.034 2.377-5.962 3.988-10.469 3.988zM16.375 7.648c4.487 0 8.43 1.61 10.469 3.988a11.162 11.162 0 00-20.938 0c2.039-2.383 5.963-3.988 10.469-3.988z" fill="#f37726"/><path d="M10.2 27.739a2.109 2.109 0 11-.2-.8 2.129 2.129 0 01.2.8z" fill="#9e9e9e"/><path d="M6.416 7.106A1.226 1.226 0 117.608 5.83a1.241 1.241 0 01-1.192 1.276z" fill="#616262"/></svg>',
    };
  }

  constructor({ data }) {
    this.data = data || {};
  }

  render() {
    const wrapper = document.createElement("div");
    const root = createRoot(wrapper);

    const JupyterNotebookComponent = ({ initialData }) => {
      const [projectName, setProjectName] = useState(
        initialData.projectName || ""
      );
      const [contentUrl, setContentUrl] = useState(
        initialData.contentUrl || ""
      );
      const [contentBranch, setContentBranch] = useState(
        initialData.contentBranch || ""
      );
      const [branches, setBranches] = useState([]);
      const [isLoadingBranches, setIsLoadingBranches] = useState(false);
      const [error, setError] = useState("");
      const [isDeploying, setIsDeploying] = useState(false);
      const [deploymentStatus, setDeploymentStatus] = useState(null);
      const [tabId, setTabId] = useState(Math.floor(Math.random() * 10000));
      const [notebookUrl, setNotebookUrl] = useState(initialData.notebookUrl || "");
      const [folders, setFolders] = useState([]);
      const [selectedFolder, setSelectedFolder] = useState(initialData.selectedFolder || '');
      const [isLoadingFolders, setIsLoadingFolders] = useState(false);

      // Function to parse GitHub URL
      const parseGitHubUrl = (url) => {
        try {
          const parsedUrl = new URL(url);
          const [, owner, repo] = parsedUrl.pathname.split("/");
          return { owner, repo };
        } catch (error) {
          return null;
        }
      };

      // Add new function to fetch repository contents
      const fetchRepoContents = async (owner, repo, branch) => {
        setIsLoadingFolders(true);
        try {
          const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch repository contents");
          }

          const data = await response.json();
          const folderPaths = data.tree
            .filter(item => item.type === 'tree')
            .map(item => item.path);
          
          setFolders(['root', ...folderPaths]);
          if (!selectedFolder) {
            setSelectedFolder('root');
            this.data.selectedFolder = 'root';
          }
        } catch (error) {
          setError("Error fetching folders: " + error.message);
        } finally {
          setIsLoadingFolders(false);
        }
      };

      // Fetch branches when content URL changes
      useEffect(() => {
        const fetchBranches = async () => {
          setIsLoadingBranches(true);
          setError("");
          setBranches([]);

          if (!contentUrl) return;

          const repoInfo = parseGitHubUrl(contentUrl);
          if (!repoInfo) {
            setError("Invalid GitHub URL");
            setIsLoadingBranches(false);
            return;
          }

          try {
            const response = await fetch(
              `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/branches`
            );

            if (!response.ok) {
              throw new Error("Failed to fetch branches");
            }

            const data = await response.json();
            setBranches(data.map((branch) => branch.name));

            // Set default branch if none selected
            if (!contentBranch && data.length > 0) {
              const defaultBranch =
                data.find(
                  (branch) => branch.name === "main" || branch.name === "master"
                ) || data[0];
              setContentBranch(defaultBranch.name);
              this.data.contentBranch = defaultBranch.name;
            }

            // After setting the default branch, fetch folders
            if (repoInfo && contentBranch) {
              await fetchRepoContents(repoInfo.owner, repoInfo.repo, contentBranch);
            }
          } catch (error) {
            setError("Error fetching branches: " + error.message);
          } finally {
            setIsLoadingBranches(false);
          }
        };

        if (contentUrl) {
          fetchBranches();
        }
      }, [contentUrl, contentBranch]);

      const handleProjectNameChange = (e) => {
        const value = e.target.value;

        // Don't transform the input if it's a hyphen
        if (value.slice(-1) === "-") {
          setProjectName(value);
          this.data.projectName = value;
          return;
        }

        // Clean other characters
        const cleanedProjectName = value
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "-") // Note: removed escape character as it's not needed in character class
          .replace(/-+/g, "-")
          .replace(/^-+|-+$/g, "");

        setProjectName(cleanedProjectName);
        this.data.projectName = cleanedProjectName;
      };

      const handleContentUrlChange = (e) => {
        setContentUrl(e.target.value);
        this.data.contentUrl = e.target.value;
      };

      const handleContentBranchChange = (e) => {
        setContentBranch(e.target.value);
        this.data.contentBranch = e.target.value;
      };

      const handleFolderChange = (e) => {
        setSelectedFolder(e.target.value);
        this.data.selectedFolder = e.target.value;
      };

      const handleCreateNotebook = async () => {
        try {
          if (!projectName || !contentUrl || !contentBranch) {
            throw new Error("All fields are required");
          }

          setIsDeploying(true);
          setDeploymentStatus("deploying");
          
          // Start the loading toast
          const loadingToast = toast.loading("Deploying notebook... This may take a few minutes");

          const response = await fetch("/api/notebooks", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              projectName,
              contentUrl,
              contentBranch,
              selectedFolder,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to create notebook");
          }

          const data = await response.json();

          // Dismiss the loading toast and show appropriate status
          toast.dismiss(loadingToast);

          if (data.success && data.deploymentStatus === "success") {
            toast.success("Notebook deployed successfully! You can now view it.");
            setNotebookUrl(data.url);
            this.data.notebookUrl = data.url;
            setDeploymentStatus("success");
          } else if (data.deploymentStatus === "timeout") {
            toast.warning("Deployment is taking longer than expected. It will continue in the background.");
            setDeploymentStatus("timeout");
          } else {
            toast.error("Deployment failed. Please try again.");
            setDeploymentStatus("failed");
          }

        } catch (error) {
          console.error("Error creating notebook:", error);
          setError(error.message);
          setDeploymentStatus("error");
          toast.error("Failed to deploy notebook. Please try again.");
        } finally {
          setIsDeploying(false);
        }
      };

      return (
        <div role="tablist" className="tabs tabs-lifted my-4">
          <input
            type="radio"
            name={`jupyter-notebook-${tabId}`}
            role="tab"
            className="tab"
            aria-label="Preview"
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            {notebookUrl ? (
              <iframe src={notebookUrl} className="w-full h-[500px]"></iframe>
            ) : (
              <div className="flex w-52 flex-col gap-4">
                <div className="skeleton h-32 w-full"></div>
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
              </div>
            )}
          </div>

          <input
            type="radio"
            name={`jupyter-notebook-${tabId}`}
            role="tab"
            className="tab"
            aria-label="Settings"
            defaultChecked
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <div className="grid grid-cols-3 gap-4 items-end">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Project Name</span>
                </div>
                <input
                  type="text"
                  placeholder="project-name"
                  className="input input-bordered w-full max-w-xs"
                  value={projectName}
                  onChange={handleProjectNameChange}
                />
              </label>
              <label className="form-control w-full col-span-2">
                <div className="label">
                  <span className="label-text">
                    Content URL (Link to a Github repo that contains the
                    notebook)
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="https://github.com/username/repo"
                  className="input input-bordered w-full"
                  value={contentUrl}
                  onChange={handleContentUrlChange}
                />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Content Branch</span>
                </div>
                {isLoadingBranches ? (
                  <div className="loading loading-spinner loading-md"></div>
                ) : (
                  <select
                    className="select select-bordered w-full max-w-xs"
                    value={contentBranch}
                    onChange={handleContentBranchChange}
                    disabled={!branches.length}
                  >
                    <option value="">Select a branch</option>
                    {branches.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                )}
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Notebook Location</span>
                </div>
                {isLoadingFolders ? (
                  <div className="loading loading-spinner loading-md"></div>
                ) : (
                  <select
                    className="select select-bordered w-full max-w-xs"
                    value={selectedFolder}
                    onChange={handleFolderChange}
                    disabled={!folders.length}
                  >
                    {folders.map((folder) => (
                      <option key={folder} value={folder}>
                        {folder}
                      </option>
                    ))}
                  </select>
                )}
              </label>
              <button
                className="btn btn-primary col-span-full my-2"
                onClick={handleCreateNotebook}
                disabled={isLoadingBranches || isDeploying || !projectName || !contentUrl || !contentBranch}
              >
                {isLoadingBranches ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Loading branches...
                  </>
                ) : isDeploying ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Deploying notebook...
                  </>
                ) : (
                  "Create Notebook"
                )}
              </button>
            </div>
          </div>
        </div>
      );
    };

    root.render(<JupyterNotebookComponent initialData={this.data} />);

    return wrapper;
  }

  save(blockContent) {
    return {
      projectName: this.data.projectName,
      contentUrl: this.data.contentUrl,
      contentBranch: this.data.contentBranch,
      notebookUrl: this.data.notebookUrl,
      selectedFolder: this.data.selectedFolder,
    };
  }
}

export default JupyterNotebook;
