import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/prisma/client";
import Stripe from "stripe";


export async function POST(req: NextRequest) {
  const {
    courseId,
    siteId,
    courseName,
    price,
    successUrl,
    cancelUrl,
    customerEmail,
    customerName,
  } = await req.json();

  try {
    const site = await prisma.site.findUnique({
      where: {
        id: siteId,
      },
    });
    if (!site) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      );
    }
    const stripe = new Stripe(site.stripeSecretKey, {
      apiVersion: "2024-12-18.acacia",
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: courseName,
            },
            unit_amount: price * 100, // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: {
        courseId,
        siteId,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
