import { NextResponse, NextRequest } from "next/server";
import { getCourseContent } from "@/app/utils/getCourseContent";
import { createCourseContent } from "@/app/utils/createCourseContent";

interface Props {
  params: {
    courseId: string;
  };
}

export async function GET(
  request: NextRequest,
  { params: { courseId } }: Props
) {
  const result = await getCourseContent(courseId);
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const contentData = await request.json();
  const result = await createCourseContent(contentData);
  return NextResponse.json(result);
}
