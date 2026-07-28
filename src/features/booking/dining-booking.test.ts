import { describe, it } from "node:test";
import assert from "node:assert";
import { reservationSchema } from "./schema";

describe("Dining Reservation Schema Validation Tests", () => {
  it("should pass validation with valid dining details and special requests", () => {
    const validData = {
      name: "Arthur Pendragon",
      email: "arthur@camelot.com",
      phone: "+44 7911 123456",
      date: "2026-08-15",
      checkOutDate: null,
      time: "19:30",
      guests: 4,
      restaurantId: "restaurant-uuid-1",
      promoCode: "MICHELIN10",
      specialRequests: "Anniversary window table setup",
      dietaryRequirements: "Nut allergy, gluten free",
    };

    const result = reservationSchema.safeParse(validData);
    assert.ok(result.success);
  });

  it("should allow null or empty strings for optional dining requests", () => {
    const validData = {
      name: "Arthur Pendragon",
      email: "arthur@camelot.com",
      phone: "+44 7911 123456",
      date: "2026-08-15",
      checkOutDate: null,
      time: "18:00",
      guests: 2,
      restaurantId: "restaurant-uuid-1",
      specialRequests: "",
      dietaryRequirements: null,
    };

    const result = reservationSchema.safeParse(validData);
    assert.ok(result.success);
  });

  it("should fail validation with invalid guests party count size", () => {
    const invalidData = {
      name: "Arthur Pendragon",
      email: "arthur@camelot.com",
      phone: "+44 7911 123456",
      date: "2026-08-15",
      time: "19:00",
      guests: 0, // Min is 1
      restaurantId: "restaurant-uuid-1",
    };

    const result = reservationSchema.safeParse(invalidData);
    assert.ok(!result.success);
  });
});
