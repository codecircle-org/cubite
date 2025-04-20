import { NextResponse, NextRequest } from "next/server";
import { getPageContentVersions } from "@/app/utils/getPageContentVersions";

interface Props {
  params: {
    pageId: string;
  };
}

export async function GET(request: NextRequest, { params: { pageId } }: Props) {
  const result = await getPageContentVersions(pageId);
  return NextResponse.json(result);
}
