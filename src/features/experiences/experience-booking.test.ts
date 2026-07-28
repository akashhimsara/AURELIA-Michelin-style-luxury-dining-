import { describe, it } from "node:test";
import assert from "node:assert";
import { experienceBookingSchema } from "./schema";

describe("Experiences Booking Schema Validation Tests", () => {
  it("should pass validation with valid experience booking inputs", () => {
    const validData = {
      name: "Arthur Dent",
      email: "dent@hitchhiker.org",
      phone: "+44 7911 123456",
      experience: "art-tour",
      date: "2026-09-10",
      time: "14:00",
      guests: 2,
      notes: "Need a cup of hot tea.",
    };

    const result = experienceBookingSchema.safeParse(validData);
    assert.ok(result.success);
  });

  it("should fail validation when experience select type is invalid", () => {
    const invalidData = {
      name: "Arthur Dent",
      email: "dent@hitchhiker.org",
      phone: "+44 7911 123456",
      experience: "invalid-tour", // Not enum option
      date: "2026-09-10",
      time: "14:00",
      guests: 2,
    };

    const result = experienceBookingSchema.safeParse(invalidData);
    assert.ok(!result.success);
  });

  it("should enforce guest party size limits (between 1 and 8)", () => {
    const tooManyGuests = {
      name: "Arthur Dent",
      email: "dent@hitchhiker.org",
      phone: "+44 7911 123456",
      experience: "helicopter",
      date: "2026-09-10",
      time: "12:00",
      guests: 10, // Max is 8
    };

    const result = experienceBookingSchema.safeParse(tooManyGuests);
    assert.ok(!result.success);
  });
});
