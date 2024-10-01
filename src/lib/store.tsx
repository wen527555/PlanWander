import { create } from 'zustand';

type UserState = {
  photoURL: string;
  userName: string;
  setUserData: (data: { photoURL: string; userName: string }) => void;
};

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

export const useUserStore = create<UserState>((set) => ({
  photoURL: '',
  userName: '',
  setUserData: (userData) => set(userData),
}));
