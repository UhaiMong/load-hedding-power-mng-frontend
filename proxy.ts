import { type NextRequest, NextResponse } from "next/server";
import { homeFor, ROLE_COOKIE, ROLES, type Role, TOKEN_COOKIE } from "@/lib/constants";
import { canAccess } from "@/lib/routes";

/** Optimistic route protection: the backend still checks every request. */
export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  const cookieRole = req.cookies.get(ROLE_COOKIE)?.value as Role | undefined;
  const role = cookieRole && ROLES.includes(cookieRole) ? cookieRole : undefined;

  if (!token) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
  if (role && (pathname === "/admin" || !canAccess(pathname, role))) {
    return NextResponse.redirect(new URL(homeFor(role), req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
