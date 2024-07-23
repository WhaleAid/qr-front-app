
import { clearUser } from '@/lib/features/user/userSlice';
import { getAuthCookies } from '@/utils/cookies';
import { Middleware, isAnyOf } from '@reduxjs/toolkit';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { accessToken } = getAuthCookies();

    const publicPaths = [
        '/authentication'
    ];

    if (!publicPaths.includes(request.nextUrl.pathname) && !accessToken) {
        const url = request.nextUrl.clone();
        url.pathname = '/authentication';
        return NextResponse.redirect(url);
    }

    if (accessToken) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export const resetStateOnLogout: Middleware = (store) => (next) => (action) => {
    if (isAnyOf(clearUser)(action)) {
        // Reset other states if necessary
        // store.dispatch(otherSlice.actions.resetState());
    }
    return next(action);
};