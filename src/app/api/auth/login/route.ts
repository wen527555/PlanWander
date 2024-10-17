import { getFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { adminAuth } from '@/lib/firebaseAdmin';

const db = getFirestore();

export async function POST(req: Request) {
  const { idToken } = await req.json();

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const cookieStore = cookies();
    cookieStore.set('token', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    const userData = userDoc.data();
    return NextResponse.json({ userData });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
