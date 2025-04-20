import { getPagesBySiteDomain } from "@/app/utils/getPagesBySiteDomain";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const domainName = request.nextUrl.searchParams.get("domainName");
    if (!domainName) {
        return NextResponse.json({
            status: 400,
            message: "Domain name is required",
        });
    }

    const pages = await getPagesBySiteDomain(domainName);
    return NextResponse.json(pages);
}