import { describe, it } from "node:test";
import assert from "node:assert";
import { sendWelcomeEmail, sendBookingConfirmation, sendModificationAlert, sendCancellationNotice } from "@/lib/resend";

describe("Resend Mail Dispatcher Template Tests", () => {
  it("should format and dispatch welcome email successfully", async () => {
    const res = await sendWelcomeEmail("guest-test@aurelia.com", "Lady Guinevere");
    assert.strictEqual(res.success, true);
  });

  it("should format and dispatch booking confirmation successfully", async () => {
    const res = await sendBookingConfirmation("guest-test@aurelia.com", "Lady Guinevere", {
      id: "mock-res-id-12345",
      type: "Lodging",
      date: new Date().toISOString(),
      guests: 2,
      bookedRoomName: "Mayfair Penthouse Suite",
    });
    assert.strictEqual(res.success, true);
  });

  it("should format and dispatch modification alerts successfully", async () => {
    const res = await sendModificationAlert("guest-test@aurelia.com", "Lady Guinevere", {
      id: "mock-res-id-12345",
      type: "Spa",
      date: new Date().toISOString(),
      guests: 1,
      bookedRoomName: "Thermal Cabin Spa Retreat",
    });
    assert.strictEqual(res.success, true);
  });

  it("should format and dispatch cancellation notices successfully", async () => {
    const res = await sendCancellationNotice("guest-test@aurelia.com", "Lady Guinevere", {
      id: "mock-res-id-12345",
      type: "Experience",
      date: new Date().toISOString(),
      bookedRoomName: "Royal Mayfair Art Tour Tour",
    });
    assert.strictEqual(res.success, true);
  });
});
