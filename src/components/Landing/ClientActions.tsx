'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import styled from 'styled-components';

import LoginModal from '@/components/LoginModal';
import { useModalStore } from '@/lib/store';

const ClientActions = () => {
  const router = useRouter();
  const { isModalOpen, openModal, closeModal, modalType } = useModalStore();
  const handleToProfile = () => {
    router.push('/profile/trips');
  };

  return (
    <>
      <StartButton onClick={() => openModal('login')}>Start planning</StartButton>
      {isModalOpen && modalType === 'login' && <LoginModal onClose={closeModal} onLoginSuccess={handleToProfile} />}
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
