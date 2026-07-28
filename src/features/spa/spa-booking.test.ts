import { describe, it } from "node:test";
import assert from "node:assert";
import { spaBookingSchema } from "./schema";

describe("Spa Booking Schema Validation Tests", () => {
  it("should pass validation with valid spa booking fields", () => {
    const validData = {
      name: "Arthur Pendragon",
      email: "arthur@camelot.com",
      phone: "+44 7911 123456",
      treatment: "spa-treatment-id-123",
      date: "2026-08-15",
      time: "10:30",
      guests: 2,
      notes: "Please prepare extra organic towels",
    };

    const result = spaBookingSchema.safeParse(validData);
    assert.ok(result.success);
  });

  it("should fail validation when session time format is invalid", () => {
    const invalidData = {
      name: "Arthur Pendragon",
      email: "arthur@camelot.com",
      phone: "+44 7911 123456",
      treatment: "spa-treatment-id-123",
      date: "2026-08-15",
      time: "10-30", // Invalid delimiter
      guests: 2,
    };

    const result = spaBookingSchema.safeParse(invalidData);
    assert.ok(!result.success);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      assert.ok(errors.time);
    }
  });

  it("should enforce session guest capacity limit bounds (max 4)", () => {
    const invalidData = {
      name: "Arthur Pendragon",
      email: "arthur@camelot.com",
      phone: "+44 7911 123456",
      treatment: "spa-treatment-id-123",
      date: "2026-08-15",
      time: "14:00",
      guests: 5, // Max is 4
    };

    const result = spaBookingSchema.safeParse(invalidData);
    assert.ok(!result.success);
  });
});
