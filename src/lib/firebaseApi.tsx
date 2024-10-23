import dayjs from 'dayjs';
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { auth } from '@/lib/firebaseConfig';
import { fetchCountryImage } from '@/lib/mapApi';
import { db, storage } from '../lib/firebaseConfig';

interface Day {
  date: string;
}

interface Article {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  coverImage?: string;
  photoURL?: string;
  userName?: string;
  imageUrl: string;
  countries?: { name: string; code: string }[];
}

interface SelectedOption {
  value: string;
  label: string;
}

interface TripData {
  tripTitle: string;
  startDate: string;
  endDate: string;
  countries: SelectedOption[];
  imageUrl: string;
  days: Day[];
}

interface UpdateTripParams {
  tripId: string;
  tripTitle: string;
  startDate: Date;
  endDate: Date;
  selectedCountries: SelectedOption[];
  originalTripData?: TripData;
}

interface UserData {
  uid: string;
  email: string;
  photoURL: string;
  userName: string;
}

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

    const tripData = {
      tripTitle,
      startDate: dayjs(startDate).format('YYYY-MM-DD'),
      endDate: dayjs(endDate).format('YYYY-MM-DD'),
      countries: countries,
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
    const daysCollection = collection(db, `trips/${tripId}/days`);
    const daysSnapshot = await getDocs(daysCollection);
    const daysData = daysSnapshot.docs.map((doc) => doc.data() as Day);
    return {
      tripTitle: tripData?.tripTitle,
      startDate: tripData?.startDate,
      countries: tripData?.countries,
      endDate: tripData?.endDate,
      imageUrl: tripData?.imageUrl,
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
      }
      return place;
    });

    await updateDoc(dayDocRef, {
      places: updatedPlaces,
    });
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
  } catch (error) {
    console.error('Error removing place:', error);
  }
};

export const updatePlaceStayTime = async (tripId: string, dayId: string, placeId: any, stayDuration: number) => {
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
        stayDuration: stayDuration,
      };
    }
    return place;
  });
  try {
    await updateDoc(dayDocRef, {
      places: updatedPlaces,
    });
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

export const createArticleFromTrip = async (tripId: string) => {
  try {
    const user = auth.currentUser;
    const userId = user?.uid;
    if (!userId) {
      throw new Error('No authenticated user found');
    }

    const tripRef = doc(db, `trips/${tripId}`);
    const tripSnapshot = await getDoc(tripRef);
    const tripData = tripSnapshot.data();
    const imageUrl = tripData?.imageUrl;
    const countries = tripData?.countries || '';
    const articleRef = doc(db, `articles/${tripId}`);
    const articleSnapshot = await getDoc(articleRef);
    const tripDaysCollectionRef = collection(db, `trips/${tripId}/days`);
    const daysSnapshot = await getDocs(tripDaysCollectionRef);

    if (articleSnapshot.exists()) {
      daysSnapshot.forEach(async (dayDoc) => {
        const dayData = dayDoc.data();
        const articleDayRef = doc(collection(db, `articles/${tripId}/days`), dayDoc.id);
        await setDoc(articleDayRef, dayData, { merge: true });
      });
    } else {
      await setDoc(articleRef, {
        tripId,
        createdAt: new Date(),
        title: '',
        description: '',
        uid: userId,
        imageUrl,
        countries,
      });

      daysSnapshot.forEach(async (dayDoc) => {
        const dayData = dayDoc.data();
        const articleDayRef = doc(collection(db, `articles/${tripId}/days`), dayDoc.id);
        await setDoc(articleDayRef, dayData);
      });
    }
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
    const imageUrl = articleData?.imageUrl || '';
    const countries = articleData?.countries || '';
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
      imageUrl,
      countries,
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
  } catch (error) {
    console.error('Error saving article and places:', error);
    throw new Error('Failed to save article and places');
  }
};

export const fetchAllPublishedArticles = async (): Promise<Article[]> => {
  const q = query(collection(db, 'articles'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    const createdAt = data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000) : new Date();
    return {
      id: doc.id,
      title: data.title || '',
      description: data.description || '',
      createdAt,
      coverImage: data.coverImage || '',
      photoURL: data.photoURL,
      userName: data.userName,
      imageUrl: data.imageUrl || '',
      countries: data.countries || '',
    };
  });
};

export const fetchDeleteTrip = async (tripId: string) => {
  try {
    const tripRef = doc(db, 'trips', tripId);
    await deleteDoc(tripRef);
  } catch (error) {
    console.error('Error delete trips:', error);
  }
};

export const fetchDeleteArticle = async (articleId: string) => {
  try {
    const articleRef = doc(db, 'articles', articleId);
    await deleteDoc(articleRef);
  } catch (error) {
    console.error('Error delete articles:', error);
  }
};

export const fetchUpdateTrip = async (updateData: UpdateTripParams): Promise<void> => {
  const { tripId, tripTitle, startDate, endDate, selectedCountries, originalTripData } = updateData;

  const updatedTripData: {
    tripTitle: string;
    startDate: string;
    endDate: string;
    countries: { code: string; name: string }[];
    updatedAt: Date;
    imageUrl?: string;
  } = {
    tripTitle,
    startDate: dayjs(startDate).format('YYYY-MM-DD'),
    endDate: dayjs(endDate).format('YYYY-MM-DD'),
    countries: selectedCountries.map((country) => ({
      code: country.value,
      name: country.label,
    })),
    updatedAt: new Date(),
  };

  if (selectedCountries[0]?.label !== originalTripData?.countries[0]?.label && originalTripData) {
    const firstCountry = selectedCountries[0].label;
    const countryImageUrl = await fetchCountryImage(firstCountry);
    if (countryImageUrl) {
      updatedTripData.imageUrl = countryImageUrl;
    }
  }

  const tripRef = doc(db, 'trips', tripId);
  await updateDoc(tripRef, updatedTripData);
  await handleDateRangeChange(tripRef, startDate, endDate, originalTripData);
};

//改成更好的寫法
const handleDateRangeChange = async (
  tripRef: DocumentReference,
  startDate: Date,
  endDate: Date,
  originalTripData: TripData | undefined
) => {
  if (!originalTripData) {
    console.error('Original trip data is missing');
    return;
  }

  const originalStartDate = dayjs(originalTripData.startDate);
  const originalEndDate = dayjs(originalTripData.endDate);
  const newStartDate = dayjs(startDate);
  const newEndDate = dayjs(endDate);

  let batch = writeBatch(db);
  const daysData = [];

  let originalCurrentDate = originalStartDate;
  while (originalCurrentDate.isBefore(originalEndDate) || originalCurrentDate.isSame(originalEndDate)) {
    const originalFormattedDate = originalCurrentDate.format('YYYY-MM-DD');
    const originalDayRef = doc(collection(tripRef, 'days'), originalFormattedDate);

    const originalDayDoc = await getDoc(originalDayRef);
    if (originalDayDoc.exists()) {
      daysData.push({
        data: originalDayDoc.data(),
        originalFormattedDate,
      });
      batch.delete(originalDayRef);
    }

    originalCurrentDate = originalCurrentDate.add(1, 'day');
  }

  await batch.commit();

  batch = writeBatch(db);

  let currentDate = newStartDate;
  let index = 0;

  while (index < daysData.length && (currentDate.isBefore(newEndDate) || currentDate.isSame(newEndDate))) {
    const formattedDate = currentDate.format('YYYY-MM-DD');
    const newDayRef = doc(collection(tripRef, 'days'), formattedDate);

    const originalData = daysData[index] ? daysData[index].data : {};
    batch.set(newDayRef, {
      ...originalData,
      date: formattedDate,
    });

    currentDate = currentDate.add(1, 'day');
    index++;
  }

  while (currentDate.isBefore(newEndDate) || currentDate.isSame(newEndDate)) {
    const formattedDate = currentDate.format('YYYY-MM-DD');
    const newDayRef = doc(collection(tripRef, 'days'), formattedDate);

    batch.set(newDayRef, {
      date: formattedDate,
    });

    currentDate = currentDate.add(1, 'day');
  }

  await batch.commit();
};

export const updateDepartureTime = async (tripId: string, dayId: string, newTime: string) => {
  const dayDocRef = doc(db, 'trips', tripId, 'days', dayId);
  await updateDoc(dayDocRef, {
    departureTime: newTime,
  });
};

export const uploadProfileImage = async (userId: string, file: File) => {
  try {
    const imageRef = ref(storage, `users/${userId}/${file.name}`);
    const uploadResult = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(uploadResult.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image.');
  }
};

export const updateUserProfile = async (userId: string, userName: string | null, photoURL: string | null) => {
  const updates: Partial<{ userName: string; photoURL: string }> = {};

  if (userName) {
    updates.userName = userName;
  }

  if (photoURL) {
    updates.photoURL = photoURL;
  }

  if (Object.keys(updates).length > 0) {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, updates);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }
};

export const fetchUserData = async (userId: string): Promise<UserData | null> => {
  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);
  // return userDoc.exists() ? userDoc.data() : null;
  if (userDoc.exists()) {
    const data = userDoc.data();
    return {
      uid: data.uid || '',
      email: data.email || '',
      photoURL: data.photoURL || '',
      userName: data.userName || '',
    };
  } else {
    return null;
  }
};
