import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";

  // Skip static assets, API routes, Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/ldp") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Handle Satellite Custom Domains (e.g. forddongnai.com, longkhanhford-sale.vn)
  const cleanHost = host.replace(/^www\./i, "").split(":")[0].toLowerCase();
  const mainHosts = [
    "longkhanhford.com.vn",
    "cms.longkhanhford.com.vn",
    "betech-digital.com",
    "localhost",
    "127.0.0.1",
  ];
  const isMainDomain = mainHosts.some(
    (d) => cleanHost === d || cleanHost.endsWith(`.${d}`)
  );

  if (!isMainDomain && cleanHost) {
    try {
      const lookupUrl = `${API_BASE_URL}/ldp/lookup-domain?domain=${encodeURIComponent(cleanHost)}`;
      const res = await fetch(lookupUrl, {
        next: { revalidate: 300 },
        headers: { Accept: "application/json" },
      } as RequestInit);

      if (res.ok) {
        const json = await res.json();
        const salesSlug = json.data?.sales_slug;
        if (salesSlug) {
          const rewritePath =
            pathname === "/" ? `/ldp/${salesSlug}` : `/ldp/${salesSlug}${pathname}`;
          const url = request.nextUrl.clone();
          url.pathname = rewritePath;
          const requestHeaders = new Headers(request.headers);
          requestHeaders.set("x-pathname", rewritePath);
          return NextResponse.rewrite(url, {
            request: { headers: requestHeaders },
          });
        }
      }
    } catch {
      // Backend unavailable -> fall through
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
