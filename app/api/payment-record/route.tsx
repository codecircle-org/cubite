import { createPaymentRecord } from "../../utils/createPaymentRecord";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const { stripeId, paymentIntent, courseId, siteId, amount, amountSubtotal, amountDiscounted, amountShipping, amountTax, currency, email, customerName, status, isEnrolled } = await request.json();
    const response = await createPaymentRecord({ stripeId, paymentIntent, courseId, siteId, amount, amountSubtotal, amountDiscounted, amountShipping, amountTax, currency, email, customerName, status, isEnrolled });
    return NextResponse.json(response);
}