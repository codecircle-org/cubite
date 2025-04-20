import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { getLastVisitedContent } from "@/app/utils/getLastVisitedContent";
import { createLastVisitedContent } from "@/app/utils/createLastVisitedContent";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");
  if (!session || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 });
  }
  if (!courseId) {
    return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
  }
  const result = await getLastVisitedContent(courseId, session.user.id);
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 });
  }
  const { courseId, lastVisitedContent, siteId } = await request.json();
  if (!courseId || !lastVisitedContent || !siteId) {
    return NextResponse.json({ error: "Course ID, last visited content and site ID are required" }, { status: 400 });
  }     
  const result = await createLastVisitedContent(courseId, session.user.id, siteId, lastVisitedContent);
  return NextResponse.json(result);
}

