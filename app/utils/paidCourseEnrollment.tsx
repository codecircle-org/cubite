import { loadStripe } from "@stripe/stripe-js"
import { decryptSecret } from "@/app/utils/secretManager";

export const handlePaidCourseEnrollment = async (
    course: any, 
    site: any,
    successUrl: string, 
    cancelUrl: string,
    user?: {
        email: string;
        name: string;
        id: string;
    }
) => {
    const stripePromise = loadStripe(
        decryptSecret(site.stripePublishableKey)
    );
    const stripe = await stripePromise;
    
    const checkoutSessionData = {
        courseId: course.id,
        siteId: site.id,
        courseName: course.name,
        price: course.price,
        successUrl,
        cancelUrl,
        customerEmail: user?.email,
        customerName: user?.name,
    };

    const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutSessionData),
    });

    const { sessionId } = await response.json();

    if (!sessionId) {
        throw new Error('Failed to create checkout session');
    }

    // Redirect to Stripe Checkout
    const result = await stripe?.redirectToCheckout({
        sessionId
    });
};