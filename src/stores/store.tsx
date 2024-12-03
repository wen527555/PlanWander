import { create } from 'zustand';

interface UserData {
  photoURL: string;
  userName: string;
}

interface UserStore {
  userData: UserData | null;
  userLoading: boolean;
  setUserData: (userData: UserData | null) => void;
  setUserLoading: (loading: boolean) => void;
}

interface Place {
  website?: string;
  phone?: string;
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

interface ModalStore {
  isModalOpen: boolean;
  modalType: 'login' | 'trip' | null;
  openModal: (type: 'login' | 'trip') => void;
  closeModal: () => void;
}

interface ModalConfirmStore {
  isModalOpen: boolean;
  message: string;
  onConfirm: () => void;
  openModal: (message: string, onConfirm: () => void) => void;
  closeModal: () => void;
}

interface GoogleApiStore {
  isGoogleApiLoaded: boolean;
  setGoogleApiLoaded: (loaded: boolean) => void;
}

export const usePlaceStore = create<PlaceStore>((set) => ({
  selectedPlace: null,
  placeDetail: null,
  setSelectedPlace: (place) => set({ selectedPlace: place }),
  setPlaceDetail: (placeDetail) => set({ placeDetail }),
}));

export const useUserStore = create<UserStore>((set) => ({
  userData: null,
  userLoading: true,
  setUserData: (userData: UserData | null) => set({ userData, userLoading: false }),
  setUserLoading: (userLoading) => set({ userLoading }),
}));

export const useModalStore = create<ModalStore>((set) => ({
  isModalOpen: false,
  modalType: null,
  openModal: (type) => set({ isModalOpen: true, modalType: type }),
  closeModal: () => set({ isModalOpen: false }),
}));

export const useConfirmModalStore = create<ModalConfirmStore>((set) => ({
  isModalOpen: false,
  message: '',
  onConfirm: () => {},

  openModal: (message: string, onConfirm: () => void) => set({ isModalOpen: true, message, onConfirm }),
  closeModal: () => set({ isModalOpen: false, message: '', onConfirm: () => {} }),
}));

export const useGoogleApiStore = create<GoogleApiStore>((set) => ({
  isGoogleApiLoaded: false,
  setGoogleApiLoaded: (loaded) => set({ isGoogleApiLoaded: loaded }),
}));
