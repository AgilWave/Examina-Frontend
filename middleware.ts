import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone(); // Clone to avoid mutation
    const host = req.headers.get('host');

    if (host?.includes('examina.live') && !host.includes('admin') && url.pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Handle admin subdomain
    if (host?.includes('admin.examina.live')) {
        // Ensure all routes are prefixed with /admin, but preserve static assets
        if (!url.pathname.startsWith('/admin') &&
            !url.pathname.startsWith('/_next/') && // Preserve Next.js static assets
            !url.pathname.startsWith('/favicon.ico') &&
            !url.pathname.startsWith('/images/') &&
            !url.pathname.endsWith('.css')) {
            url.pathname = `/admin${url.pathname}`;
            return NextResponse.rewrite(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/:path*',
        '/_next/static/:path*',
        '/favicon.ico',
        '/images/:path*'
    ],
};