import {NextRequest, NextResponse} from 'next/server';
import Negotiator from 'negotiator';

const locales = ['en', 'kn'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  const languages = new Negotiator({
    headers: { 'accept-language': request.headers.get('accept-language') || '' },
  }).languages();

  return languages.find(lang => locales.includes(lang)) || defaultLocale;
}

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)',
  ],
};
