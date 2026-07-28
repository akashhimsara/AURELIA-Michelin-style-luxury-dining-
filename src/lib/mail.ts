import nodemailer from "nodemailer";

interface ReservationEmailData {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string | null;
  guests: number;
  roomId: string | null;
  bookedRoomName: string | null;
  roomRateAtBooking: any;
  finalAmount: any;
}

/**
 * Sends a premium luxury confirmation email to the guest when their reservation is approved/confirmed.
 */
export async function sendConfirmationEmail(reservation: ReservationEmailData) {
  const isLodging = !!reservation.roomId;
  const bookingType = isLodging ? "Accommodation Suite" : "Dining Seating";
  const bookingCode = reservation.id.slice(0, 8).toUpperCase();
  const formattedDate = new Date(reservation.date).toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const detailLabel = isLodging
    ? `Suite Arrangement: ${reservation.bookedRoomName || "Luxury Suite"}`
    : `Seating Slot: ${reservation.time || "Full Day"}`;

  const pricingSection = reservation.finalAmount
    ? `<div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(197, 160, 89, 0.2); text-align: right;">
        <span style="font-family: 'Inter', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #a1a1aa;">Estimated Total Spend</span>
        <div style="font-family: 'Playfair Display', 'Georgia', serif; font-size: 20px; color: #c5a059; font-weight: 300; margin-top: 5px;">
          £${Number(reservation.finalAmount).toFixed(2)}
        </div>
       </div>`
    : "";

  // Luxury AURELIA branding template
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Reservation at AURELIA has been Confirmed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0c0e; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #d4d4d8; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0c0c0e; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Card Wrapper -->
        <table width="100%" class="container" style="max-width: 600px; background-color: #121214; border: 1px solid #c5a059; border-top: 3px solid #c5a059; border-collapse: separate; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
          
          <!-- Header (Logo / Branding) -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px;">
              <h1 style="margin: 0; font-family: 'Playfair Display', 'Georgia', serif; font-size: 32px; font-weight: 300; letter-spacing: 0.2em; color: #c5a059; text-transform: uppercase;">
                AURELIA
              </h1>
              <p style="margin: 5px 0 0 0; font-family: 'Playfair Display', 'Georgia', serif; font-style: italic; font-size: 11px; letter-spacing: 0.15em; color: #a1a1aa; text-transform: uppercase;">
                Michelin-Inspired Excellence
              </p>
            </td>
          </tr>
          
          <!-- Content Body -->
          <tr>
            <td style="padding: 20px 40px 40px 40px;">
              <h2 style="font-family: 'Playfair Display', 'Georgia', serif; font-size: 20px; font-weight: 300; color: #ffffff; margin-bottom: 20px; letter-spacing: 0.02em;">
                Reservation Confirmed
              </h2>
              
              <p style="font-size: 13px; line-height: 1.8; color: #a1a1aa; font-weight: 300; margin-bottom: 25px;">
                Dear ${reservation.name},
              </p>
              
              <p style="font-size: 13px; line-height: 1.8; color: #a1a1aa; font-weight: 300; margin-bottom: 30px;">
                We are delighted to inform you that your reservation request has been officially approved. Your curated ${isLodging ? "suite stay" : "gastronomic dining"} arrangement at AURELIA is now confirmed.
              </p>
              
              <!-- Reservation Summary Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: rgba(197, 160, 89, 0.03); border: 1px solid rgba(197, 160, 89, 0.15); padding: 25px;">
                <tr>
                  <td>
                    <!-- Reservation Code -->
                    <div style="margin-bottom: 15px;">
                      <span style="font-family: 'Inter', sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #a1a1aa; display: block; margin-bottom: 2px;">Booking Code</span>
                      <strong style="font-family: 'Inter', sans-serif; font-size: 14px; letter-spacing: 0.05em; color: #ffffff;">${bookingCode}</strong>
                    </div>
                    
                    <!-- Date -->
                    <div style="margin-bottom: 15px;">
                      <span style="font-family: 'Inter', sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #a1a1aa; display: block; margin-bottom: 2px;">Date</span>
                      <span style="font-size: 13px; color: #ffffff; font-weight: 400;">${formattedDate}</span>
                    </div>

                    <!-- Guests & details -->
                    <div style="margin-bottom: 15px;">
                      <span style="font-family: 'Inter', sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #a1a1aa; display: block; margin-bottom: 2px;">Party Size</span>
                      <span style="font-size: 13px; color: #ffffff; font-weight: 400;">${reservation.guests} Guests</span>
                    </div>

                    <!-- Details -->
                    <div>
                      <span style="font-family: 'Inter', sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #a1a1aa; display: block; margin-bottom: 2px;">Arrangement Details</span>
                      <span style="font-size: 13px; color: #ffffff; font-weight: 400;">${detailLabel}</span>
                    </div>

                    ${pricingSection}
                  </td>
                </tr>
              </table>
              
              <p style="font-size: 13px; line-height: 1.8; color: #a1a1aa; font-weight: 300; margin-top: 30px; margin-bottom: 20px;">
                ${isLodging 
                  ? "Our check-in begins at 15:00 PM. Should you have any special requirements, dietary restrictions, or private transportation inquiries, please reply to this email to coordinate directly with our Concierge team." 
                  : "Please note that we hold reservations for a maximum of 15 minutes, and our dress code is smart elegant. If you have any allergies or dietary notes, please let us know in advance."
                }
              </p>
              
              <p style="font-size: 13px; line-height: 1.8; color: #a1a1aa; font-weight: 300; margin-bottom: 40px;">
                We look forward to welcoming you to AURELIA for an unparalleled luxury experience.
              </p>
              
              <!-- Signature -->
              <p style="margin: 0; font-size: 13px; color: #ffffff; font-weight: 400;">
                Warmest regards,
              </p>
              <p style="margin: 5px 0 0 0; font-family: 'Playfair Display', 'Georgia', serif; font-style: italic; font-size: 12px; color: #c5a059;">
                The AURELIA Guest Relations Team
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 20px 40px; background-color: #0a0a0b; border-top: 1px solid rgba(197, 160, 89, 0.05);">
              <p style="margin: 0; font-size: 10px; color: #71717a; font-weight: 300; line-height: 1.5; letter-spacing: 0.05em;">
                AURELIA London &bull; 15 Bruton Place, Mayfair, London W1J 6NP<br>
                Tel: +44 20 7123 4567 &bull; Email: concierge@aurelia-dining.com
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // Text version fallback
  const textContent = `
AURELIA - Michelin-Inspired Excellence
============================================================

Dear ${reservation.name},

We are delighted to confirm your ${bookingType.toLowerCase()} arrangement at AURELIA. Your reservation is now approved.

Reservation Details:
------------------------------------------------------------
- Booking Code: ${bookingCode}
- Date: ${formattedDate}
- Party Size: ${reservation.guests} guests
- ${detailLabel}
${reservation.finalAmount ? `- Estimated Total Spend: £${Number(reservation.finalAmount).toFixed(2)}` : ""}

${isLodging 
  ? "Our check-in begins at 15:00 PM. Should you have any special requirements, please contact our concierge." 
  : "Please note that we hold reservations for a maximum of 15 minutes, and our dress code is smart elegant."
}

We look forward to welcoming you.

Warmest regards,
The AURELIA Guest Relations Team

------------------------------------------------------------
AURELIA London | 15 Bruton Place, Mayfair, London W1J 6NP
  `;

  // Read SMTP variables
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || "AURELIA <noreply@aurelia-dining.com>";

  if (host && port && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: parseInt(port),
        secure: parseInt(port) === 465,
        auth: {
          user,
          pass,
        },
      });

      await transporter.sendMail({
        from,
        to: reservation.email,
        subject: `Reservation Confirmed: AURELIA (${bookingCode})`,
        text: textContent,
        html: htmlContent,
      });

      console.log(`[SMTP MAIL SERVICE] Confirmation email sent successfully to ${reservation.email}`);
      return { success: true };
    } catch (error) {
      console.error("[SMTP MAIL SERVICE] Error sending email via SMTP:", error);
      // Fallback to mock log in case of SMTP failure to ensure user transaction doesn't fail
      logMockMail(reservation.email, bookingCode, textContent);
      return { success: false, error };
    }
  } else {
    // Development/Test mock fallback
    logMockMail(reservation.email, bookingCode, textContent);
    return { success: true, mocked: true };
  }
}

function logMockMail(email: string, code: string, text: string) {
  console.log(`
============================================================
[MOCK MAIL SERVICE] Dispatched Booking Confirmation Email
To: ${email}
Ref: ${code}
------------------------------------------------------------
${text.trim()}
============================================================
  `);
}
