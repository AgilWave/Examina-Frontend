import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host");
  const isImageOptimizationRequest = url.pathname === "/_next/image";
  const jwt = req.cookies.get("jwt")?.value; // JWT for student
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

  // Skip middleware for static assets
  if (isStaticAsset || isImageOptimizationRequest) {
    return NextResponse.next();
  }

  const examinaHost = process.env.NEXT_PUBLIC_HOSTNAME_EXAMINA as string; // have /student and /lecturer folders
  const adminHost = process.env.NEXT_PUBLIC_HOSTNAME_ADMIN as string;
  const isLocalhost = host?.includes("localhost");

  // Admin host routing (admin.examina.live)
  if (host?.includes(adminHost) && !isLocalhost) {
    console.log("Admin host detected:", host);
    
    if (!adminJwt) {
      if (url.pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } else {
      if (url.pathname === "/" || url.pathname === "/login") {
        return NextResponse.redirect(new URL("/dashboard/overview", req.url));
      }
    }

    // Remove /admin prefix if it exists and rewrite to /admin internally
    if (url.pathname.startsWith("/admin")) {
      const newPath = url.pathname.replace("/admin", "");
      const targetPath = newPath || "/";
      return NextResponse.rewrite(new URL(`/admin${targetPath}`, req.url));
    }

    // For all other paths on admin host, rewrite to /admin prefix
    const targetPath = `/admin${url.pathname}`;
    return NextResponse.rewrite(new URL(targetPath, req.url));
  }

  // Localhost admin routing
  if (isLocalhost) {
    const isAdminRoute = url.pathname.startsWith("/admin");
    
    if (isAdminRoute) {
      if (!adminJwt && url.pathname !== "/admin/login") {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
      
      if (adminJwt && url.pathname === "/admin/login") {
        return NextResponse.redirect(new URL("/admin/dashboard/overview", req.url));
      }
      
      return NextResponse.next();
    }

    // Handle non-admin routes on localhost
    const isStudentRoute = url.pathname.startsWith("/student");
    const isLecturerRoute = url.pathname.startsWith("/lecturer");
    const isLoginPage = url.pathname === "/" || url.pathname === "/login";

    if (isStudentRoute && lecturerJwt && !jwt) {
      return NextResponse.redirect(new URL("/lecturer/dashboard/overview", req.url));
    }

    if (isLecturerRoute && jwt && !lecturerJwt) {
      return NextResponse.redirect(new URL("/student/dashboard/overview", req.url));
    }

    if (isLoginPage && (jwt || lecturerJwt)) {
      if (lecturerJwt) {
        return NextResponse.redirect(new URL("/lecturer/dashboard/overview", req.url));
      }
      if (jwt) {
        return NextResponse.redirect(new URL("/student/dashboard/overview", req.url));
      }
    }

    if ((isStudentRoute && !jwt && !userDetails) || (isLecturerRoute && !lecturerJwt)) {
      if (url.pathname.startsWith("/student/dashboard") || url.pathname.startsWith("/lecturer/dashboard")) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    return NextResponse.next();
  }

  // Main examina host routing (examina.live)
  if (host?.includes(examinaHost) && !host?.includes("admin")) {
    const isStudentRoute = url.pathname.startsWith("/student");
    const isLecturerRoute = url.pathname.startsWith("/lecturer");
    const isAdminRoute = url.pathname.startsWith("/admin");
    const isLoginPage = url.pathname === "/" || url.pathname === "/login";

    // Redirect admin routes to main site
    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (isStudentRoute && lecturerJwt && !jwt) {
      return NextResponse.redirect(new URL("/lecturer/dashboard/overview", req.url));
    }

    if (isLecturerRoute && jwt && !lecturerJwt) {
      return NextResponse.redirect(new URL("/student/dashboard/overview", req.url));
    }

    if (isLoginPage && (jwt || lecturerJwt)) {
      if (lecturerJwt) {
        return NextResponse.redirect(new URL("/lecturer/dashboard/overview", req.url));
      }
      if (jwt) {
        return NextResponse.redirect(new URL("/student/dashboard/overview", req.url));
      }
    }

    if ((isStudentRoute && !jwt && !userDetails) || (isLecturerRoute && !lecturerJwt)) {
      if (url.pathname.startsWith("/student/dashboard") || url.pathname.startsWith("/lecturer/dashboard")) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};