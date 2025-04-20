import { NextRequest, NextResponse } from "next/server";
import { getAdministratedSites } from "@/app/utils/getAdministratedSites";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await getAdministratedSites(body.userEmail);
  return NextResponse.json(result);
}
