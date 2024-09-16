import dayjs from 'dayjs';
import { getAuth } from 'firebase/auth';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';

import { db } from '../lib/firebaseConfig';

interface UserInfo {
  uid: string;
  displayName?: string | null;
  email: string;
  photoURL?: string | null;
}

interface Day {
  date: string;
}

interface TripData {
  tripTitle: string;
  day: Day[];
}

export const saveUserData = async (userInfo: UserInfo | null): Promise<void> => {
  if (!userInfo || !userInfo.uid) {
    console.error('User info is invalid:', userInfo);
    return;
  }
  console.log('userInfo', userInfo);
  const userData = {
    uid: userInfo.uid,
    userName: userInfo.displayName ?? '',
    email: userInfo.email,
    photoURL: userInfo.photoURL ?? '',
    createAt: new Date(),
  };

  try {
    await setDoc(doc(db, 'users', userInfo.uid), userData, { merge: true });
  } catch (error) {
    console.log('error', error);
  }
};

export const createNewTrip = async (tripTitle: string, startDate: Date, endDate: Date): Promise<string> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('No authenticated user found');
    }

    const userId = user.uid;

    if (!startDate || !endDate || !tripTitle || !userId) {
      throw new Error('Missing required trip data');
    }

    const tripData = {
      tripTitle,
      startDate: dayjs(startDate).format('YYYY-MM-DD'),
      endDate: dayjs(endDate).format('YYYY-MM-DD'),
      createdAt: new Date(),
      uid: userId,
    };

    const tripRef = await addDoc(collection(db, 'trips'), tripData);
    const tripId = tripRef.id;
    const batch = writeBatch(db);

    let currentDate = dayjs(startDate);
    const end = dayjs(endDate);

    while (currentDate.isBefore(end) || currentDate.isSame(end)) {
      const formattedDate = currentDate.format('YYYY-MM-DD');

      const dayData = {
        date: formattedDate,
      };

      const dayRef = doc(collection(tripRef, 'days'), formattedDate);
      batch.set(dayRef, dayData);

      currentDate = currentDate.add(1, 'day');
    }

    await batch.commit();
    console.log('Trip created and days added to Firestore successfully');
    return tripId;
  } catch (error) {
    console.error('Error creating trip: ', error);
    throw error;
  }
};

export const fetchTripData = async (tripId: string) => {
  if (!tripId) return;
  try {
    const tripRef = doc(db, 'trips', tripId as string);
    const tripSnapshot = await getDoc(tripRef);
    if (!tripSnapshot.exists()) {
      throw new Error('No such trip found');
    }
    const tripData = tripSnapshot.data();
    const tripTitle = tripData?.tripTitle || '';
    const daysCollection = collection(db, `trips/${tripId}/days`);
    const daysSnapshot = await getDocs(daysCollection);
    const daysData = daysSnapshot.docs.map((doc) => doc.data() as Day);

    return {
      tripTitle,
      days: daysData,
    };
  } catch (error) {
    console.error('Error fetching trip days:', error);
  }
};

export const addPlaceToDay = async (tripId: string, dayId: string, newPlace: any) => {
  try {
    const dayDocRef = doc(db, 'trips', tripId, 'days', dayId);
    const dayDoc = await getDoc(dayDocRef);
    if (!dayDoc.exists()) {
      throw new Error(`Day with id ${dayId} does not exist in trip ${tripId}`);
    }
    await updateDoc(dayDocRef, {
      places: arrayUnion(newPlace),
    });
  } catch (error) {
    console.error('Error adding location to Firestore:', error);
  }
};
