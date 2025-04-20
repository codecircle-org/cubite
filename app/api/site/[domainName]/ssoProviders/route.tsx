import { NextRequest, NextResponse } from "next/server";
import { updateSsoProviders } from "@/app/utils/updateSsoProviders";

export async function PUT(request: NextRequest) {
  const { siteId, ssoProviders } = await request.json();
  const result = await updateSsoProviders(siteId, ssoProviders);
  return NextResponse.json(result, { status: result.status });
}
