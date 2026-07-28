"use server";

import { db } from "@/lib/db";
import { registerSchema, loginSchema, RegisterInput, LoginInput } from "./schema";
import { encryptPassword, comparePassword, signSessionToken, setSessionCookie, clearSessionCookie } from "./utils";
import crypto from "crypto";
import { sendWelcomeEmail } from "@/lib/resend";

export async function registerGuest(data: RegisterInput) {
  const validated = registerSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, password } = validated.data;
  const sanitizedEmail = email.toLowerCase().trim();

  try {
    const existingUser = await db.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email address already exists.",
      };
    }

    // Resolve guest role
    let role = await db.role.findUnique({
      where: { name: "guest" },
    });

    if (!role) {
      role = await db.role.create({
        data: { name: "guest" },
      });
    }

    const passwordHash = await encryptPassword(password);
    const verificationToken = crypto.randomUUID();

    const user = await db.user.create({
      data: {
        name,
        email: sanitizedEmail,
        phone,
        passwordHash,
        roleId: role.id,
        verificationToken,
      },
    });

    // Dispatch welcome email via Resend
    await sendWelcomeEmail(user.email, user.name);

    // Mock Email Verification dispatch
    console.log(`
============================================================
[MOCK MAIL SERVICE] Guest Email Verification Dispatched
To: ${sanitizedEmail}
Subject: Verify Your AURELIA Guest Account
------------------------------------------------------------
Dear ${name},

Thank you for registering at AURELIA London. Please click the link below to verify your email address and activate your luxury guest profile:

http://localhost:3000/verify-email?token=${verificationToken}

Warmest regards,
The AURELIA Guest Relations Team
============================================================
    `);

    return {
      success: true,
      message: "Registration successful. A verification link has been dispatched to your email.",
    };
  } catch (error) {
    console.error("Guest registration error:", error);
    return {
      success: false,
      message: "An error occurred while creating your account. Please try again later.",
    };
  }
}

export async function loginGuest(data: LoginInput) {
  const validated = loginSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validated.data;
  const sanitizedEmail = email.toLowerCase().trim();

  try {
    const user = await db.user.findUnique({
      where: { email: sanitizedEmail },
      include: { role: true },
    });

    if (!user || !user.passwordHash) {
      return {
        success: false,
        message: "Invalid email address or password.",
      };
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid email address or password.",
      };
    }

    // Check email verification status
    if (!user.emailVerified) {
      return {
        success: false,
        message: "Your email address has not been verified yet. Please check your inbox.",
      };
    }

    // Assign session cookie
    const token = await signSessionToken({
      userId: user.id,
      role: user.role?.name || "guest",
    });

    await setSessionCookie(token);

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Guest login error:", error);
    return {
      success: false,
      message: "An error occurred during authentication. Please try again later.",
    };
  }
}

export async function logoutGuest() {
  try {
    await clearSessionCookie();
    return { success: true };
  } catch (error) {
    console.error("Guest logout error:", error);
    return { success: false, message: "Could not clear session." };
  }
}

export async function verifyEmail(token: string) {
  if (!token) {
    return { success: false, message: "Verification token is required." };
  }

  try {
    const user = await db.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return {
        success: false,
        message: "The verification link is invalid or has expired.",
      };
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
      },
    });

    return {
      success: true,
      message: "Your email address has been verified successfully. You can now log in.",
    };
  } catch (error) {
    console.error("Email verification error:", error);
    return {
      success: false,
      message: "An error occurred during verification. Please try again later.",
    };
  }
}
