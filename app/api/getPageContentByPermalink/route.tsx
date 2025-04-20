import { NextResponse, NextRequest } from "next/server";
import { getPageContentByPermalink } from "@/app/utils/getPageContentByPermalink";

export async function GET(request: NextRequest) {
  const permalink = request.nextUrl.searchParams.get("permalink");
  const siteId = request.nextUrl.searchParams.get("siteId");
  if (!permalink || !siteId) {
    return NextResponse.json({
      status: 400,
      message: "Permalink and siteId are required",
    });
  }
  const result = await getPageContentByPermalink(permalink, siteId);
  return NextResponse.json(result);
}