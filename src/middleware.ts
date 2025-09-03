import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ['/sign-in', '/sign-up', '/verify'];
    const protectedRoutes = ['/code-editor', '/blogs'];

    // Redirect authenticated users away from auth pages
    if (token && publicRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/code-editor', request.url));
    }

    // Redirect authenticated users from root to code-editor
    if (token && pathname === '/') {
        return NextResponse.redirect(new URL('/code-editor', request.url));
    }

    // Protect routes that require authentication
    if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }
        
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/sign-in', 
        '/sign-up',
        '/verify',
        '/code-editor/:path*',
        '/blogs/:path*',
        '/'
    ]
}