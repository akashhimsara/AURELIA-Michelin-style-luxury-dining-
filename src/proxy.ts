import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { hasPermission } from "./features/auth/admin-roles";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-aurelia-guest-key-123456789";
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "default-secret-aurelia-admin-key-987654321";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const adminSession = request.cookies.get("admin_session")?.value;
  const guestSession = request.cookies.get("guest_session")?.value;

  // 1. Verify Admin Session status
  let parsedAdmin: { adminId: string; email: string; role: string } | null = null;
  if (adminSession) {
    try {
      const secret = new TextEncoder().encode(ADMIN_JWT_SECRET);
      const { payload } = await jwtVerify(adminSession, secret, { algorithms: ["HS256"] });
      parsedAdmin = payload as { adminId: string; email: string; role: string };
    } catch {
      // Stale or invalid admin session
    }
  }

  // 2. Verify Guest Session status
  let parsedGuest: { userId: string; role: string } | null = null;
  if (guestSession) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(guestSession, secret, { algorithms: ["HS256"] });
      parsedGuest = payload as { userId: string; role: string };
    } catch {
      // Stale or invalid guest session
    }
  }

  // ── Redirect Admins away from guest pages ─────────────────────
  const isGuestAuthOrDashboard = ["/dashboard", "/profile", "/login", "/register"].some((path) =>
    pathname.startsWith(path)
  );

  if (isGuestAuthOrDashboard && parsedAdmin) {
    // Admins must use the admin portal
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // ── Redirect Guests away from admin pages ─────────────────────
  const isAdminPath = pathname.startsWith("/admin");
  const isAdminLoginPage = pathname === "/admin/login";

  if (isAdminPath) {
    if (isAdminLoginPage) {
      if (parsedAdmin) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // Protect all other /admin pages
    if (!parsedAdmin) {
      // If logged in as guest, redirect to guest dashboard instead of admin login
      if (parsedGuest) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-Based Access Control (RBAC) Module Check
    const pathSegments = pathname.split("/").filter(Boolean);
    const moduleName = pathSegments.length > 1 ? pathSegments[1] : "dashboard";

    if (!hasPermission(parsedAdmin.role, moduleName)) {
      console.warn(`[AURELIA RBAC] Admin role '${parsedAdmin.role}' denied access to module '${moduleName}'`);
      // Redirect unauthorized admins to the general admin landing overview page
      const redirectUrl = new URL("/admin", request.url);
      redirectUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(redirectUrl);
    }
  }

  // ── Protect guest dashboard/profile routes ────────────────────
  const isProtectedGuestRoute = ["/dashboard", "/profile"].some((path) => pathname.startsWith(path));

  if (isProtectedGuestRoute && !parsedGuest) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/admin/:path*"],
};
