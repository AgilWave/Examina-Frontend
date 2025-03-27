import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const host = req.headers.get('host');

    if (host?.includes('admin.examina.live')) {
        url.pathname = `/admin${url.pathname}`;
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/:path*',
};
