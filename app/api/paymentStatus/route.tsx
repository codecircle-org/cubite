import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function POST(request: NextRequest) {
  const { courseId, siteId, email } = await request.json();
  try {
    const payment = await prisma.payment.findFirst({
      where: {
        courseId: courseId,
        siteId: siteId,
        email: email,
      },
    });
    if (!payment) {
      return NextResponse.json({
        status: 404,
        message: "Payment not found",
        paymentStatus: {
          status: "unpaid",
        },
      });
    }
    const paymentStatus = {
      status: payment?.status,
      isEnrolled: payment?.isEnrolled,
    };
    return NextResponse.json({
      status: 200,
      message: "Payment status retrieved successfully",
      paymentStatus: paymentStatus,
    });
  } catch (error) {
    return NextResponse.json({
        status:404,
        message: "Payment not found",
        paymentStatus: {
            status: "unpaid",
        },
    });
  }
}
