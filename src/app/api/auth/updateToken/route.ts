import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { adminAuth } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    console.log('uid', uid);
    cookies().set('token', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return NextResponse.json({ message: 'Token updated' }, { status: 200 });
  } catch (error) {
    console.error('Error updating token in cookie:', error);
    return NextResponse.json({ message: 'Failed to update token', error }, { status: 500 });
  }
}
