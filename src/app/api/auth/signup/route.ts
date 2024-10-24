import { getFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { adminAuth } from '@/config/firebaseAdmin';

const db = getFirestore();

export async function POST(req: Request) {
  const body = await req.json();
  const { idToken } = body;

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const newUser = {
      uid: uid,
      displayName: decodedToken.name ?? '',
      email: decodedToken.email ?? '',
      photoURL: decodedToken.picture ?? '',
      createdAt: new Date(),
    };
    await userRef.set(newUser);

    const cookieStore = cookies();
    cookieStore.set('token', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    const userData = { ...newUser };
    return NextResponse.json({ userData });
  } catch (error) {
    console.error('Error during sign up or token verification', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
