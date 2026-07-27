import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "./features/admin/utils/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Enforce administrative protection boundaries
  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get("session")?.value;
    const decrypted = session ? await decrypt(session) : null;

    const isLoginPage = pathname === "/admin/login";

    if (isLoginPage) {
      // If already authenticated, bypass login screen
      if (decrypted) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // Force redirection to login if session token is void
    if (!decrypted) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
