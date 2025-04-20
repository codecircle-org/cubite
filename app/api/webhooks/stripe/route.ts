import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/prisma/client";
import { addEnrollment } from "@/app/utils/addEnrollment";

export async function POST(req: NextRequest) {
  const forwardHost = req.headers.get("x-forwarded-host")
  let domainName = ""
  let site = null
  // check if the forwardHost is localhost
  if (forwardHost?.includes("localhost")) {
    const mainDomain = process.env.MAIN_DOMAIN
    const hostPortion = forwardHost?.split(".")[0]
    domainName = `${hostPortion}.${mainDomain}`
    site = await prisma.site.findFirst({
      where: {
        domainName: domainName
      }
    })
  } else if (forwardHost?.includes(process.env.MAIN_DOMAIN!)) {
    domainName = forwardHost
    site = await prisma.site.findFirst({
      where: {
        domainName: domainName
      }
    })
  } else {
    site = await prisma.site.findFirst({
      where: {
        customDomain: forwardHost
      }
    })
  }
  if(!site){
    return NextResponse.json(
      { error: "Site not found" },
      { status: 404 }
    );
  }
  // 1. Get the raw request body and Stripe signature
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;
  //create a stripe instance
  if (!site.stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is missing");
  }
  const stripe = new Stripe(site.stripeSecretKey, {
    apiVersion: "2024-12-18.acacia",
  });

  try {
    // 2. Verify this is a legitimate Stripe request
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      site.stripeWebhookSecret! // Secret from Stripe Dashboard
    );

    // 3. Handle successful payments
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const {
        id,
        payment_intent,
        metadata: { courseId, siteId },
        amount_total,
        amount_subtotal,
        total_details,
        currency,
        customer_details: { email, name },
        payment_status,
      } = session;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ROOT_URL}/api/payment-record`,
        {
          method: "POST",
          body: JSON.stringify({
            stripeId: id,
            paymentIntent: payment_intent,
            courseId,
            siteId,
            amount: amount_total,
            amountSubtotal: amount_subtotal,
            amountDiscounted: total_details?.amount_discount,
            amountShipping: total_details?.amount_shipping,
            amountTax: total_details?.amount_tax,
            currency,
            email,
            customerName: name,
            status: payment_status,
            isEnrolled: false,
          }),
        }
      );
      const paymentRecord = await response.json();
      // check if the user already exists in the site
      const user = await prisma.user.findUnique({
        where: {
          email,
          OR: [
            {
              siteRoles: {
                some: {
                  siteId,
                },
              },
            },
            {
              administratedSites: {
                some: {
                  id: siteId,
                },
              },
            },
          ],
        },
      });
      if (user) {
        // enroll the user
        const enrollment = await addEnrollment({
          courseId,
          siteId,
          name: user.name,
          email: user.email,
          username: user.username,
          status: "completed"
        });
        // update the payment record
        await prisma.payment.update({
          where: { stripeId: id },
          data: { isEnrolled: true },
        });
        if(enrollment.status === 201 || enrollment.status === 200){
          try{
            //5. Send a Thank you for your payment email
            const site = await prisma.site.findUnique({
              where: { id: siteId },
            });
            const course = await prisma.course.findUnique({
              where: { id: courseId },
            });
            const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_ROOT_URL}/api/send-email`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  site,
                  course,
                  userFirstname: user.name,
                  to: user.email,
                  subject: `Thank you for your payment for ${course?.name}`,
                  type: "paidEnrollment",
                }),
              });
          } catch (error) {
            console.log(error);
          }
        }
      }
    }

    // 6. Tell Stripe we received the event
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}
