import { prisma } from "@/prisma/client";
import { randomBytes } from "crypto";

export const createPasswordResetToken = async (email: string) => {
    // check if the email exists
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        return { status: 404, message: "User not found" };
    }
    // check if the has an unexpired password reset token
    const existingPasswordResetToken = await prisma.passwordResetToken.findFirst({
        where: { email, expiresAt: { gt: new Date() } },
    });
    if (existingPasswordResetToken) {
        return { status: 400, message: "You already have a password reset token. Please check your email for the link to reset your password." };
    }
    // create a token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 1); // 1 hour
    const passwordResetToken = await prisma.passwordResetToken.create({
        data: { email, token, expiresAt },
    });
    return { status: 200, message: "Token created", token: passwordResetToken };
}