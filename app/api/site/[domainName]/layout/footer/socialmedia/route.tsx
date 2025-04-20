import { NextResponse, NextRequest } from "next/server";
import { updateSiteSocialMedias } from "@/app/utils/updateSiteSocialMedias";

export async function PUT(request: NextRequest) {
    const { siteId, socialMedias } = await request.json();
    const result = await updateSiteSocialMedias(siteId, socialMedias);
    return NextResponse.json(result, { status: result.status });
}