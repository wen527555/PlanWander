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
