import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: [
        "card",
        "oxxo",
      ],
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: "A Fist Bump 🤜🤛",
              description: "The most valuable product in the world.",
            },
            unit_amount: 10000, // $100 MXN ≈ $5 USD
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/StripeTest/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/StripeTest/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
