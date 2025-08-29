import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authApiUrl, localApiUrl } from '@/config/api.config';
import { Logger } from '@/utils/Logger.class';

const validateTokenSecure = async (token: string): Promise<boolean> => {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || localApiUrl;

    const response = await fetch(`${apiBaseUrl}${authApiUrl}/validate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    Logger.error('Token validation failed:', error);
    return false;
  }
};

const middleware = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get('language')?.value || 'de';
  const pathnameIsMissingLocale = ['de', 'en', 'fr'].every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(`/${sessionCookie || 'de'}${pathname}`, request.url),
    );
  }

  // Auth protection
  const token = request.cookies.get('authToken')?.value;
  const sessionId = request.cookies.get('sessionId')?.value;
  const sessionIdExists = request.cookies.get('sessionId');
  const isAdminRoute = pathname.includes('/admin');
  const isProfileRoute = pathname.includes('/profile');

  console.log('token:', token);
  console.log('token:', token);
  console.log('sessionIdExists:', sessionIdExists);
  console.log('sessionId:', sessionId);

  if (isAdminRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isProfileRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isTokenValid = await validateTokenSecure(token);
      if (!isTokenValid || payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
};

export default middleware;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
