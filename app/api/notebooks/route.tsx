import { NextResponse, NextRequest } from "next/server";
import { createNotebook } from "@/app/utils/createNotebook";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectName, contentUrl, contentBranch, selectedFolder } = body;

    // Validate inputs
    if (!projectName || !contentUrl || !contentBranch || !selectedFolder) {
      return NextResponse.json(
        { error: 'Project name, content URL, and content branch are required' },
        { status: 400 }
      );
    }
    
    // Create notebook
    const result = await createNotebook({ projectName, contentUrl, contentBranch, selectedFolder });

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Error in notebooks route:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create notebook',
        message: error.message 
      },
      { status: 500 }
    );
  }
}


