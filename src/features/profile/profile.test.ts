import { describe, it } from "node:test";
import assert from "node:assert";
import { profileUpdateSchema, changePasswordSchema } from "./schema";

describe("Guest Profile & Preferences Schema Validation", () => {
  describe("Profile Update Schema", () => {
    it("should pass when provided with valid fields", () => {
      const validData = {
        name: "Arthur Pendragon",
        phone: "+44 7911 112233",
        nationality: "British",
        emergencyContact: "Merlin: +44 7911 445566",
        pillowType: "memory",
        dietaryNotes: "No dairy products",
        avatarUrl: "https://aurelia.com/arthur.png",
      };

      const result = profileUpdateSchema.safeParse(validData);
      assert.ok(result.success);
    });

    it("should allow empty/null values for preferences and optional fields", () => {
      const validData = {
        name: "Arthur Pendragon",
        phone: "+44 7911 112233",
        nationality: "",
        emergencyContact: "",
        pillowType: null,
        dietaryNotes: null,
        avatarUrl: null,
      };

      const result = profileUpdateSchema.safeParse(validData);
      assert.ok(result.success);
    });

    it("should fail validation with invalid email/avatar URL formats", () => {
      const invalidData = {
        name: "Arthur Pendragon",
        phone: "+44 7911 112233",
        nationality: "British",
        emergencyContact: "Merlin: +44 7911 445566",
        pillowType: null,
        dietaryNotes: null,
        avatarUrl: "not-a-valid-url",
      };

      const result = profileUpdateSchema.safeParse(invalidData);
      assert.ok(!result.success);
    });
  });

  describe("Change Password Schema", () => {
    it("should validate when new password matches confirmation password", () => {
      const validData = {
        currentPassword: "oldpassword123",
        newPassword: "supersecretnew1",
        confirmPassword: "supersecretnew1",
      };

      const result = changePasswordSchema.safeParse(validData);
      assert.ok(result.success);
    });

    it("should fail validation when new passwords do not match", () => {
      const invalidData = {
        currentPassword: "oldpassword123",
        newPassword: "supersecretnew1",
        confirmPassword: "differentpassword1",
      };

      const result = changePasswordSchema.safeParse(invalidData);
      assert.ok(!result.success);
    });
  });
});
