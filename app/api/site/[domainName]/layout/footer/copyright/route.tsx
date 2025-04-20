import { NextRequest, NextResponse } from "next/server";
import { updateSiteCopyright } from "@/app/utils/updateSiteCopyright";

export async function PUT(request: NextRequest) {
    const { siteId, copyrightText } = await request.json();
    const result = await updateSiteCopyright(siteId, copyrightText);
    return NextResponse.json(result, { status: result.status });
}