import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { getInstructors } from "@/app/utils/getInstructors";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { status: 401, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const response = await getInstructors(session.user.email);
  return NextResponse.json(response, { status: 200 });
}
