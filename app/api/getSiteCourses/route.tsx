import { getSiteCourses } from "@/app/utils/getSiteCourses";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  const siteId = request.nextUrl.searchParams.get("siteId");
  if (!siteId) {
    return NextResponse.json({
      status: 400,
      message: "Site ID is required",
    });
  }
  const result = await getSiteCourses(siteId);
  return NextResponse.json(result);
}
