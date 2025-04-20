import { NextResponse, NextRequest } from "next/server";
import { getCourseContentVersions } from "@/app/utils/getCourseContentVersions";

interface Props {
  params: {
    courseId: string;
  };
}

export async function GET(
  request: NextRequest,
  { params: { courseId } }: Props
) {
  const result = await getCourseContentVersions(courseId);
  return NextResponse.json(result);
}
