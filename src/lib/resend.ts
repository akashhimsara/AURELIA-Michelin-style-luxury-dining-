import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_api_key_aurelia_london_2026");

const FROM_EMAIL = "AURELIA London <concierge@aurelia-dining.com>"; // Mock domain matching client domain

export async function sendWelcomeEmail(toEmail: string, name: string) {
  const subject = "Welcome to AURELIA London - The Sanctuary of Mayfair";
  const html = `
    <div style="background-color: #0c0c0c; color: #d4d4d8; font-family: 'Times New Roman', Times, serif; padding: 40px; text-align: center; border: 1px solid #d4af37; max-width: 600px; margin: 0 auto;">
      <div style="border-bottom: 1px solid #d4af37; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="color: #d4af37; font-size: 28px; letter-spacing: 4px; text-transform: uppercase; margin: 0;">AURELIA</h1>
        <p style="color: #a1a1aa; font-size: 10px; tracking-widest: 2px; text-transform: uppercase; margin: 5px 0 0 0;">London &bull; Mayfair</p>
      </div>
      
      <p style="font-size: 16px; font-weight: 300; line-height: 1.6; text-align: left;">Dear ${name},</p>
      
      <p style="font-size: 14px; font-weight: 300; line-height: 1.6; text-align: left; color: #a1a1aa;">
        It is our distinct privilege to welcome you to the exclusive guest club of AURELIA. Your guest account has been successfully verified. 
        As an esteemed patron of our Mayfair sanctuary, you now enjoy immediate access to bespoke suite arrangements, direct spa bookings, 
        and priority tasting table logs.
      </p>
      
      <div style="margin: 40px 0; text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard" style="background-color: #d4af37; color: #000000; text-decoration: none; padding: 12px 30px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-family: Arial, sans-serif; font-weight: 600; display: inline-block;">
          Enter Guest Dashboard
        </a>
      </div>
      
      <div style="border-top: 1px solid #1f1f1f; padding-top: 20px; font-size: 10px; color: #71717a; text-align: left; line-height: 1.6;">
        <p style="margin: 0;">Warmest regards,</p>
        <p style="margin: 5px 0 0 0; color: #d4af37; font-weight: 500;">The Guest Concierge Registry</p>
        <p style="margin: 5px 0 0 0;">AURELIA London, 15 Bruton Place, Mayfair W1J 6NP</p>
      </div>
    </div>
  `;

  return dispatchEmail(toEmail, subject, html);
}

export async function sendBookingConfirmation(toEmail: string, name: string, reservation: { id: string; type: string; date: string; guests: number; bookedRoomName?: string | null }) {
  const code = reservation.id.slice(0, 8).toUpperCase();
  const subject = `Booking Confirmed - Ref: AUR-${code} - AURELIA London`;
  const html = `
    <div style="background-color: #0c0c0c; color: #d4d4d8; font-family: 'Times New Roman', Times, serif; padding: 40px; text-align: center; border: 1px solid #d4af37; max-width: 600px; margin: 0 auto;">
      <div style="border-bottom: 1px solid #d4af37; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="color: #d4af37; font-size: 28px; letter-spacing: 4px; text-transform: uppercase; margin: 0;">AURELIA</h1>
        <p style="color: #a1a1aa; font-size: 10px; tracking-widest: 2px; text-transform: uppercase; margin: 5px 0 0 0;">London &bull; Mayfair</p>
      </div>
      
      <p style="font-size: 16px; font-weight: 300; line-height: 1.6; text-align: left;">Dear ${name},</p>
      
      <p style="font-size: 14px; font-weight: 300; line-height: 1.6; text-align: left; color: #a1a1aa;">
        We are delighted to confirm your upcoming reservation at AURELIA London. A summary of your luxury arrangements is catalogued below:
      </p>
      
      <div style="background-color: #121212; border: 1px solid #1f1f1f; padding: 20px; margin: 30px 0; text-align: left; font-family: Arial, sans-serif; font-size: 13px; line-height: 1.8;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1f1f1f; padding-bottom: 8px; margin-bottom: 8px;">
          <span style="color: #71717a; text-transform: uppercase; font-size: 10px;">Reference Code:</span>
          <strong style="color: #d4af37;">AUR-${code}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1f1f1f; padding-bottom: 8px; margin-bottom: 8px;">
          <span style="color: #71717a; text-transform: uppercase; font-size: 10px;">Arrangement:</span>
          <span style="color: #e4e4e7;">${reservation.bookedRoomName || reservation.type}</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1f1f1f; padding-bottom: 8px; margin-bottom: 8px;">
          <span style="color: #71717a; text-transform: uppercase; font-size: 10px;">Target Date:</span>
          <span style="color: #e4e4e7;">${new Date(reservation.date).toLocaleDateString("en-GB")}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #71717a; text-transform: uppercase; font-size: 10px;">Party Size:</span>
          <span style="color: #e4e4e7;">${reservation.guests} Guests</span>
        </div>
      </div>

      <p style="font-size: 13px; color: #a1a1aa; text-align: left; font-weight: 300; line-height: 1.6;">
        Should you require bespoke modifications, transfers, or pre-arrival styling, you may update this arrangement directly inside the guest portal.
      </p>
      
      <div style="margin: 40px 0; text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/reservations" style="background-color: #d4af37; color: #000000; text-decoration: none; padding: 12px 30px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-family: Arial, sans-serif; font-weight: 600; display: inline-block;">
          Manage Reservations
        </a>
      </div>
      
      <div style="border-top: 1px solid #1f1f1f; padding-top: 20px; font-size: 10px; color: #71717a; text-align: left; line-height: 1.6;">
        <p style="margin: 0;">Warmest regards,</p>
        <p style="margin: 5px 0 0 0; color: #d4af37; font-weight: 500;">The Guest Concierge Registry</p>
        <p style="margin: 5px 0 0 0;">AURELIA London, 15 Bruton Place, Mayfair W1J 6NP</p>
      </div>
    </div>
  `;

  return dispatchEmail(toEmail, subject, html);
}

export async function sendModificationAlert(toEmail: string, name: string, reservation: { id: string; type: string; date: string; guests: number; bookedRoomName?: string | null }) {
  const code = reservation.id.slice(0, 8).toUpperCase();
  const subject = `Booking Modified - Ref: AUR-${code} - AURELIA London`;
  const html = `
    <div style="background-color: #0c0c0c; color: #d4d4d8; font-family: 'Times New Roman', Times, serif; padding: 40px; text-align: center; border: 1px solid #d4af37; max-width: 600px; margin: 0 auto;">
      <div style="border-bottom: 1px solid #d4af37; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="color: #d4af37; font-size: 28px; letter-spacing: 4px; text-transform: uppercase; margin: 0;">AURELIA</h1>
        <p style="color: #a1a1aa; font-size: 10px; tracking-widest: 2px; text-transform: uppercase; margin: 5px 0 0 0;">London &bull; Mayfair</p>
      </div>
      
      <p style="font-size: 16px; font-weight: 300; line-height: 1.6; text-align: left;">Dear ${name},</p>
      
      <p style="font-size: 14px; font-weight: 300; line-height: 1.6; text-align: left; color: #a1a1aa;">
        Please note that your reservation at AURELIA London has been modified. The updated particulars of your booking are listed below:
      </p>
      
      <div style="background-color: #121212; border: 1px solid #1f1f1f; padding: 20px; margin: 30px 0; text-align: left; font-family: Arial, sans-serif; font-size: 13px; line-height: 1.8;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1f1f1f; padding-bottom: 8px; margin-bottom: 8px;">
          <span style="color: #71717a; text-transform: uppercase; font-size: 10px;">Reference Code:</span>
          <strong style="color: #d4af37;">AUR-${code}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1f1f1f; padding-bottom: 8px; margin-bottom: 8px;">
          <span style="color: #71717a; text-transform: uppercase; font-size: 10px;">Arrangement:</span>
          <span style="color: #e4e4e7;">${reservation.bookedRoomName || reservation.type}</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1f1f1f; padding-bottom: 8px; margin-bottom: 8px;">
          <span style="color: #71717a; text-transform: uppercase; font-size: 10px;">New Target Date:</span>
          <span style="color: #e4e4e7;">${new Date(reservation.date).toLocaleDateString("en-GB")}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #71717a; text-transform: uppercase; font-size: 10px;">Party Size:</span>
          <span style="color: #e4e4e7;">${reservation.guests} Guests</span>
        </div>
      </div>
      
      <div style="border-top: 1px solid #1f1f1f; padding-top: 20px; font-size: 10px; color: #71717a; text-align: left; line-height: 1.6;">
        <p style="margin: 0;">Warmest regards,</p>
        <p style="margin: 5px 0 0 0; color: #d4af37; font-weight: 500;">The Guest Concierge Registry</p>
        <p style="margin: 5px 0 0 0;">AURELIA London, 15 Bruton Place, Mayfair W1J 6NP</p>
      </div>
    </div>
  `;

  return dispatchEmail(toEmail, subject, html);
}

export async function sendCancellationNotice(toEmail: string, name: string, reservation: { id: string; type: string; date: string; bookedRoomName?: string | null }) {
  const code = reservation.id.slice(0, 8).toUpperCase();
  const subject = `Booking Cancelled - Ref: AUR-${code} - AURELIA London`;
  const html = `
    <div style="background-color: #0c0c0c; color: #d4d4d8; font-family: 'Times New Roman', Times, serif; padding: 40px; text-align: center; border: 1px solid #d4af37; max-width: 600px; margin: 0 auto;">
      <div style="border-bottom: 1px solid #d4af37; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="color: #d4af37; font-size: 28px; letter-spacing: 4px; text-transform: uppercase; margin: 0;">AURELIA</h1>
        <p style="color: #a1a1aa; font-size: 10px; tracking-widest: 2px; text-transform: uppercase; margin: 5px 0 0 0;">London &bull; Mayfair</p>
      </div>
      
      <p style="font-size: 16px; font-weight: 300; line-height: 1.6; text-align: left;">Dear ${name},</p>
      
      <p style="font-size: 14px; font-weight: 300; line-height: 1.6; text-align: left; color: #a1a1aa;">
        This email serves as confirmation that your reservation reference <strong style="color: #d4af37;">AUR-${code}</strong> for ${reservation.bookedRoomName || reservation.type} on ${new Date(reservation.date).toLocaleDateString("en-GB")} has been cancelled.
      </p>
      
      <p style="font-size: 13px; color: #71717a; text-align: left; font-weight: 300; line-height: 1.6; margin-top: 20px;">
        If you have questions regarding suite refunds or wish to arrange alternative stays, please consult our concierge staff.
      </p>
      
      <div style="border-top: 1px solid #1f1f1f; padding-top: 20px; font-size: 10px; color: #71717a; text-align: left; line-height: 1.6; margin-top: 40px;">
        <p style="margin: 0;">Warmest regards,</p>
        <p style="margin: 5px 0 0 0; color: #d4af37; font-weight: 500;">The Guest Concierge Registry</p>
        <p style="margin: 5px 0 0 0;">AURELIA London, 15 Bruton Place, Mayfair W1J 6NP</p>
      </div>
    </div>
  `;

  return dispatchEmail(toEmail, subject, html);
}

async function dispatchEmail(toEmail: string, subject: string, html: string) {
  try {
    const isMock = !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes("mock_");

    if (isMock) {
      console.log(`
============================================================
[MOCK MAIL SERVICE (RESEND FALLBACK)] Dispatching Email
To:      ${toEmail}
Subject: ${subject}
------------------------------------------------------------
${html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 400)}...
============================================================
      `);
      return { success: true, message: "Mock email dispatched successfully." };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [toEmail],
      subject: subject,
      html: html,
    });

    if (error) {
      console.warn("Resend API returned warning:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Resend delivery exception:", err);
    return { success: false, error: err };
  }
}
