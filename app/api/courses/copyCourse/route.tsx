import { NextResponse, NextRequest } from "next/server";
import { copyCourse } from "@/app/utils/copyCourse";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { getUserId } from "@/app/utils/getUserId";

export async function POST(request: NextRequest) {
  const { courseId } = await request.json();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!courseId) {
    return NextResponse.json({
      status: 400,
      message: "Course ID is requiered",
    });
  }
  const result = await copyCourse(courseId, userId);
  return NextResponse.json(result, { status: result.status });
}
