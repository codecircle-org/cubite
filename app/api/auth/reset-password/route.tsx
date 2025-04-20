import { NextRequest, NextResponse } from "next/server";
import { createPasswordResetToken } from "@/app/utils/createPasswordResetToken";

export async function POST(req: NextRequest) {
    const { email } = await req.json();
    if (!email) {
        return NextResponse.json({ status: 400, message: "Email is required" });
    }
    const res = await createPasswordResetToken(email);
    return NextResponse.json(res);
}