import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { hash } from "bcrypt";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  const isValidResponse = await fetch(
    `${process.env.NEXT_PUBLIC_ROOT_URL}/api/validate-token?token=${token}`
  );
  const { isValid } = await isValidResponse.json();
  if (!isValid) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }
  const { email } = await prisma.passwordResetToken.findUnique({
    where: { token },
  });
  if (!email) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  try {
  const hashedPassword = await hash(password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { hashedPassword },
    });
    await prisma.passwordResetToken.delete({ where: { token } });
    return NextResponse.json({ status: 200, success: "Password updated" });
  } catch (error) {
    return NextResponse.json({ status: 500, error: "Error updating password" });
  }
}
