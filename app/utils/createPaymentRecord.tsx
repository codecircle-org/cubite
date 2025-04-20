import { prisma } from "@/prisma/client";

interface PaymentData {
    stripeId: string;
    paymentIntent: string;
    courseId: string;
    siteId: string;
    amount: number;
    amountSubtotal: number;
    amountDiscounted: number;
    amountShipping: number;
    amountTax: number;
    currency: string;
    email: string;
    customerName: string;
    status: string;
    isEnrolled: boolean;
}

export const createPaymentRecord = async (data: PaymentData) => {
    try {
        const { stripeId, paymentIntent, courseId, amount, amountSubtotal, amountDiscounted, amountShipping, amountTax, currency, email, customerName, status, isEnrolled, siteId } = data;

        // check if the payment record already exists with the same stripeId
        const existingPayment = await prisma.payment.findUnique({
            where: { stripeId }
        });

        if (existingPayment) {
            return {
                status: 400,
                message: "Payment record already exists",
            };
        }

        // create the payment record
        const payment = await prisma.payment.create({
            data: {
                stripeId,
                paymentIntent: paymentIntent || "No payment intent found",
                courseId,
                siteId,
                amount,
                amountSubtotal,
                amountDiscounted,
                amountShipping,
                amountTax,
                currency,
                email,
                customerName: customerName || email,
                status,
                isEnrolled,
            }
        })

        return {
            status: 201,
            message: "Payment record created successfully",
            payment,
        };
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            message: "Internal server error",
        };
    }
}