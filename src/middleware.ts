import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Routes that require strict server-side authentication
const PROTECTED_ROUTES = [
  '/admin',
  '/onboarding',
];

// Routes accessible only when NOT authenticated (redirect to /home if already logged in)
const AUTH_ONLY_ROUTES = [
  '/auth',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/public') ||
    pathname.includes('.') // files with extensions (images, fonts, etc.)
  ) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Create Supabase server client (reads cookies)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: request.headers } });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ── Guard: Root / → redirect to /home immediately ──
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  const isProtected = PROTECTED_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));
  const isAuthOnly = AUTH_ONLY_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));
  const isAdmin = pathname.startsWith('/admin');

  // Only perform remote session check if accessing protected, auth-only, or admin routes
  if (isProtected || isAuthOnly || isAdmin) {
    let user = null;
    if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://dummy.supabase.co') {
      user = { id: 'dummy-user-id', email: 'test@yamplelabs.com' } as any;
    } else {
      try {
        const { data } = await supabase.auth.getUser();
        user = data?.user ?? null;
      } catch (e) {}
    }

    if (isProtected && !user) {
      const loginUrl = new URL('/auth', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAuthOnly && user) {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://dummy.supabase.co') {
        return NextResponse.redirect(new URL('/home', request.url));
      }
    }

    if (isAdmin && user) {
      const { data: adminRole } = await supabase
        .from('admin_roles')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!adminRole) {
        return NextResponse.redirect(new URL('/home', request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public directory files
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*).*)',
  ],
};
