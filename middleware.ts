import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host");
  const isImageOptimizationRequest = url.pathname === "/_next/image";
  const jwt = req.cookies.get("jwt")?.value;
  const userDetails = req.cookies.get("userDetails")?.value;
  const adminJwt = req.cookies.get("adminjwt")?.value;

  const staticAssetPatterns = [
    "/_next/static",
    "/_next/image",
    "/_next/static/media",
    "/favicon.ico",
    "/manifest.json",
    "/robots.txt",
    "/sitemap.xml",
    "/images/",
    "/icons/",
  ];

  const isStaticAsset = staticAssetPatterns.some(
    (path) => url.pathname.includes(path) || url.pathname.startsWith(path)
  );

  const examinaHost = process.env.NEXT_PUBLIC_HOSTNAME_EXAMINA as string;
  const adminHost = process.env.NEXT_PUBLIC_HOSTNAME_ADMIN as string;
  const isLocalhost = host?.includes("localhost");

  // For localhost admin routes
  if (isLocalhost && url.pathname.startsWith("/admin")) {
    if (isStaticAsset || isImageOptimizationRequest) {
      return NextResponse.next();
    }

    if (!adminJwt && url.pathname !== "/admin/login") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    if (adminJwt && url.pathname === "/admin/login") {
      return NextResponse.redirect(
        new URL("/admin/dashboard/overview", req.url)
      );
    }

    return NextResponse.next();
  }

  // Handle main domain routing
  if (
    host?.includes(examinaHost) &&
    !host?.includes("admin") &&
    url.pathname.startsWith("/admin")
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    host?.includes(examinaHost) &&
    !host?.includes("admin") &&
    !isStaticAsset
  ) {
    if (!jwt && !userDetails) {
      if (url.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.next();
    } else {
      if (url.pathname === "/login") {
        return NextResponse.redirect(new URL("/dashboard/overview", req.url));
      }
      if (url.pathname === "/" || url.pathname === "/login") {
        return NextResponse.redirect(new URL("/dashboard/overview", req.url));
      }

      return NextResponse.next();
    }
  }

  // Handle admin subdomain routing
  if (host?.includes(adminHost)) {
    // Allow static assets to pass through
    if (isStaticAsset || isImageOptimizationRequest) {
      return NextResponse.next();
    }

    // Handle authentication for admin routes
    if (!adminJwt) {
      if (url.pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } else {
      if (url.pathname === "/" || url.pathname === "/login") {
        return NextResponse.redirect(new URL("/dashboard/overview", req.url));
      }
    }
    
    // For other routes on admin subdomain, remove /admin prefix if it exists
    if (url.pathname.startsWith("/admin")) {
      const newPath = url.pathname.replace("/admin", "");
      return NextResponse.redirect(new URL(newPath, req.url));
    }

    if (url.pathname.startsWith("/admin/dashboard/exams/questions-bank/view-questions")) {
      const id = url.pathname.split("/").pop();
      const newUrl = new URL(`/admin/dashboard/exams/questions-bank/view-questions/${id}`, req.url);
      return NextResponse.redirect(newUrl);
    }
    
    // On admin subdomain, all paths need to be internally rewritten to /admin/* 
    // This makes requests like admin.examina.live/dashboard/... route to the files in /app/admin/dashboard/...
    const targetPath = `/admin${url.pathname}`;
    console.log(`[Middleware] Rewriting ${url.pathname} to ${targetPath} on ${host}`);
    return NextResponse.rewrite(new URL(targetPath, req.url));
  }
}

export const config = {
  matcher: [
    "/:path*",
    "/_next/static/:path*",
    "/_next/image",
    "/_next/static/media/:path*",
    "/favicon.ico",
    "/manifest.json",
    "/robots.txt",
    "/sitemap.xml",
  ],
};