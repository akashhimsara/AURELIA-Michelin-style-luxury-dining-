import { describe, it } from "node:test";
import assert from "node:assert";
import { reservationSchema } from "./schema";

describe("Booking Validation Schema", () => {
  it("should pass validation with valid guest fields", () => {
    const validData = {
      name: "Lord Sterling",
      email: "sterling@belgravia.com",
      phone: "+44 7911 123456",
      date: "2026-08-15",
      time: "19:00",
      guests: 4,
      roomId: null,
      restaurantId: null,
      promoCode: "ROYAL15",
    };

    const result = reservationSchema.safeParse(validData);
    assert.ok(result.success);
  });

  it("should fail validation when email format is invalid", () => {
    const invalidData = {
      name: "Lord Sterling",
      email: "invalid-email-address",
      phone: "+44 7911 123456",
      date: "2026-08-15",
      guests: 4,
    };

    const result = reservationSchema.safeParse(invalidData);
    assert.ok(!result.success);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      assert.ok(errors.email);
      assert.strictEqual(errors.email[0], "Invalid email address");
    }
  });

  it("should enforce guest party size limits (between 1 and 10)", () => {
    const tooManyGuests = {
      name: "Lord Sterling",
      email: "sterling@belgravia.com",
      phone: "+44 7911 123456",
      date: "2026-08-15",
      guests: 15, // Max is 10
    };

    const result = reservationSchema.safeParse(tooManyGuests);
    assert.ok(!result.success);

    const tooFewGuests = {
      name: "Lord Sterling",
      email: "sterling@belgravia.com",
      phone: "+44 7911 123456",
      date: "2026-08-15",
      guests: 0, // Min is 1
    };

    const result2 = reservationSchema.safeParse(tooFewGuests);
    assert.ok(!result2.success);
  });

  it("should fail validation with a short phone number", () => {
    const shortPhone = {
      name: "Lord Sterling",
      email: "sterling@belgravia.com",
      phone: "123", // Min length 8
      date: "2026-08-15",
      guests: 4,
    };

    const result = reservationSchema.safeParse(shortPhone);
    assert.ok(!result.success);
  });
});
