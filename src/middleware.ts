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

  // Auth protection - mit Fallback auf Vercel Token
  let token = request.cookies.get('authToken')?.value;
  let isVercelToken = false;

  // Falls authToken undefined ist, Vercel Token als Fallback verwenden
  if (!token) {
    token = request.cookies.get('_vercel_jwt')?.value;
    isVercelToken = true;
    console.log(
      'Using Vercel token as fallback:',
      token ? 'found' : 'not found',
    );
  }

  const isAdminRoute = pathname.includes('/admin');
  const isProfileRoute = pathname.includes('/profile');

  console.log('authToken:', request.cookies.get('authToken')?.value);
  console.log('vercelToken:', request.cookies.get('_vercel_jwt')?.value);
  console.log('Using token:', token ? 'found' : 'undefined');
  console.log('Is Vercel token:', isVercelToken);

  const authStatus = request.cookies.get('authStatus')?.value;
  console.log('authStatus:', authStatus); // Should be: "authenticated"

  const isAuthenticated = authStatus === 'authenticated';
  console.log('isAuthenticated:', isAuthenticated); // Should be: true

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
      // Bei Vercel Token andere Validierung
      if (isVercelToken) {
        // Vercel Token hat andere Struktur, einfachere Validierung
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Vercel token payload:', payload);

        // Prüfen ob Token noch gültig ist
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
          return NextResponse.redirect(new URL('/login', request.url));
        }

        // Für Admin-Zugang mit Vercel Token - Sie können hier Ihre Logik anpassen
        // Z.B. bestimmte Vercel-Projekte oder Environments erlauben
        if (!payload.project || payload.environment !== 'production') {
          return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
      } else {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isTokenValid = await validateTokenSecure(token);
        console.log('isTokenValid in middleware', isTokenValid);

        if (!isTokenValid || payload.role !== 'admin') {
          return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
      }
    } catch (error) {
      console.log('Token parsing error:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
};

export default middleware;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
