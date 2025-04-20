import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(request: NextRequest) {
    const token = request.nextUrl.searchParams.get("token");
    const isValid = await prisma.passwordResetToken.findUnique({
        where: {
            token: token,
            expiresAt: {
                gt: new Date()
            }
        }
    });
    if (!isValid) {
        return NextResponse.json({ isValid: false }, { status: 400 });
    }
    return NextResponse.json({ isValid: true }, { status: 200 });
}
