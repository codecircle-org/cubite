import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { getUserId } from "@/app/utils/getUserId";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const result = await getUserId(session?.user.email);
  return NextResponse.json(result);
}
