"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { comparePassword, encryptPassword } from "./utils";
import {
  signAdminSessionToken,
  setAdminSessionCookie,
  clearAdminSessionCookie,
  AdminRole,
} from "./admin-utils";

const adminLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

// Auto-seed admin users if missing
async function seedAdminsIfEmpty() {
  try {
    const passwordHash = await encryptPassword("Password123!");

    const adminSeedData: { email: string; passwordHash: string; role: AdminRole }[] = [
      { email: "superadmin@aurelia.com",  passwordHash, role: "super_admin" },
      { email: "manager@aurelia.com",     passwordHash, role: "hotel_manager" },
      { email: "reception@aurelia.com",   passwordHash, role: "reception" },
      { email: "restaurant@aurelia.com",  passwordHash, role: "restaurant_manager" },
      { email: "spa@aurelia.com",         passwordHash, role: "spa_manager" },
      { email: "wedding@aurelia.com",     passwordHash, role: "wedding_manager" },
      { email: "finance@aurelia.com",     passwordHash, role: "finance" },
      { email: "housekeeping@aurelia.com",passwordHash, role: "housekeeping" },
      { email: "marketing@aurelia.com",    passwordHash, role: "marketing" },
    ];

    for (const item of adminSeedData) {
      const existing = await db.admin.findUnique({
        where: { email: item.email },
      });
      if (!existing) {
        await db.admin.create({
          data: item,
        });
      }
    }

    console.log("[AURELIA AUTH] Checked and seeded admin roles successfully.");
  } catch (error) {
    console.error("Failed to seed admin credentials:", error);
  }
}

export async function loginAdmin(data: AdminLoginInput) {
  const validated = adminLoginSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validated.data;
  const sanitizedEmail = email.toLowerCase().trim();

  try {
    // Lazy-seed first
    await seedAdminsIfEmpty();

    const admin = await db.admin.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!admin) {
      return {
        success: false,
        message: "Invalid email address or password.",
      };
    }

    const isPasswordValid = await comparePassword(password, admin.passwordHash);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid email address or password.",
      };
    }

    // Sign session token
    const token = await signAdminSessionToken({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    await setAdminSessionCookie(token);

    return {
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    };
  } catch (error) {
    console.error("Admin login error:", error);
    return {
      success: false,
      message: "An error occurred during admin authentication. Please try again later.",
    };
  }
}

export async function logoutAdmin() {
  try {
    await clearAdminSessionCookie();
    return { success: true };
  } catch (error) {
    console.error("Admin logout error:", error);
    return { success: false, message: "Could not clear admin session." };
  }
}
