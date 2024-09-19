import { create } from 'zustand';

interface PlaceStore {
  selectedPlace: { lat: number; lng: number } | null;
  placeDetail: any[] | null;
  setSelectedPlace: (place: { lat: number; lng: number }) => void;
  setPlaceDetail: (places: any[]) => void;
}

const usePlaceStore = create<PlaceStore>((set) => ({
  selectedPlace: null,
  placeDetail: null,
  setSelectedPlace: (place) => set({ selectedPlace: place }),
  setPlaceDetail: (placeDetail) => set({ placeDetail }),
}));

export default usePlaceStore;
