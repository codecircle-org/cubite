import { NextResponse, NextRequest } from "next/server";
import { getCourseProgress } from "@/app/utils/getCourseProgress";
import { upsertCourseProgress } from "@/app/utils/upsertCourseProgress";

interface Props {
  userId: string;
  courseId: string;
  siteId: string;
}

const getParams = (request: NextRequest) => {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const courseId = url.searchParams.get("courseId");
  const siteId = url.searchParams.get("siteId");
  return { userId, courseId, siteId };
};

export async function GET(request: NextRequest) {
  const { userId, courseId, siteId } = getParams(request);

  if (!userId || !courseId || !siteId) {
    return NextResponse.json({
      message:
        "Please provide required parameters - UserId, CourseId, and SiteId",
      status: 400,
    });
  }

  const progress = await getCourseProgress({ userId, courseId, siteId });
  return NextResponse.json(progress, { status: progress.status });
}

export async function POST(request: NextRequest) {
  const { userId, courseId, siteId, lastUnitId, progress, progressPercentage } =
    await request.json();

  if (
    !userId ||
    !courseId ||
    !siteId ||
    !lastUnitId ||
    !progress ||
    !progressPercentage
  ) {
    return NextResponse.json({
      message: "Missing parameters in request body",
      status: 400,
    });
  }

  const result = await upsertCourseProgress({
    userId,
    courseId,
    siteId,
    lastUnitId,
    progress,
    progressPercentage,
  });

  return NextResponse.json(result, { status: result.status });
}

export async function PUT(request: NextRequest) {
  const { userId, courseId, siteId, lastUnitId, progress, progressPercentage } =
    await request.json();

  if (
    !userId ||
    !courseId ||
    !siteId ||
    !lastUnitId ||
    !progress ||
    !progressPercentage
  ) {
    return NextResponse.json({
      message: "Missing parameters in request body",
      status: 400,
    });
  }

  const result = await upsertCourseProgress({
    userId,
    courseId,
    siteId,
    lastUnitId,
    progress,
    progressPercentage,
  });

  return NextResponse.json(result, { status: result.status });
}
