import { getFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { adminAuth } from '@/lib/firebaseAdmin';

const db = getFirestore();

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'No token found' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const tripRef = db.collection('trips').where('uid', '==', uid);
    const tripsSnapShot = await tripRef.get();

    const trips = tripsSnapShot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json({ message: 'Error fetching trips' }, { status: 500 });
  }
}
