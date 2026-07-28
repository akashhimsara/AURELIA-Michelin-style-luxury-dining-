import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event;
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Dev mock mode fallback for testing
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // Handle checkout session completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const reservationId = session.metadata?.reservationId;
    const sessionId = session.id;

    try {
      if (reservationId) {
        await db.reservation.update({
          where: { id: reservationId },
          data: {
            status: "confirmed",
            paymentStatus: "paid",
          },
        });
      } else if (sessionId) {
        // Search by stripeSessionId
        const res = await db.reservation.findFirst({
          where: { stripeSessionId: sessionId },
        });
        if (res) {
          await db.reservation.update({
            where: { id: res.id },
            data: {
              status: "confirmed",
              paymentStatus: "paid",
            },
          });
        }
      }
    } catch (dbErr) {
      console.error("Database update on Stripe webhook failed:", dbErr);
      return NextResponse.json({ error: "Database Update Error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
