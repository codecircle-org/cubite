import { NextRequest, NextResponse } from "next/server";
import { updateSiteHeaderLinks } from "@/app/utils/updateSiteHeaderLinks";

export async function PUT(request: NextRequest) {
    const { siteId, headerLinks } = await request.json();
    const result = await updateSiteHeaderLinks(siteId, headerLinks);
    return NextResponse.json(result, { status: result.status });
}