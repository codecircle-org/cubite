import { enrollPendingCourses } from "@/app/utils/enrollPendingCourses";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  const { pendingEnrollments, userId } = await request.json();
  const result = await enrollPendingCourses(pendingEnrollments, userId);
  return NextResponse.json(result, { status: result.status });
}
