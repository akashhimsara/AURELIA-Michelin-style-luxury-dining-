import { describe, it } from "node:test";
import assert from "node:assert";
import { reservationSchema } from "./schema";

describe("Room Booking Engine Validation Tests", () => {
  describe("Date Overlaps & Stay Ranges Validation", () => {
    it("should pass schema validation with check-out date after check-in date", () => {
      const validData = {
        name: "Arthur Pendragon",
        email: "arthur@camelot.com",
        phone: "+44 7911 123456",
        date: "2026-08-10",
        checkOutDate: "2026-08-15",
        guests: 2,
        children: 1,
        roomId: "room-suite-uuid-1",
        promoCode: "ROYAL15",
      };

      const result = reservationSchema.safeParse(validData);
      assert.ok(result.success);
    });

    it("should fail schema validation with check-out date before or equal check-in date", () => {
      const invalidData = {
        name: "Arthur Pendragon",
        email: "arthur@camelot.com",
        phone: "+44 7911 123456",
        date: "2026-08-15",
        checkOutDate: "2026-08-10", // checkout before checkin
        guests: 2,
        children: 0,
        roomId: "room-suite-uuid-1",
      };

      const result = reservationSchema.safeParse(invalidData);
      assert.ok(!result.success);
    });

    it("should fail schema validation if check-out date is missing for room booking", () => {
      const invalidData = {
        name: "Arthur Pendragon",
        email: "arthur@camelot.com",
        phone: "+44 7911 123456",
        date: "2026-08-15",
        checkOutDate: null,
        guests: 2,
        roomId: "room-suite-uuid-1",
      };

      const result = reservationSchema.safeParse(invalidData);
      assert.ok(!result.success);
    });

    it("should pass schema validation for dining booking with no check-out date specified", () => {
      const validDining = {
        name: "Arthur Pendragon",
        email: "arthur@camelot.com",
        phone: "+44 7911 123456",
        date: "2026-08-15",
        checkOutDate: null,
        time: "19:00",
        guests: 4,
        restaurantId: "restaurant-uuid-1",
      };

      const result = reservationSchema.safeParse(validDining);
      assert.ok(result.success);
    });
  });

  describe("Conflict Overlaps Calculation Utility Checks", () => {
    // Overlap function check implementation logic matching
    function simulateCheckOverlap(
      checkIn: string,
      checkOut: string,
      existingIn: string,
      existingOut: string
    ): boolean {
      const checkInDate = new Date(checkIn).getTime();
      const checkOutDate = new Date(checkOut).getTime();
      const existingInDate = new Date(existingIn).getTime();
      const existingOutDate = new Date(existingOut).getTime();

      // standard SQL check for date overlaps:
      return (
        (existingInDate <= checkInDate && existingOutDate > checkInDate) ||
        (existingInDate < checkOutDate && existingOutDate >= checkOutDate) ||
        (existingInDate >= checkInDate && existingOutDate <= checkOutDate)
      );
    }

    it("should detect overlaps when requested range is completely within booked range", () => {
      const overlapDetected = simulateCheckOverlap(
        "2026-08-12", "2026-08-14", // requested
        "2026-08-10", "2026-08-15"  // existing
      );
      assert.ok(overlapDetected);
    });

    it("should detect overlaps when requested range overlaps start of booked range", () => {
      const overlapDetected = simulateCheckOverlap(
        "2026-08-08", "2026-08-11", // requested
        "2026-08-10", "2026-08-15"  // existing
      );
      assert.ok(overlapDetected);
    });

    it("should detect overlaps when requested range overlaps end of booked range", () => {
      const overlapDetected = simulateCheckOverlap(
        "2026-08-14", "2026-08-18", // requested
        "2026-08-10", "2026-08-15"  // existing
      );
      assert.ok(overlapDetected);
    });

    it("should not detect overlaps when requested range is before booked range", () => {
      const overlapDetected = simulateCheckOverlap(
        "2026-08-01", "2026-08-09", // requested
        "2026-08-10", "2026-08-15"  // existing
      );
      assert.ok(!overlapDetected);
    });

    it("should not detect overlaps when requested range starts exactly when booked range ends", () => {
      const overlapDetected = simulateCheckOverlap(
        "2026-08-15", "2026-08-20", // requested (checkin = 15)
        "2026-08-10", "2026-08-15"  // existing (checkout = 15)
      );
      assert.ok(!overlapDetected);
    });
  });
});
