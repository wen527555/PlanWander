import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = cookies();
    cookieStore.delete('token');
    return NextResponse.redirect('/');
  } catch (error) {
    return NextResponse.json({ message: 'Logout failed' }, { status: 500 });
  }
}
