import { type NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

const LOCALES = ["en", "ar"];

function preferredLocale(req: NextRequest) {
  const cookie = req.cookies.get("ah_locale")?.value;
  if (cookie && LOCALES.includes(cookie)) return cookie;
  const accept = req.headers.get("accept-language") || "";
  return accept.toLowerCase().startsWith("ar") ? "ar" : "en";
}

/** Absolute URL on the PUBLIC origin (behind Nginx the internal URL is 127.0.0.1:3002). */
function publicUrl(req: NextRequest, pathname: string, search = "") {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || req.nextUrl.host;
  const proto = req.headers.get("x-forwarded-proto") || req.nextUrl.protocol.replace(":", "");
  return new URL(`${pathname}${search}`, `${proto}://${host}`);
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const seg = pathname.split("/")[1];

  // 1) Locale prefix
  if (!LOCALES.includes(seg)) {
    return NextResponse.redirect(publicUrl(req, `/${preferredLocale(req)}${pathname === "/" ? "" : pathname}`, search));
  }

  // 2) Admin guard
  const isAdmin = pathname === `/${seg}/admin` || pathname.startsWith(`/${seg}/admin/`);
  const isLogin = pathname.startsWith(`/${seg}/admin/login`);
  if (isAdmin && !isLogin) {
    const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
    if (!session) {
      return NextResponse.redirect(publicUrl(req, `/${seg}/admin/login`, `?next=${encodeURIComponent(pathname)}`));
    }
  }

  const res = NextResponse.next();
  res.headers.set("x-locale", seg);
  return res;
}

export const config = {
  matcher: ["/((?!api|_next|media|brand|images|fonts|favicon.ico|icon|robots.txt|sitemap.xml|.*\\..*).*)"],
};
