import { getPendingPaidEnrollments } from "../../utils/getPendingPaidEnrollments";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const siteId = request.nextUrl.searchParams.get("siteId");
        const email = request.nextUrl.searchParams.get("email");
        if (!siteId || !email) {
            return NextResponse.json({ error: "Missing siteId or email" }, { status: 400 });
        }
        const pendingEnrollments = await getPendingPaidEnrollments({ siteId, email });
        return NextResponse.json(pendingEnrollments);
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}