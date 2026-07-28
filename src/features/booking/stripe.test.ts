import { describe, it } from "node:test";
import assert from "node:assert";
import { stripe } from "@/lib/stripe";
import { createStripeSessionForReservation } from "./actions";
import { db } from "@/lib/db";

// Mock Stripe session creation to run offline
stripe.checkout.sessions.create = async (params: any) => {
  return {
    id: "session_mock_123",
    url: "https://checkout.stripe.com/pay/mock_session_123",
  } as any;
};

describe("Stripe Gateway Billing Integration Tests", () => {
  it("should successfully generate a Stripe Checkout Session for valid reservations", async () => {
    // Create guest profile context
    let user = await db.user.findFirst();
    if (!user) {
      user = await db.user.create({
        data: {
          email: "guest-stripe-billing@aurelia.com",
          name: "Lady Clara",
          phone: "+44 7911 123456",
        },
      });
    }

    // Create a mock lodging reservation with finalAmount
    const reservation = await db.reservation.create({
      data: {
        name: "Lady Clara",
        email: "guest-stripe-billing@aurelia.com",
        phone: "+44 7911 123456",
        date: new Date(),
        guests: 2,
        userId: user.id,
        bookedRoomName: "Mayfair Penthouse Suite",
        finalAmount: 1800.00,
        paymentStatus: "unpaid",
      },
    });

    const res = await createStripeSessionForReservation(reservation.id);
    assert.strictEqual(res.success, true);
    if (res.success) {
      assert.strictEqual(res.checkoutUrl, "https://checkout.stripe.com/pay/mock_session_123");
    }

    // Verify session ID was updated
    const updated = await db.reservation.findUnique({
      where: { id: reservation.id },
    });
    assert.ok(updated);
    if (updated) {
      assert.strictEqual(updated.stripeSessionId, "session_mock_123");
    }

    // Clean up
    await db.reservation.delete({ where: { id: reservation.id } });
  });

  it("should fail gracefully if reservation is missing or not found", async () => {
    const res = await createStripeSessionForReservation("non-existent-uuid");
    assert.strictEqual(res.success, false);
    if (!res.success) {
      assert.strictEqual(res.message, "Reservation record or billing details not found.");
    }
  });
});
