import { NextResponse, NextRequest } from "next/server";
import { addEnrollment } from "@/app/utils/addEnrollment";
import { getEnrollmentsByCourse } from "@/app/utils/getEnrollmentsByCourse";

interface Props {
  params: {
    courseId: string;
  };
}

export async function GET(
  request: NextRequest,
  { params: { courseId } }: Props
) {
  if (!courseId) {
    return NextResponse.json({
      status: 400,
      message: "Course ID is required",
    });
  }

  const result = await getEnrollmentsByCourse(courseId);
  return NextResponse.json(result, { status: result.status });
}

export async function POST(request: NextRequest) {
  const enrollmentData = await request.json();

  if (
    !enrollmentData.courseId ||
    !enrollmentData.name ||
    !enrollmentData.email ||
    !enrollmentData.username ||
    !enrollmentData.siteId
  ) {
    return NextResponse.json({
      status: 400,
      message: "Course ID, Name, Email, Username, and Site ID are required",
    });
  }

  const result = await addEnrollment(enrollmentData);
  return NextResponse.json(result, { status: result.status });
}
