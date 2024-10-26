import dayjs from 'dayjs';
import { getFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { adminAuth } from '@/config/firebaseAdmin';

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

    const articleRef = db.collection('articles').where('uid', '==', uid);
    const articlesSnapShot = await articleRef.get();

    const articles = articlesSnapShot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: data.createdAt ? dayjs(data.createdAt.toDate()).format('YYYY-MM-DD') : null,
      };
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ message: 'Error fetching articles' }, { status: 500 });
  }
}
