import { NextRequest, NextResponse } from "next/server";
import { updateSiteFooterLinks } from "@/app/utils/updateSiteFooterLinks";

export async function PUT(request: NextRequest) {
    const { siteId, footerLinks } = await request.json();
    const result = await updateSiteFooterLinks(siteId, footerLinks);
    return NextResponse.json(result, { status: result.status });
}