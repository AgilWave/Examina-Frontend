import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get('host');

  if (host?.includes('examina.live') && url.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (host?.includes('admin.examina.live')) {
    url.pathname = `/admin${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: '/:path*',
};
