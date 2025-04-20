import { NextRequest, NextResponse } from "next/server";
import { getCustomDomainsMapping } from "@/app/utils/getCustomDomainsMapping";

export async function GET(request: NextRequest) {
    const result = await getCustomDomainsMapping();
    return NextResponse.json(result);
}