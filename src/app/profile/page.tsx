'use client';

import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { auth } from '../../lib/firebaseConfig';
import AddTripModal from './AddTripModal';

const ProfilePage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <>
      <Container>
        <Sidebar></Sidebar>
        <MainContent>
          <Button onClick={handleAddClick}>Add</Button>
        </MainContent>
      </Container>
      {isModalOpen && <AddTripModal onClose={handleModalClose}></AddTripModal>}
    </>
  );
};

export default ProfilePage;

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #f1f1f1;
`;

const MainContent = styled.div`
  flex: 1;

  padding: 20px;
`;

const Button = styled.button`
  width: 50px;
  height: 30px;
  font-weight: 700;
  transition: all 0.2s ease-in-out;
  font-size: 20px;
  border-radius: 8px;
  border: none;
  background-color: white;
  cursor: pointer;
  &hover {
    background-color: #dde9ed;
  }
`;
