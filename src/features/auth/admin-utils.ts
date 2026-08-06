import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { AdminRole, hasPermission } from "./admin-roles";

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "default-secret-aurelia-admin-key-987654321";

export { hasPermission };
export type { AdminRole };

export async function signAdminSessionToken(payload: {
  adminId: string;
  email: string;
  role: string;
}): Promise<string> {
  const secret = new TextEncoder().encode(ADMIN_JWT_SECRET);
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h") // Admin session expires in 12 hours
    .sign(secret);
}

export async function verifyAdminSessionToken(token: string): Promise<{
  adminId: string;
  email: string;
  role: string;
} | null> {
  try {
    const secret = new TextEncoder().encode(ADMIN_JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    return payload as { adminId: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}

export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });
}

export async function getAdminSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value;
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}

export async function getCurrentAdmin() {
  const token = await getAdminSessionCookie();
  if (!token) return null;
  return await verifyAdminSessionToken(token);
}
