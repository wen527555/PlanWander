import { create } from 'zustand';

interface Place {
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

const usePlaceStore = create<PlaceStore>((set) => ({
  selectedPlace: null,
  placeDetail: null,
  setSelectedPlace: (place) => set({ selectedPlace: place }),
  setPlaceDetail: (placeDetail) => set({ placeDetail }),
}));

export default usePlaceStore;
