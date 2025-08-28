import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

  // ✅ NEUES AUTH SYSTEM - authStatus Cookie verwenden
  const authStatus = request.cookies.get('authStatus')?.value;
  const isAuthenticated = authStatus === 'authenticated';

  console.log('=== AUTH DEBUG ===');
  console.log('authStatus cookie:', authStatus);
  console.log('isAuthenticated:', isAuthenticated);
  console.log('pathname:', pathname);
  console.log(
    'all cookies:',
    request.cookies
      .getAll()
      .map((c) => `${c.name}: ${c.value.substring(0, 20)}...`),
  );
  console.log('==================');

  const isAdminRoute = pathname.includes('/admin');
  const isProfileRoute = pathname.includes('/profile');

  // Redirect zu Login wenn nicht authentifiziert
  if ((isAdminRoute || isProfileRoute) && !isAuthenticated) {
    console.log('🚫 Not authenticated, redirecting to login');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin-Route: Zusätzliche Validierung über API
  if (isAdminRoute && isAuthenticated) {
    console.log('🔐 Admin route - authenticated, proceeding');
    // Das httpOnly authToken Cookie wird automatisch bei API-Calls mitgesendet
    // Echte Validierung erfolgt dann in den API Routes
  }

  if (isAuthenticated) {
    console.log('✅ Authenticated user, proceeding');
  }

  return NextResponse.next();
};

export default middleware;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
