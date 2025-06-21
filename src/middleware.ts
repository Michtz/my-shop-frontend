import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { useAuth } from '@/hooks/AuthHook';

const middleware = (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  console.log('middleware');
  // i18n redirect
  const pathnameIsMissingLocale = ['de', 'en'].every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(new URL(`/de${pathname}`, request.url));
  }
  //
  //   // Auth protection
  //   const token = request.cookies.get('auth_token')?.value;
  //   console.log(token);
  //   const isAdminRoute = pathname.includes('/admin');
  //   const isProtectedRoute =
  //     // pathname.includes('/cart') ||
  //     // pathname.includes('/checkout') ||
  //     isAdminRoute;
  //
  //   if (isAdminRoute && !token) {
  //     const loginUrl = new URL('/login', request.url);
  //     loginUrl.searchParams.set('redirect', pathname);
  //     return NextResponse.redirect(loginUrl);
  //   }
  //
  //   if (isAdminRoute && token) {
  //     try {
  //       const payload = JSON.parse(atob(token.split('.')[1]));
  //       if (payload.role !== 'admin') {
  //         return NextResponse.redirect(new URL('/unauthorized', request.url));
  //       }
  //     } catch {
  //       return NextResponse.redirect(new URL('/login', request.url));
  //     }
  //   }
  //
  //   return NextResponse.next();
};

export default middleware;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
