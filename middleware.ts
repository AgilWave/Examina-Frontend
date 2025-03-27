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

        if (url.pathname.startsWith('/admin')) {
            return NextResponse.rewrite(new URL(url.pathname.replace('/admin', ''), req.url));
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
