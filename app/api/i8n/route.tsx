import { NextResponse, NextRequest } from "next/server";
import { getLanguages } from "@/app/utils/getLanguages";

export async function GET(request: NextRequest) {
  const result = await getLanguages();
  return NextResponse.json(result);
}
