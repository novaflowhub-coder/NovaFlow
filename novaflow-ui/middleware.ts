import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PATHS = ["/login", "/unauthorized", "/_next", "/favicon.ico", "/api/public"]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  console.log('[MIDDLEWARE DEBUG] Request to:', pathname);
  
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    console.log('[MIDDLEWARE DEBUG] Public path, allowing through');
    return NextResponse.next();
  }

  const token = req.cookies.get("nf_token")?.value;
  console.log('[MIDDLEWARE DEBUG] Token exists:', !!token);
  
  if (!token) {
    console.log('[MIDDLEWARE DEBUG] No token, redirecting to login');
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }
  
  console.log('[MIDDLEWARE DEBUG] Token found, allowing through');
  return NextResponse.next()
}

export const config = { matcher: ["/((?!_next|favicon.ico).*)"] }
