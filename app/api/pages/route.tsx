import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { getPages } from "@/app/utils/getPages";
import { createPage } from "@/app/utils/createPage";
import { deletePage } from "@/app/utils/deletePage";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ status: 401, message: "Unauthorized" });
  }

  const result = await getPages(session.user.email);
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await createPage({
    title: body.title,
    description: body.description,
    permalink: body.permalink,
    subjects: body.subjects,
    topics: body.topics,
    image: body.image,
    authors: body.authors,
    sites: body.selectedSites,
    blurb: body.blurb,
    isBlog: body.isBlog,
  });
  return NextResponse.json(result, { status: result.status });
}

export async function DELETE(request: NextRequest) {
  const { pageId } = await request.json();
  if (!pageId) {
    return NextResponse.json({
      status: 400,
      message: "Page ID is required",
    });
  }
  const result = await deletePage(pageId);
  return NextResponse.json(result, { status: result.status });
}
