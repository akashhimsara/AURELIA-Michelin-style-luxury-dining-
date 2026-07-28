"use server";

import { db } from "@/lib/db";
import { generalInquirySchema, GeneralInquiryInput } from "./schema";

export async function submitGeneralInquiry(data: GeneralInquiryInput) {
  const validated = generalInquirySchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, subject, message } = validated.data;
  const sanitizedEmail = email.toLowerCase().trim();

  try {
    // 1. CRM Lead Resolution
    let user = await db.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email: sanitizedEmail,
          name,
          phone: phone || null,
        },
      });
    }

    // 2. Save Message
    const inquiry = await db.message.create({
      data: {
        name,
        email: sanitizedEmail,
        subject: `General Inquiry: ${subject}`,
        message: `Phone: ${phone}\n\nMessage:\n${message}`,
        status: "unread",
      },
    });

    // 3. Mock Console Dispatch (as in other forms)
    console.log(`
============================================================
[MOCK MAIL SERVICE] Dispatched General Inquiry Notification
To: concierge@aurelia-dining.com
From: ${sanitizedEmail}
Subject: NEW GENERAL INQUIRY - Ref: ${inquiry.id.slice(0, 8).toUpperCase()}
------------------------------------------------------------
New general inquiry received:
Guest: ${name}
Phone: ${phone}
Subject: ${subject}

Message:
${message}
============================================================
    `);

    return {
      success: true,
      inquiry: {
        id: inquiry.id,
        name: inquiry.name,
      },
    };
  } catch (error) {
    console.error("General inquiry write error:", error);
    return {
      success: false,
      message: "An error occurred while submitting your inquiry. Please verify your details.",
    };
  }
}
