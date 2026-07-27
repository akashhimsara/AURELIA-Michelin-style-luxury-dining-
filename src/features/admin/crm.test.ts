import { describe, it } from "node:test";
import assert from "node:assert";
import { calculateLTV, getLoyaltyTier } from "./utils/crm";

describe("CRM Loyalty & LTV Calculations", () => {
  describe("calculateLTV()", () => {
    it("should aggregate base stays amounts when finalAmount is present", () => {
      const reservations = [
        { finalAmount: 850, guests: 2 },
        { finalAmount: 1200, guests: 4 },
      ];
      const result = calculateLTV(reservations);
      assert.strictEqual(result, 2050);
    });

    it("should calculate estimated dining spend when finalAmount is missing", () => {
      const reservations = [
        { finalAmount: null, guests: 2 }, // 2 * 75 = 150
        { finalAmount: null, guests: 4 }, // 4 * 75 = 300
      ];
      const result = calculateLTV(reservations);
      assert.strictEqual(result, 450);
    });

    it("should correctly handle mixed lodging and dining reservations", () => {
      const reservations = [
        { finalAmount: 850, guests: 2 },  // 850
        { finalAmount: null, guests: 3 }, // 3 * 75 = 225
      ];
      const result = calculateLTV(reservations);
      assert.strictEqual(result, 1075);
    });

    it("should return 0 when reservations list is empty", () => {
      assert.strictEqual(calculateLTV([]), 0);
    });
  });

  describe("getLoyaltyTier()", () => {
    it("should return Elite Royal for LTV >= £2,000", () => {
      const tier2000 = getLoyaltyTier(2000);
      assert.strictEqual(tier2000.label, "Elite Royal");

      const tier5000 = getLoyaltyTier(5000);
      assert.strictEqual(tier5000.label, "Elite Royal");
    });

    it("should return Gold Partner for LTV between £1,000 and £1,999", () => {
      const tier1000 = getLoyaltyTier(1000);
      assert.strictEqual(tier1000.label, "Gold Partner");

      const tier1999 = getLoyaltyTier(1999.99);
      assert.strictEqual(tier1999.label, "Gold Partner");
    });

    it("should return Silver Patron for LTV between £500 and £999", () => {
      const tier500 = getLoyaltyTier(500);
      assert.strictEqual(tier500.label, "Silver Patron");

      const tier999 = getLoyaltyTier(999.99);
      assert.strictEqual(tier999.label, "Silver Patron");
    });

    it("should return Standard Guest for LTV below £500", () => {
      const tier0 = getLoyaltyTier(0);
      assert.strictEqual(tier0.label, "Standard Guest");

      const tier499 = getLoyaltyTier(499.99);
      assert.strictEqual(tier499.label, "Standard Guest");
    });
  });
});
