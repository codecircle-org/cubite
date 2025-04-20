import { NextResponse, NextRequest } from "next/server";
import { copyPage } from "@/app/utils/copyPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { getUserId } from "@/app/utils/getUserId";

export async function POST(request: NextRequest) {
  const { pageId } = await request.json();
  const session = await getServerSession(authOptions);
  const userId = await getUserId(session?.user?.email);

  if (!pageId) {
    return NextResponse.json({
      status: 400,
      message: "Post ID is required",
    });
  }
  const result = await copyPage(pageId, userId.id);
  return NextResponse.json(result, { status: result.status });
}
