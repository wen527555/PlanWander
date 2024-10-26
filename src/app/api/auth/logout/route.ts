import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const cookieStore = cookies();
    cookieStore.set('token', '', { path: '/', maxAge: -1 });
    return NextResponse.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'Logout failed' }, { status: 500 });
  }
}
