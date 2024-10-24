import { getFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { adminAuth } from '@/config/firebaseAdmin';

const db = getFirestore();

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      const newUser = {
        uid,
        displayName: decodedToken.name ?? '',
        email: decodedToken.email ?? '',
        photoURL: decodedToken.picture ?? '',
        createdAt: new Date(),
      };
      await userRef.set(newUser);
    }

    cookies().set('token', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    const userData = userDoc.exists ? userDoc.data() : { ...decodedToken, uid };
    return NextResponse.json({ userData });
  } catch (error) {
    console.error('Error during token verification or saving user data', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
