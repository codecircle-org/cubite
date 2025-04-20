import { NextResponse, NextRequest } from "next/server";
import { createCourse } from "@/app/utils/createCourse";
import { getCourses } from "@/app/utils/getCourses";
import { deleteCourse } from "@/app/utils/deleteCourse";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await createCourse({
    name: body.name,
    description: body.description,
    coverImage: body.coverImage,
    introVideo: body.introVideo,
    price: body.price,
    subjects: body.subjects,
    topics: body.topics,
    startDate: body.startDate,
    endDate: body.endDate,
    instructors: body.instructors,
    level: body.level,
  });
  return NextResponse.json(result, { status: result.status });
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ status: 401, message: "Unauthorized" });
  }

  const result = await getCourses(session.user.email);
  return NextResponse.json(result);
}

export async function DELETE(request: NextRequest) {
  const { courseId } = await request.json();
  if (!courseId) {
    return NextResponse.json({
      status: 400,
      message: "Course ID is required",
    });
  }
  const result = await deleteCourse(courseId);
  return NextResponse.json(result, { status: result.status });
}
