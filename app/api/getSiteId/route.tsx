import { NextResponse, NextRequest } from "next/server";
import { getSiteIdByDomain } from "@/app/utils/getSiteIdByDomain";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const domain = url.searchParams.get("domain");

  if (!domain) {
    return NextResponse.json({
      message: "Please provide a domain",
      status: 400,
    });
  }

  try {
    const siteId = await getSiteIdByDomain(domain);
    return NextResponse.json({ siteId }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      message: error.message,
      status: 500,
    });
  }
}
