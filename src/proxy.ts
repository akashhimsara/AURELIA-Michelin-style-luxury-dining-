import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-aurelia-guest-key-123456789";
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "default-secret-aurelia-admin-key-987654321";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin route protection ─────────────────────────────────
  const isAdminPath = pathname.startsWith("/admin");
  const isAdminLoginPage = pathname === "/admin/login";

  if (isAdminPath && !isAdminLoginPage) {
    const adminSession = request.cookies.get("admin_session")?.value;

    if (!adminSession) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const secret = new TextEncoder().encode(ADMIN_JWT_SECRET);
      await jwtVerify(adminSession, secret, { algorithms: ["HS256"] });
      return NextResponse.next();
    } catch {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("admin_session");
      return response;
    }
  }

  // ── Guest route protection ─────────────────────────────────
  const protectedPaths = ["/dashboard", "/profile"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected) {
    const session = request.cookies.get("guest_session")?.value;

    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(session, secret, { algorithms: ["HS256"] });
      return NextResponse.next();
    } catch {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("guest_session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/admin/:path*"],
};
