import { describe, it } from "node:test";
import assert from "node:assert";
import { eventInquirySchema } from "./schema";

describe("Event Inquiry Schema Validation Tests", () => {
  it("should pass validation with valid wedding inquiry fields", () => {
    const validData = {
      name: "Elizabeth Bennet",
      email: "elizabeth@pemberley.com",
      phone: "+44 7911 123456",
      eventType: "wedding",
      guests: 150, // Within 50 - 300 range
      date: "2026-09-20",
      message: "Requesting white rose arches, seating layout, and harpist catering.",
    };

    const result = eventInquirySchema.safeParse(validData);
    assert.ok(result.success);
  });

  it("should fail wedding validation when guests size is too small", () => {
    const invalidData = {
      name: "Elizabeth Bennet",
      email: "elizabeth@pemberley.com",
      phone: "+44 7911 123456",
      eventType: "wedding",
      guests: 40, // Minimum is 50
      date: "2026-09-20",
      message: "Requesting white rose arches, seating layout.",
    };

    const result = eventInquirySchema.safeParse(invalidData);
    assert.ok(!result.success);
  });

  it("should fail wedding validation when guests size is too large", () => {
    const invalidData = {
      name: "Elizabeth Bennet",
      email: "elizabeth@pemberley.com",
      phone: "+44 7911 123456",
      eventType: "wedding",
      guests: 350, // Maximum is 300
      date: "2026-09-20",
      message: "Requesting white rose arches, seating layout.",
    };

    const result = eventInquirySchema.safeParse(invalidData);
    assert.ok(!result.success);
  });

  it("should pass validation with valid corporate event inquiry fields", () => {
    const validData = {
      name: "Elizabeth Bennet",
      email: "elizabeth@pemberley.com",
      phone: "+44 7911 123456",
      eventType: "corporate",
      guests: 200, // Within 20 - 500 range
      date: "2026-09-20",
      message: "Need projectors, standard sound system, microphones and business lunches.",
    };

    const result = eventInquirySchema.safeParse(validData);
    assert.ok(result.success);
  });
});
