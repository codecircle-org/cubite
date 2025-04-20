import { NextResponse, NextRequest } from "next/server";
import { getCourse } from "@/app/utils/getCourse";
import { updateCourse } from "@/app/utils/updateCourse";

interface Props {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params: { id } }: Props) {
  const result = await getCourse(id);
  if (result.status === 200) {
    return NextResponse.json(result, { status: 200 });
  } else {
    return NextResponse.json(result);
  }
}

export async function PUT(request: NextRequest) {
  const courseData = await request.json();
  const result = await updateCourse(courseData);
  return NextResponse.json(result, { status: result.status });
}
