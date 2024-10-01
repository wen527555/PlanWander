import { create } from 'zustand';

interface UserData {
  photoURL: string;
  userName: string;
  [key: string]: any;
}

interface UserStore {
  userData: UserData | null;
  setUserData: (userData: UserData | null) => void;
}

interface Place {
  website?: any;
  phone?: any;
  openTime?: string[];
  id: string;
  name: string;
  lat: number;
  lng: number;
  rating?: number;
  address?: string;
}

interface PlaceStore {
  selectedPlace: Place | null;
  placeDetail: Place[] | null;
  setSelectedPlace: (place: Place | null) => void;
  setPlaceDetail: (places: Place[]) => void;
}

export const usePlaceStore = create<PlaceStore>((set) => ({
  selectedPlace: null,
  placeDetail: null,
  setSelectedPlace: (place) => set({ selectedPlace: place }),
  setPlaceDetail: (placeDetail) => set({ placeDetail }),
}));

export const useUserStore = create<UserStore>((set) => ({
  userData: null,
  setUserData: (userData: UserData | null) => set({ userData }),
}));
