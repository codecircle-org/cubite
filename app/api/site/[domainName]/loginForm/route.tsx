import { NextRequest, NextResponse } from "next/server";
import { updateLoginForm } from "@/app/utils/updateLoginForm";

export async function PUT(request: NextRequest) {
  const { siteId, loginForm } = await request.json();
  const result = await updateLoginForm(siteId, loginForm);
  return NextResponse.json(result, { status: result.status });
}
