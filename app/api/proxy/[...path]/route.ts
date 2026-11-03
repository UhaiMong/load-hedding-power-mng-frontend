import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import {
  API_URL,
  ROLE_COOKIE,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  TOKEN_COOKIE,
} from "@/lib/constants";

// Endpoints whose response carries a session token: it is moved into an httpOnly cookie.
const SET_SESSION = new Set([
  "auth/login",
  "auth/verify-email",
  "auth/refresh-token",
]);
// Endpoints after which this browser's session is gone.
const CLEAR_SESSION = new Set(["auth/logout", "auth/reset-password"]);

const cookieBase = (req: NextRequest) => ({
  path: "/",
  sameSite: "lax" as const,
  secure: req.nextUrl.protocol === "https:", // Secure cookies only over https (Safari rejects them on http://localhost)
});

type Ctx = { params: Promise<{ path: string[] }> };
type Json = { data?: { token?: string; user?: { role?: string } } } | null;

async function handler(req: NextRequest, { params }: Ctx) {
  const { path } = await params;
  const target = path.join("/");
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;

  const headers = new Headers({ accept: "application/json" });
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  if (token) headers.set("authorization", `Bearer ${token}`);
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) headers.set("x-forwarded-for", forwarded);

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  let upstream: Response;
  try {
    upstream = await fetch(`${API_URL}/api/v1/${target}${req.nextUrl.search}`, {
      method: req.method,
      headers,
      body: hasBody ? await req.arrayBuffer() : undefined,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Backend is unreachable", errors: [] },
      { status: 502 },
    );
  }

  const text = await upstream.text();
  let json: Json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* non-JSON body */
  }

  // Login / verify / refresh: move the token into httpOnly cookies and hide it from the browser.
  if (upstream.ok && SET_SESSION.has(target) && json?.data?.token) {
    const { token: newToken, user } = json.data;
    delete json.data.token;
    const res = NextResponse.json(json, { status: upstream.status });
    const base = cookieBase(req);
    res.cookies.set(TOKEN_COOKIE, newToken, {
      ...base,
      httpOnly: true,
      maxAge: SESSION_MAX_AGE,
    });
    res.cookies.set(SESSION_COOKIE, "1", {
      ...base,
      httpOnly: false,
      maxAge: SESSION_MAX_AGE,
    });
    if (user?.role) {
      res.cookies.set(ROLE_COOKIE, user.role, {
        ...base,
        httpOnly: true,
        maxAge: SESSION_MAX_AGE,
      });
    }
    return res;
  }

  const res = json
    ? NextResponse.json(json, { status: upstream.status })
    : new NextResponse(text, {
        status: upstream.status,
        headers: { "content-type": "text/plain" },
      });

  // Logged out, password reset, or the backend says our token is no longer valid.
  if (CLEAR_SESSION.has(target) || (token && upstream.status === 401)) {
    for (const name of [TOKEN_COOKIE, ROLE_COOKIE, SESSION_COOKIE])
      res.cookies.delete(name);
  }
  return res;
}

export {
  handler as GET,
  handler as POST,
  handler as PATCH,
  handler as PUT,
  handler as DELETE,
};
