'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { IoEarthOutline } from 'react-icons/io5';
import { PiArticleNyTimes } from 'react-icons/pi';
import { TbLogout2 } from 'react-icons/tb';
import styled from 'styled-components';

import { useUserStore } from '@/lib/store';
import defaultProfileImg from '@/public/earth-profile.png';
import { auth } from '../../lib/firebaseConfig';

const Sidebar = ({ setCurrentTab }) => {
  const { userData, setUserData } = useUserStore();
  const [activeTab, setActiveTab] = useState<'trips' | 'articles' | null>(null);
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUserData(null);
      router.push('/');
    } catch (error) {
      console.error('Error during logout: ', error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentTab(tab);
  };

  return (
    <Container>
      <ImgWrapper>
        <ProfileImg src={userData?.photoURL || defaultProfileImg.src} />
      </ImgWrapper>
      {userData?.userName && <UserName>{userData?.userName}</UserName>}
      <InfoSection>
        <InfoItem onClick={() => handleTabClick('trips')} isActive={activeTab === 'trips'}>
          <TripsIcon />
          <InfoText>Trips</InfoText>
        </InfoItem>
        <InfoItem onClick={() => handleTabClick('articles')} isActive={activeTab === 'articles'}>
          <ArticlesIcon />
          <InfoText>Articles</InfoText>
        </InfoItem>
      </InfoSection>
      <LogoutWrapper>
        <LogoutIcon />
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </LogoutWrapper>
    </Container>
  );
};

export default Sidebar;

const Container = styled.div`
  width: 250px;
  background-color: #f9fcfd;
  border-right: 1px solid #dde9ed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  height: calc(100vh - 54px);
`;

const ImgWrapper = styled.div`
  box-shadow: 0 2px 3px #00000017;
  border: 4px solid #ffffff;
  background: #ecf6f9;
  border-radius: 50%;
  margin-top: 40px;
  width: 96px;
  height: 96px;
`;

const ProfileImg = styled.img`
  border-radius: 50%;
  width: 100%;
  height: 100%;
  /* border: 2px solid #a19a9a; */
  object-fit: cover;
`;

const UserName = styled.h1`
  margin-top: 25px;
  font-weight: 700;
  font-size: 20px;
`;

const InfoSection = styled.div`
  padding: 20px;
`;

const InfoItem = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ isActive }) => (isActive ? '#ecf6f9' : '#f9fcfd')};
  padding: 10px 20px;
  border-radius: 15px;
  margin: 30px 0px;
  width: 180px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ecf6f9;
  }
`;

const TripsIcon = styled(IoEarthOutline)`
  font-size: 14px;
  color: #0f3e4a;
`;

const ArticlesIcon = styled(PiArticleNyTimes)`
  font-size: 14px;
  color: #0f3e4a;
`;

const InfoText = styled.span`
  font-size: 16px;
  color: #333;
  flex-grow: 1;
  margin-left: 10px;
`;

const LogoutWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: auto;
  margin-bottom: 15px;
`;

const LogoutButton = styled.button`
  width: 80px;
  font-weight: 700;
  font-size: 16px;
  padding: 5px 10px;
  cursor: pointer;
  color: #0f3e4a;
  background-color: #f9fcfd;
  border: none;
`;

const LogoutIcon = styled(TbLogout2)`
  font-size: 14px;
  color: #0f3e4a;
`;
