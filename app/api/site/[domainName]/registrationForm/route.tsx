import { NextRequest, NextResponse } from "next/server";
import { updateRegistrationForm } from "@/app/utils/updateRegistrationForm";

export async function PUT(request: NextRequest) {
  const { siteId, registrationForm } = await request.json();
  const result = await updateRegistrationForm(siteId, registrationForm);
  return NextResponse.json(result, { status: result.status });
}
