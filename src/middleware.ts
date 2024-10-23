import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const tokenObj = request.cookies.get('token');
  const token = tokenObj?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ['/trips/:path*', '/profile'] };
