'use client';

import styled from 'styled-components';

import Sidebar from './components/Sidebar';

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const tabs = [
    { name: 'Trips', path: '/profile/trips' },
    { name: 'Articles', path: '/profile/articles' },
  ];

  return (
    <Container>
      <Sidebar tabs={tabs} />
      <MainContent>{children}</MainContent>
    </Container>
  );
};

export default ProfileLayout;

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
