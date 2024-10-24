'use client';

import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react';
import styled from 'styled-components';

import LoadingAnimation from '@/components/Loading';
import LoginModal from '@/components/LoginModal';
import TripModal from '@/components/TripModal';
import { createNewTrip } from '@/services/firebaseApi';
import { useModalStore, useUserStore } from '@/stores/store';

interface SelectedOption {
  value: string;
  label: string;
}

const ClientActions = () => {
  const router = useRouter();
  const { isModalOpen, openModal, closeModal, modalType } = useModalStore();
  const { userData } = useUserStore();
  const [isPending, startTransition] = useTransition();
  const handleToProfile = () => {
    router.push('/profile/trips');
  };

  const handleStartPlanning = () => {
    if (userData) {
      openModal('trip');
    } else {
      openModal('login');
    }
  };

  const handleCreateTrip = async (
    tripTitle: string,
    startDate: Date,
    endDate: Date,
    selectedCountries: SelectedOption[]
  ) => {
    const tripId = await createNewTrip(tripTitle, startDate, endDate, selectedCountries);
    startTransition(() => {
      router.push(`/trip/${tripId}`);
    });
  };

  return (
    <>
      {isPending && <LoadingAnimation />}
      <StartButton onClick={handleStartPlanning}>Start planning</StartButton>
      {isModalOpen && modalType === 'login' && <LoginModal onClose={closeModal} onLoginSuccess={handleToProfile} />}
      {isModalOpen && modalType === 'trip' && (
        <TripModal onClose={closeModal} isEditing={false} onSubmit={handleCreateTrip} />
      )}
    </>
  );
};

export default ClientActions;

const StartButton = styled.button`
  padding: 15px 20px;
  background-color: #78b7cc;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background-color: white;
    color: #78b7cc;
    border: 2px solid #78b7cc;
  }
`;
