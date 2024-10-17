'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import styled from 'styled-components';

import ArticlesContainer from './Articles';
import TripsContainer from './Trips';

const Sidebar = dynamic(() => import('./Sidebar'), { ssr: false });

const ProfilePage = () => {
  const [currentTab, setCurrentTab] = useState<'trips' | 'articles'>('trips');

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
  padding: 35px 0px;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
