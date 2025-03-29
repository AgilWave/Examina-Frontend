import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const host = req.headers.get('host');
    const isImageOptimizationRequest = url.pathname === '/_next/image';
    const jwt = req.cookies.get('jwt')?.value;
    const adminJwt = req.cookies.get('adminjwt')?.value;

    const staticAssetPatterns = [
        '/_next/static',
        '/_next/image',
        '/_next/static/media',
        '/favicon.ico',
        '/manifest.json',
        '/robots.txt',
        '/sitemap.xml',
        '/images/',
        '/icons/',
    ];

    const isStaticAsset = staticAssetPatterns.some(path =>
        url.pathname.includes(path) || url.pathname.startsWith(path)
    );

    const examinaHost = process.env.NEXT_PUBLIC_HOSTNAME_EXAMINA as string;
    const adminHost = process.env.NEXT_PUBLIC_HOSTNAME_ADMIN as string;
    const isLocalhost = host?.includes('localhost');

    if (isLocalhost && url.pathname.startsWith('/admin')) {
        if (isStaticAsset || isImageOptimizationRequest) {
            return NextResponse.next();
        }

        if (!adminJwt && url.pathname !== '/admin/login') {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }

        if (adminJwt && url.pathname === '/admin/login') {
            return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        }

        return NextResponse.next();
    }

    if (host?.includes(examinaHost) && !host?.includes('admin') && url.pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (host?.includes(examinaHost) && !host?.includes('admin') && !isStaticAsset) {
        if (!jwt) {
            if (url.pathname.startsWith('/dashboard')) {
                return NextResponse.redirect(new URL('/login', req.url));
            }
            return NextResponse.next();
        } else {
            if (url.pathname === '/login') {
                return NextResponse.redirect(new URL('/dashboard', req.url));
            }
            return NextResponse.next();
        }
    }

    if (host?.includes(adminHost)) {
        if (isStaticAsset || isImageOptimizationRequest) {
            return NextResponse.next();
        }

        if (url.pathname.startsWith('/admin')) {
            const newPath = url.pathname.replace('/admin', '');
            return NextResponse.redirect(new URL(newPath, req.url));
        }

        if (!adminJwt) {
            if (url.pathname !== '/login') {
                return NextResponse.redirect(new URL('/login', req.url));
            }
        } else {
            if (url.pathname === '/' || url.pathname === '/login') {
                return NextResponse.redirect(new URL('/dashboard', req.url));
            }
        }

        return NextResponse.rewrite(new URL(`/admin${url.pathname}`, req.url));
    }
}

export const config = {
    matcher: [
        '/:path*',
        '/_next/static/:path*',
        '/_next/image',
        '/_next/static/media/:path*',
        '/favicon.ico',
        '/manifest.json',
        '/robots.txt',
        '/sitemap.xml'
    ],
};