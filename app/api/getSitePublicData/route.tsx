import { NextResponse, NextRequest } from "next/server";
import { getSitePublicData } from "@/app/utils/getSitePublicData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get("siteId");
  const domainName = searchParams.get("domainName");
  
  if ( !siteId && !domainName) {
    return NextResponse.json(
      { status: 400, message: "Site ID or domain name is required." }
    );
  }

  const result = await getSitePublicData(siteId, domainName);
  return NextResponse.json(result, { status: result.status });
}
