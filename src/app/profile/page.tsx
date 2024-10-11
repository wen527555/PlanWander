'use client';

import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { auth } from '../../lib/firebaseConfig';
import ArticlesContainer from './Articles';
import Sidebar from './Sidebar';
import TripsContainer from './Trips';

const ProfilePage = () => {
  const [currentTab, setCurrentTab] = useState<'trips' | 'articles'>('trips');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Container>
      <Sidebar setCurrentTab={setCurrentTab} />
      <MainContent>{currentTab === 'trips' ? <TripsContainer /> : <ArticlesContainer />}</MainContent>
    </Container>
  );
};

export default ProfilePage;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 54px);
  margin-top: 60px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 45px 0px;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
