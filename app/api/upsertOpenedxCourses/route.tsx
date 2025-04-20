import { NextRequest, NextResponse } from "next/server";
import { upsertOpenedxCourses } from "@/app/utils/upsertOpenedxCourses";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const openedxUrl = url.searchParams.get("openedxUrl");
    const siteId = url.searchParams.get("siteId");
    if (!openedxUrl) {
      return NextResponse.json(
        { 
            message: "Please provide an OpenEdX URL" ,
            status: 400 
        }
      );
    }

    const result = await upsertOpenedxCourses(openedxUrl, siteId);
    if (result.status !== 200) {
      return NextResponse.json(
        { 
            message: result.message,
            status: result.status
        }
      );
    }

    return NextResponse.json(
      { 
        message: "Courses fetched and synced successfully",
        result,
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { 
        message: `Server error: ${error.message}`,
        status: 500 
      }
    );
  }
}
