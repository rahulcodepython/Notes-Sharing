import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

// Optimistic check on the cookie only. Real session validation happens in every API handler.
export function proxy(request: NextRequest) {
  const hasSession = getSessionCookie(request) !== null;
  const isLogin = request.nextUrl.pathname === "/login";

  if (!hasSession && !isLogin) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  if (hasSession && isLogin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*", "/communities/:path*", "/explore/:path*", "/settings/:path*", "/c/:path*", "/invite/:path*"],
};
