"use server";

import { cookies } from "next/headers";
import crypto from "crypto";
import { db } from "@/lib/db";
import { encrypt } from "../utils/auth";

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function loginAdmin(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  try {
    // 1. Resolve or create default admin account for zero-config onboarding
    let admin = await db.admin.findUnique({
      where: { email },
    });

    const defaultAdminEmail = "admin@aurelia.com";
    const defaultPasswordHash = hashPassword("password123");

    if (!admin && email === defaultAdminEmail) {
      admin = await db.admin.create({
        data: {
          email: defaultAdminEmail,
          passwordHash: defaultPasswordHash,
          role: "superadmin",
        },
      });
    }

    // 2. Validate user existence
    if (!admin) {
      return { error: "Invalid credentials." };
    }

    // 3. Verify password match
    const inputHash = hashPassword(password);
    if (admin.passwordHash !== inputHash) {
      return { error: "Invalid credentials." };
    }

    // 4. Create secure encrypted session token
    const sessionToken = await encrypt({
      userId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    // 5. Append cookie to request header
    const cookieStore = await cookies();
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 2 * 60 * 60, // 2 hours
    });

    return { success: true };
  } catch (error) {
    console.error("Login failure:", error);
    return { error: "An internal server error occurred." };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
