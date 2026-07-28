import { describe, it } from "node:test";
import assert from "node:assert";
import { registerSchema, loginSchema } from "./schema";
import { encryptPassword, comparePassword, signSessionToken, verifySessionToken } from "./utils";

describe("Guest Auth Feature Tests", () => {
  describe("Validation Schemas", () => {
    it("should pass registration schema with valid fields", () => {
      const validData = {
        name: "Lady Penelope",
        email: "penelope@thunderbird.com",
        phone: "+44 7911 654321",
        password: "securepassword123",
      };

      const result = registerSchema.safeParse(validData);
      assert.ok(result.success);
    });

    it("should fail registration schema with short password", () => {
      const invalidData = {
        name: "Lady Penelope",
        email: "penelope@thunderbird.com",
        phone: "+44 7911 654321",
        password: "123",
      };

      const result = registerSchema.safeParse(invalidData);
      assert.ok(!result.success);
    });

    it("should pass login schema with valid inputs", () => {
      const validData = {
        email: "penelope@thunderbird.com",
        password: "securepassword123",
      };

      const result = loginSchema.safeParse(validData);
      assert.ok(result.success);
    });
  });

  describe("Password Hashing & Matching", () => {
    it("should successfully encrypt and verify passwords", async () => {
      const password = "mysecretpassword";
      const hash = await encryptPassword(password);
      
      assert.ok(hash !== password);
      
      const isMatch = await comparePassword(password, hash);
      assert.ok(isMatch);

      const isNotMatch = await comparePassword("wrongpassword", hash);
      assert.ok(!isNotMatch);
    });
  });

  describe("JWT Session Tokens", () => {
    it("should sign and verify JWT tokens securely", async () => {
      const payload = {
        userId: "test-user-uuid",
        role: "guest",
      };

      const token = await signSessionToken(payload);
      assert.ok(token);

      const verified = await verifySessionToken(token);
      assert.ok(verified);
      assert.strictEqual(verified.userId, payload.userId);
      assert.strictEqual(verified.role, payload.role);
    });

    it("should return null for invalid tokens", async () => {
      const verified = await verifySessionToken("invalid.token.here");
      assert.strictEqual(verified, null);
    });
  });
});
