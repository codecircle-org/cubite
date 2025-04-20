import { NextResponse, NextRequest } from "next/server";
import { updateEnrollment } from "@/app/utils/updateEnrollment";
import { deleteEnrollment } from "@/app/utils/removeEnrollment";
import { getEnrollmentsByUser } from "@/app/utils/getEnrollmentsByUser";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ status: 401, message: "Unauthorized" });
  }
  const userId = session.user.id;
  if (!userId) {
    return NextResponse.json({
      status: 400,
      message: "User ID is required",
    });
  }

  const result = await getEnrollmentsByUser(userId);
  return NextResponse.json(result, { status: result.status });
}

export async function PUT(request: NextRequest) {
  const updateData = await request.json();
  if (!updateData.courseId || !updateData.userId || !updateData.siteId) {
    return NextResponse.json({
      status: 400,
      message: "Course ID, User ID, and Site ID are required",
    });
  }

  const result = await updateEnrollment(updateData);
  return NextResponse.json(result, { status: result.status });
}

export async function DELETE(request: NextRequest) {
  const removeData = await request.json();

  if (!removeData.courseId || !removeData.userId || !removeData.siteId) {
    return NextResponse.json({
      status: 400,
      message: "Course ID, User ID, and Site ID are required",
    });
  }

  const result = await deleteEnrollment(removeData);
  return NextResponse.json(result, { status: result.status });
}
