import dayjs from 'dayjs';
import { getFirestore } from 'firebase-admin/firestore';
import { NextResponse } from 'next/server';

import { adminAuth } from '@/lib/firebaseAdmin';

const db = getFirestore();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tripTitle, startDate, endDate, selectedCountries, token } = body;

    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    if (!userId) {
      return NextResponse.json({ error: 'No authenticated user found' }, { status: 401 });
    }

    if (!tripTitle || !startDate || !endDate || selectedCountries.length === 0) {
      return NextResponse.json({ error: 'Missing required trip data' }, { status: 400 });
    }

    const firstCountry = selectedCountries[0].label;
    const countryImageUrl = await fetchCountryImage(firstCountry);

    const countries = selectedCountries.map((country: any) => ({
      code: country.value,
      name: country.label,
    }));

    const tripData = {
      tripTitle,
      startDate: dayjs(startDate).format('YYYY-MM-DD'),
      endDate: dayjs(endDate).format('YYYY-MM-DD'),
      countries,
      createdAt: new Date(),
      uid: userId,
      imageUrl: countryImageUrl || '',
    };

    // const tripRef = await addDoc(collection(db, 'trips'), tripData);
    const tripRef = db.collection('trips').doc();
    await tripRef.set(tripData);
    const tripId = tripRef.id;

    // const batch = writeBatch(db);
    const batch = db.batch();
    let currentDate = dayjs(startDate);
    const end = dayjs(endDate);

    while (currentDate.isBefore(end) || currentDate.isSame(end)) {
      const formattedDate = currentDate.format('YYYY-MM-DD');
      const dayData = { date: formattedDate };
      const dayRef = tripRef.collection('days').doc(formattedDate);
      batch.set(dayRef, dayData);
      //   const dayRef = doc(collection(tripRef, 'days'), formattedDate);
      //   batch.set(dayRef, dayData);

      currentDate = currentDate.add(1, 'day');
    }

    await batch.commit();

    return NextResponse.json({ tripId }, { status: 201 });
  } catch (error) {
    console.error('Error creating trip:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function fetchCountryImage(country: string): Promise<string> {
  return `https://example.com/images/${country}.jpg`;
}
