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

  const examinaHost = process.env.NEXT_PUBLIC_HOSTNAME_EXAMINA as string; // have /student and /lecturer folders
  const adminHost = process.env.NEXT_PUBLIC_HOSTNAME_ADMIN as string;
  const isLocalhost = host?.includes("localhost");

  if (isLocalhost) {
    const isAdminRoute = url.pathname.startsWith("/admin");
    const isLoginPage = url.pathname === "/admin/login";

    if (isAdminRoute && !adminJwt) {
      if (url.pathname !== "/admin/login") {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }
    if (adminJwt) {
      if (url.pathname === "/admin/login") {
        return NextResponse.redirect(
          new URL("/admin/dashboard/overview", req.url)
        );
      } else {
        return NextResponse.next();
      }
    }
    if (isLoginPage && adminJwt) {
      return NextResponse.redirect(
        new URL("/admin/dashboard/overview", req.url)
      );
    }
  }

  if (
    host?.includes(examinaHost) &&
    !host?.includes("admin") &&
    !isStaticAsset
  ) {
    const isStudentRoute = url.pathname.startsWith("/student");
    const isLecturerRoute = url.pathname.startsWith("/lecturer");
    const isAdminRoute = url.pathname.startsWith("/admin");
    const isLoginPage = url.pathname === "/" || url.pathname === "/login";

    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (isStudentRoute && lecturerJwt && !jwt) {
      return NextResponse.redirect(
        new URL("/lecturer/dashboard/overview", req.url)
      );
    }

    if (isLecturerRoute && jwt && !lecturerJwt) {
      return NextResponse.redirect(
        new URL("/student/dashboard/overview", req.url)
      );
    }

    if (isLoginPage && (jwt || lecturerJwt)) {
      if (lecturerJwt) {
        return NextResponse.redirect(
          new URL("/lecturer/dashboard/overview", req.url)
        );
      }
      if (jwt) {
        return NextResponse.redirect(
          new URL("/student/dashboard/overview", req.url)
        );
      }
    }

    if (
      (isStudentRoute && !jwt && !userDetails) ||
      (isLecturerRoute && !lecturerJwt)
    ) {
      if (
        url.pathname.startsWith("/student/dashboard") ||
        url.pathname.startsWith("/lecturer/dashboard")
      ) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.next();
    }

    return NextResponse.next();
  }

  if (isLocalhost && !url.pathname.startsWith("/admin")) {
    const isStudentRoute = url.pathname.startsWith("/student");
    const isLecturerRoute = url.pathname.startsWith("/lecturer");
    const isLoginPage = url.pathname === "/" || url.pathname === "/login";

    if (isStudentRoute && lecturerJwt && !jwt) {
      return NextResponse.redirect(
        new URL("/lecturer/dashboard/overview", req.url)
      );
    }

    if (isLecturerRoute && jwt && !lecturerJwt) {
      return NextResponse.redirect(
        new URL("/student/dashboard/overview", req.url)
      );
    }

    if (isLoginPage && (jwt || lecturerJwt)) {
      if (lecturerJwt) {
        return NextResponse.redirect(
          new URL("/lecturer/dashboard/overview", req.url)
        );
      }
      if (jwt) {
        return NextResponse.redirect(
          new URL("/student/dashboard/overview", req.url)
        );
      }
    }

    if (
      (isStudentRoute && !jwt && !userDetails) ||
      (isLecturerRoute && !lecturerJwt)
    ) {
      if (
        url.pathname.startsWith("/student/dashboard") ||
        url.pathname.startsWith("/lecturer/dashboard")
      ) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.next();
    }

    return NextResponse.next();
  }

  if (host?.includes(adminHost)) {
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

    if (
      url.pathname.startsWith(
        "/admin/dashboard/exams/questions-bank/view-questions"
      )
    ) {
      const id = url.pathname.split("/").pop();
      const newUrl = new URL(
        `/admin/dashboard/exams/questions-bank/view-questions/${id}`,
        req.url
      );
      return NextResponse.redirect(newUrl);
    }

    const targetPath = `/admin${url.pathname}`;
    return NextResponse.rewrite(new URL(targetPath, req.url));
  }
}

export const config = {
  matcher: [
    "/_next/static/:path*",
    "/_next/image",
    "/_next/static/media/:path*",
    "/admin/:path*",
    "/student/:path*",
    "/lecturer/:path*",
    "/login",
    "/",
    "/favicon.ico",
    "/manifest.json",
    "/robots.txt",
    "/sitemap.xml",
  ],
};
