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

// interface TripData {
//   tripTitle: string;
//   day: Day[];
// }

export const saveUserData = async (userInfo: UserInfo | null): Promise<void> => {
  if (!userInfo || !userInfo.uid) {
    console.error('User info is invalid:', userInfo);
    return;
  }
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

export const addPlaceToDay = async (
  tripId: string,
  dayId: string,
  newPlace: any,
  newRoute: any,
  transportMode: string = 'driving'
) => {
  try {
    const dayDocRef = doc(db, 'trips', tripId, 'days', dayId);
    const dayDoc = await getDoc(dayDocRef);
    if (!dayDoc.exists()) {
      throw new Error(`Day with id ${dayId} does not exist in trip ${tripId}`);
    }
    const placeWithRoute = {
      ...newPlace,

      route: newRoute
        ? {
            type: newRoute.type,
            transportMode,
            coordinates: newRoute.coordinates.map((coord: [number, number]) => ({
              lat: coord[1],
              lng: coord[0],
            })),
            duration: newRoute.duration,
          }
        : null,
    };
    await updateDoc(dayDocRef, {
      places: arrayUnion(placeWithRoute),
    });
  } catch (error) {
    console.error('Error adding location to Firestore:', error);
  }
};

export const getLastPlaceOfDay = async (tripId: string, dayId: string) => {
  try {
    const dayDocRef = doc(db, 'trips', tripId, 'days', dayId);
    const dayDoc = await getDoc(dayDocRef);
    if (!dayDoc.exists()) {
      throw new Error(`Day with id ${dayId} does not exist in trip ${tripId}`);
    }

    const places = dayDoc.data().places;
    if (places && places.length > 0) {
      return places[places.length - 1];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting last place from Firestore:', error);
    return null;
  }
};

export const updatePlacesForDay = async (tripId: string, dayId: string, updatePlaces: any) => {
  try {
    const dayDocRef = doc(db, 'trips', tripId, 'days', dayId);
    const dayDoc = await getDoc(dayDocRef);
    if (!dayDoc.exists()) {
      throw new Error(`Day with id ${dayId} does not exist in trip ${tripId}`);
    }
    await updateDoc(dayDocRef, {
      places: updatePlaces,
    });
    console.log('updatePlacesForDay successfully');
  } catch (error) {
    console.error('Error updating places', error);
  }
};

export const updatePlaceRoute = async (
  tripId: string,
  dayId: string,
  placeId: string,
  newRoute: any,
  transportMode: string
) => {
  try {
    const dayDocRef = doc(db, 'trips', tripId, 'days', dayId);
    const dayDoc = await getDoc(dayDocRef);
    if (!dayDoc.exists()) {
      throw new Error(`Day with id ${dayId} does not exist in trip ${tripId}`);
    }
    const places = dayDoc.data()?.places || [];
    const updatedPlaces = places.map((place: any) => {
      if (place.id === placeId) {
        return {
          ...place,
          route: {
            type: newRoute.type,
            transportMode,
            coordinates: newRoute.coordinates.map((coord: [number, number]) => ({
              lat: coord[1],
              lng: coord[0],
            })),
            duration: newRoute.duration,
          },
        };
      }
      return place;
    });

    await updateDoc(dayDocRef, {
      places: updatedPlaces,
    });

    console.log('update successfully');
  } catch (error) {
    console.error('Error updating Routes', error);
  }
};

export const deletePlace = async (tripId: string, dayId: string, placeId: any) => {
  const dayDocRef = doc(db, 'trips', tripId, 'days', dayId);
  const dayDoc = await getDoc(dayDocRef);
  if (!dayDoc.exists()) {
    throw new Error(`Day with id ${dayId} does not exist in trip ${tripId}`);
  }
  const places = dayDoc.data()?.places || [];
  const updatedPlaces = places.filter((p: any) => p.id !== placeId);
  try {
    await updateDoc(dayDocRef, {
      places: updatedPlaces,
    });
    console.log('Place removed successfully');
  } catch (error) {
    console.error('Error removing place:', error);
  }
};

export const updatePlaceStayTime = async (
  tripId: string,
  dayId: string,
  placeId: any,
  startTime: string,
  endTime: string
) => {
  const dayDocRef = doc(db, 'trips', tripId, 'days', dayId);
  const dayDoc = await getDoc(dayDocRef);
  if (!dayDoc.exists()) {
    throw new Error(`Day with id ${dayId} does not exist in trip ${tripId}`);
  }
  const places = dayDoc.data()?.places || [];
  const updatedPlaces = places.map((place: any) => {
    if (place.id === placeId) {
      return {
        ...place,
        startTime: startTime,
        endTime: endTime,
      };
    }
    return place;
  });
  try {
    await updateDoc(dayDocRef, {
      places: updatedPlaces,
    });
    console.log('Place removed successfully');
  } catch (error) {
    console.error('Error removing place:', error);
  }
};
