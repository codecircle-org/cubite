import { NextResponse, NextRequest } from "next/server";
import { getPageContent } from "@/app/utils/getPageContent";
import { createPageContent } from "@/app/utils/createPageContent";

interface Props {
  params: {
    pageId: string;
  };
}

export async function GET(request: NextRequest, { params: { pageId } }: Props) {
  const result = await getPageContent(pageId);
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const contentData = await request.json();
  const result = await createPageContent(contentData);
  return NextResponse.json(result);
}
