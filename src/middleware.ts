import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;
  const loginUrl = new URL('/', request.url);

  const isHospitalRoute = pathname.startsWith('/dashhospital');
  const isDonorRoute = pathname.startsWith('/dashdonor');
  const isRedCrossRoute = pathname.startsWith('/dashredcross'); 

  if (!user && (isHospitalRoute || isDonorRoute || isRedCrossRoute)) {
    return NextResponse.redirect(loginUrl);
  }

  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.redirect(loginUrl);
    }
    
    if (isHospitalRoute && profile.role !== 'Hospital') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    if (isDonorRoute && profile.role !== 'Donor') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (isRedCrossRoute && profile.role !== 'redcross') { 
      return NextResponse.redirect(new URL('/', request.url)); 
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/dashhospital/:path*',
    '/dashdonor/:path*',
    '/dashredcross/:path*',
  ],
};