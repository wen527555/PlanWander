import dayjs from 'dayjs';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { fetchCountryImage } from '@/lib/mapApi';
import { db, storage } from '../lib/firebaseConfig';
import { useUserStore } from './store';

interface UserInfo {
  uid: string;
  displayName?: string | null;
  email: string;
  photoURL?: string | null;
}

interface Day {
  date: string;
}

interface Article {
  id: string;
  title: string;
  description: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  coverImage?: string;
}

const auth = getAuth();

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

export const fetchUserData = async () => {
  const user = auth.currentUser;
  if (user) {
    const uid = user.uid;
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      console.log('userData', userData);
      const { photoURL, userName } = userData;
      useUserStore.getState().setUserData({ photoURL, userName });
    } else {
      console.log('No such document!');
    }
  }
};

export const createNewTrip = async (
  tripTitle: string,
  startDate: Date,
  endDate: Date,
  selectedCountries: any[]
): Promise<string> => {
  try {
    const user = auth.currentUser;
    const userId = user?.uid;
    if (!userId) {
      throw new Error('No authenticated user found');
    }

    if (!startDate || !endDate || !tripTitle || !userId || selectedCountries.length === 0) {
      throw new Error('Missing required trip data');
    }
    const firstCountry = selectedCountries[0].label;
    const countryImageUrl = await fetchCountryImage(firstCountry);

    const countries = selectedCountries.map((country) => ({
      code: country.value,
      name: country.label,
    }));
    console.log('mageUrl', countryImageUrl);

    const tripData = {
      tripTitle,
      startDate: dayjs(startDate).format('YYYY-MM-DD'),
      endDate: dayjs(endDate).format('YYYY-MM-DD'),
      countries,
      createdAt: new Date(),
      uid: userId,
      imageUrl: countryImageUrl || '',
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
    console.log('Trip created and days added to FireStore successfully');
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

export const deletePlace = async (
  tripId: string,
  dayId: string,
  placeId: any
  // newRoute: any,
  // transportMode: string = 'driving'
) => {
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
    console.log('Place stayTime update successfully');
  } catch (error) {
    console.error('Error removing place:', error);
  }
};

export const getPlaceForDay = async (tripId: string, dayId: string) => {
  try {
    const datDocRef = doc(db, 'trips', tripId, 'days', dayId);
    const dayDoc = await getDoc(datDocRef);
    if (!dayDoc.exists()) {
      throw new Error(`Day with id ${dayId} does not exist in trip ${tripId}`);
    }
    const places = dayDoc.data()?.places || [];
    return places;
  } catch (error) {
    console.error('Error getting places ', error);
  }
};

export const fetchUserAllTrips = async () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userId = user.uid;
          const tripRef = collection(db, 'trips');
          const q = query(tripRef, where('uid', '==', userId));
          const querySnapshot = await getDocs(q);

          const userTrips = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
              const tripData = doc.data();
              let photo = null;
              const daysRef = collection(db, 'trips', doc.id, 'days');
              const daysSnapshot = await getDocs(daysRef);

              if (!daysSnapshot.empty) {
                const firstDayDoc = daysSnapshot.docs[0];
                const firstDayData = firstDayDoc.data();
                if (Array.isArray(firstDayData.places) && firstDayData.places.length > 0) {
                  const firstPlace = firstDayData.places[0];
                  photo = firstPlace.photo || null;
                }
              }

              return {
                id: doc.id,
                photo: photo,
                ...tripData,
              };
            })
          );

          resolve(userTrips);
        } catch (error) {
          console.error('Error fetching user trips:', error);
          reject([]);
        }
      } else {
        console.log('No user is logged in');
        resolve([]);
      }
    });
  });
};

export const createArticleFromTrip = async (tripId: string) => {
  try {
    const user = auth.currentUser;
    const userId = user?.uid;
    if (!userId) {
      throw new Error('No authenticated user found');
    }
    const tripDaysCollectionRef = collection(db, `trips/${tripId}/days`);
    const daysSnapshot = await getDocs(tripDaysCollectionRef);
    const articleRef = doc(db, `articles/${tripId}`);
    await setDoc(articleRef, {
      tripId,
      createdAt: new Date(),
      title: '',
      description: '',
      uid: userId,
    });

    daysSnapshot.forEach(async (dayDoc) => {
      const dayData = dayDoc.data();
      const articleDayRef = doc(collection(db, `articles/${tripId}/days`), dayDoc.id);
      await setDoc(articleDayRef, dayData);
    });

    console.log('Article and days created successfully!');
  } catch (error) {
    console.error('Error creating article from trip:', error);
    throw new Error('Failed to create article from trip');
  }
};

export const fetchArticleData = async (articleId: string) => {
  if (!articleId) return;
  try {
    const articleRef = doc(db, 'articles', articleId as string);
    const articleSnapshot = await getDoc(articleRef);
    if (!articleSnapshot.exists()) {
      throw new Error('No such article found');
    }
    const articleData = articleSnapshot.data();
    const coverImage = articleData?.coverImage || '';
    const title = articleData?.title || '';
    const description = articleData?.description || '';
    const daysCollection = collection(db, `articles/${articleId}/days`);
    const daysSnapshot = await getDocs(daysCollection);
    const daysData = daysSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return {
      coverImage,
      title,
      description,
      days: daysData,
    };
  } catch (error) {
    console.error('Error fetching trip days:', error);
  }
};

export const saveImageToStorage = async (placeId: string, file: File) => {
  try {
    const imageRef = ref(storage, `places/${placeId}/${file.name}`);
    const uploadResult = await uploadBytes(imageRef, file);
    const imageUrl = await getDownloadURL(uploadResult.ref);

    return imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image.');
  }
};

export const saveArticle = async (
  articleId: string,
  articleTitle: string,
  articleDescription: string,
  days: any[],
  descriptions: { [key: string]: string },
  images: { [key: string]: string },
  coverImage: string | null,
  photoURL: string | null,
  userName: string | null
) => {
  try {
    const articleRef = doc(db, `articles/${articleId}`);
    console.log('photoURL', photoURL);
    await updateDoc(articleRef, {
      title: articleTitle,
      description: articleDescription,
      coverImage,
      photoURL,
      userName,
    });

    for (const day of days) {
      const dayRef = doc(collection(db, `articles/${articleId}/days`), day.id);
      const places = day.places || [];
      for (const place of places) {
        const placeId = place.id;
        const imageUrl = images[placeId] || null;
        place.description = descriptions[placeId] || place.description || '';
        if (imageUrl) {
          place.photos = [imageUrl];
        }
      }
      await setDoc(dayRef, {
        ...day,
        places,
      });
    }

    console.log('Article and places saved successfully!');
  } catch (error) {
    console.error('Error saving article and places:', error);
    throw new Error('Failed to save article and places');
  }
};

export const fetchUserAllArticles = async () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userId = user.uid;
          const tripRef = collection(db, 'articles');
          const q = query(tripRef, where('uid', '==', userId));
          const querySnapshot = await getDocs(q);
          const userArticles = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            const createdAtTimestamp = data.createdAt;
            const formattedCreatedAt = createdAtTimestamp
              ? new Date(createdAtTimestamp.seconds * 1000).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : null;
            return {
              id: doc.id,
              ...data,
              createdAt: formattedCreatedAt,
            };
          });

          resolve(userArticles);
        } catch (error) {
          console.error('Error fetching user Articles:', error);
          reject([]);
        }
      } else {
        console.log('No user is logged in');
        resolve([]);
      }
    });
  });
};

export const fetchAllPublishedArticles = async (): Promise<Article[]> => {
  const q = query(collection(db, 'articles'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    console.log('data', data);
    return {
      id: doc.id,
      title: data.title || '',
      description: data.description || '',
      createdAt: data.createdAt || { seconds: 0, nanoseconds: 0 },
      coverImage: data.coverImage || '',
      photoURL: data.photoURL,
      userName: data.userName,
    };
  });
};
