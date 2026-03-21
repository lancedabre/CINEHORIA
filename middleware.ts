import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname;

  // Define which routes anyone can see without logging in
  const isPublicRoute = 
  path === '/' || 
  path.startsWith('/login') ||
  path == '/manual' ||
  path === '/sitemap.xml' || 
  path === '/robots.txt';

  // 1. If user is NOT logged in and trying to access a private app route (like /dashboard)...
  if (!user && !isPublicRoute) {
     return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. If user IS logged in but tries to go to the login page or the public landing page...
  // Route them directly to their scripts.
  if (user && isPublicRoute) {
     return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

// Only run this on specific paths (ignore images, static files, etc)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|xml|txt)$).*)',
  ],
}