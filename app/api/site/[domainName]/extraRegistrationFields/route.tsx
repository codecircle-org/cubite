import { NextRequest, NextResponse } from "next/server";
import { updateSiteExtraRegistrationFields } from "@/app/utils/updateSiteExtraRegistrationFields";

export async function PUT(request: NextRequest) {
    const { siteId, extraRegistrationFields } = await request.json();
    const result = await updateSiteExtraRegistrationFields(siteId, extraRegistrationFields);
    return NextResponse.json(result, { status: result.status });
}