import { updateUser } from "@/app/utils/updateUser";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const updateData = await request.json();
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  const result = await updateUser(userId, updateData);
  return NextResponse.json(result, { status: result.status });
}
