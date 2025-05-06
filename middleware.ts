import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host");
  const isImageOptimizationRequest = url.pathname === "/_next/image";
  const jwt = req.cookies.get("jwt")?.value;
  const userDetails = req.cookies.get("userDetails")?.value;
  const adminJwt = req.cookies.get("adminjwt")?.value;
  const lecturerJwt = req.cookies.get("lecturerjwt")?.value;



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
  const lecturerHost = process.env.NEXT_PUBLIC_HOSTNAME_LECTURER as string;
  const isLocalhost = host?.includes("localhost");


  if (host) {
    const subdomain = host.split(".")[0];
    if (subdomain && subdomain !== "www") {
      const dynamicUrl = `https://${host}`;
      req.headers.set("NEXTAUTH_URL", dynamicUrl);
      console.log('Dynamically setting NEXTAUTH_URL:', dynamicUrl);
    }
  }

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

  // For localhost lecturer routes
  if (isLocalhost && url.pathname.startsWith("/lecturer")) {
    if (isStaticAsset || isImageOptimizationRequest) {
      return NextResponse.next();
    }

    if (!lecturerJwt && url.pathname !== "/lecturer/login") {
      return NextResponse.redirect(new URL("/lecturer/login", req.url));
    }

    if (lecturerJwt && url.pathname === "/lecturer/login") {
      return NextResponse.redirect(
        new URL("/lecturer/dashboard/overview", req.url)
      );
    }

    return NextResponse.next();
  }

  if (
    host?.includes(examinaHost) &&
    !host?.includes("admin") &&
    url.pathname.startsWith("/admin")
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    host?.includes(examinaHost) &&
    !host?.includes("admin") && !host?.includes("lecturer") &&
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

    if (!adminJwt) {
      if (url.pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } else {
      if (url.pathname === "/" || url.pathname === "/login") {
        return NextResponse.redirect(new URL("/dashboard/overview", req.url));
      }
    }

    if (url.pathname.startsWith("/admin")) {
      const newPath = url.pathname.replace("/admin", "");
      const newUrl = new URL(newPath, req.url);
      newUrl.search = url.search;
      return NextResponse.redirect(newUrl);
    }

    if (url.pathname.startsWith("/admin/dashboard/exams/questions-bank/view-questions")) {
      const id = url.pathname.split("/").pop();
      const newUrl = new URL(`/admin/dashboard/exams/questions-bank/view-questions/${id}`, req.url);
      return NextResponse.redirect(newUrl);
    }

    const targetPath = `/admin${url.pathname}`;
    return NextResponse.rewrite(new URL(targetPath, req.url));
  }

  // Handle lecturer subdomain routing
  if (host?.includes(lecturerHost)) {
    // Allow static assets to pass through
    if (isStaticAsset || isImageOptimizationRequest) {
      return NextResponse.next();
    }

    // THEN: Allow /api to pass through
    if (url.pathname.startsWith("/api")) {
      console.log("API request detected, allowing through middleware.");
      console.log("Request URL:", req.url);
      console.log("Request Pathname:", url.pathname);
      return NextResponse.next();
    }

    if (!lecturerJwt) {
      if (url.pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } else {
      if (url.pathname === "/" || url.pathname === "/login") {
        return NextResponse.redirect(new URL("/dashboard/overview", req.url));
      }
    }

    if (url.pathname.startsWith("/lecturer")) {
      const newPath = url.pathname.replace("/lecturer", "");
      const newUrl = new URL(newPath, req.url);
      newUrl.search = url.search;
      return NextResponse.redirect(newUrl);
    }

    const targetPath = `/lecturer${url.pathname}`;
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