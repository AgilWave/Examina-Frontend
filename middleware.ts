import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const host = req.headers.get('host');

    const staticAssetPaths = [
        '/_next/static/',
        '/favicon.ico',
        '/manifest.json',
        '/robots.txt',
        '/sitemap.xml',
        '/images/',
        '/icons/'
    ];

    const isStaticAsset = staticAssetPaths.some(path =>
        url.pathname.startsWith(path)
    );

    // Redirect non-admin pages on main domain
    if (host?.includes('examina.live') && !host.includes('admin') && url.pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Handle admin subdomain
    if (host?.includes('admin.examina.live')) {
        if (isStaticAsset) {
            return NextResponse.next();
        }

        // Check for auth token cookie
        const authToken = req.cookies.get('authToken');

        // Redirect to login if no auth token and not already on login page
        if (!authToken && url.pathname !== '/login') {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        // Redirect root to login if no auth token
        if (!authToken && url.pathname === '/') {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        // Ensure admin routes are correctly rewritten
        if (url.pathname.startsWith('/admin')) {
            // Remove '/admin' prefix for internal routing
            const rewritePath = url.pathname.replace(/^\/admin/, '') || '/';
            return NextResponse.rewrite(new URL(rewritePath, req.url));
        }

        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        '/:path*',
        '/_next/static/:path*',
        '/favicon.ico',
        '/manifest.json',
        '/robots.txt',
        '/sitemap.xml'
    ],
};