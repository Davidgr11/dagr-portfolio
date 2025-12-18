import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
});

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  // - … if they start with `/admin` or `/login` (admin panel doesn't need i18n)
  matcher: ['/', '/(en|es)/:path*', '/((?!api|_next|_vercel|admin|login|.*\\..*).*)'],
};
