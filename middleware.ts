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

    if (host?.includes('examina.live') && !host.includes('admin') && url.pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (host?.includes('admin.examina.live')) {
        if (isStaticAsset) {
            return NextResponse.next();
        }

        const authToken = req.cookies.get('authToken');

        // Redirect to admin login for unauthenticated requests
        if (!authToken) {
            if (url.pathname !== '/login') {
                return NextResponse.redirect(new URL('/login', req.url));
            }
        }

        // Rewrite all paths to admin routes
        return NextResponse.rewrite(new URL(`/admin${url.pathname}`, req.url));
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