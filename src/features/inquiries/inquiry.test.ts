import { describe, it } from "node:test";
import assert from "node:assert";
import { generalInquirySchema } from "./schema";

describe("General Inquiry Validation Schema", () => {
  it("should pass validation with valid general inquiry fields", () => {
    const validData = {
      name: "Lord Sterling",
      email: "sterling@belgravia.com",
      phone: "+44 7911 123456",
      subject: "Suite details inquiry",
      message: "Please provide a details list of in-suite facilities for the Ocean Presidential Suite.",
    };

    const result = generalInquirySchema.safeParse(validData);
    assert.ok(result.success);
  });

  it("should fail validation when message is too short", () => {
    const invalidData = {
      name: "Lord Sterling",
      email: "sterling@belgravia.com",
      phone: "+44 7911 123456",
      subject: "Inquiry",
      message: "Short msg", // Min is 10
    };

    const result = generalInquirySchema.safeParse(invalidData);
    assert.ok(!result.success);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      assert.ok(errors.message);
    }
  });

  it("should fail validation when email is invalid", () => {
    const invalidData = {
      name: "Lord Sterling",
      email: "not-an-email",
      phone: "+44 7911 123456",
      subject: "Inquiry",
      message: "This is a sufficiently long message details request.",
    };

    const result = generalInquirySchema.safeParse(invalidData);
    assert.ok(!result.success);
  });
});
