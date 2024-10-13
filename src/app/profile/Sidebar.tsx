'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { IoEarthOutline } from 'react-icons/io5';
import { PiArticleNyTimes } from 'react-icons/pi';
import { TbLogout2 } from 'react-icons/tb';
import styled from 'styled-components';

import { updateUserProfile, uploadProfileImage } from '@/lib/firebaseApi';
import useAlert from '@/lib/hooks/useAlertMessage';
import { useUserStore } from '@/lib/store';
import { auth } from '../../lib/firebaseConfig';

interface SidebarProps {
  setCurrentTab: (tab: 'trips' | 'articles') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setCurrentTab }) => {
  const { userData, setUserData } = useUserStore();
  const [activeTab, setActiveTab] = useState<'trips' | 'articles' | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { addAlert, AlertMessage } = useAlert();
  const allowImgFormats = ['image/jpeg', 'image/png', 'image/jpg'];
  const maxImgSize = 5 * 1024 * 1024;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUserData(null);
      router.push('/');
    } catch (error) {
      console.error('Error during logout: ', error);
    }
  };

  const handleProfileImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!userData) {
        addAlert('No user data available. Please log in.');
        return;
      }

      if (!allowImgFormats.includes(file.type)) {
        addAlert('Invalid file format. Please upload a JPEG or PNG image.');
        return;
      }

      if (file.size > maxImgSize) {
        addAlert('Image size exceeds 5MB. Please upload a smaller image.');
        return;
      }
      const localImageUrl = URL.createObjectURL(file);
      setIsUploading(true);
      setUserData({ ...userData, photoURL: localImageUrl });
      try {
        const uploadImageUrl = await uploadProfileImage(userData.uid, file);
        await updateUserProfile(userData.uid, null, uploadImageUrl);
        addAlert('Profile image uploaded successfully!');
      } catch {
        addAlert('Failed to upload image. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleNameUpdate = async () => {
    if (!userData) {
      addAlert('No user data available. Please log in.');
      return;
    }

    try {
      await updateUserProfile(userData.uid, userData.userName, null);
      setIsEditingName(false);
      addAlert('Username updated successfully!');
    } catch (error) {
      console.error('error', error);
      addAlert('Failed to update username. Please try again.');
    }
  };

  const handleTabClick = (tab: 'trips' | 'articles') => {
    setActiveTab(tab);
    setCurrentTab(tab);

    const newSearchParams = new URLSearchParams(searchParams?.toString());
    newSearchParams.set('tab', tab);
    router.push(`/profile?${newSearchParams.toString()}`);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userData) {
      setUserData({ ...userData, userName: e.target.value });
    }
  };

  useEffect(() => {
    let isMounted = true;
    const tabParam = searchParams.get('tab');
    if (isMounted) {
      if (tabParam === 'articles') {
        setActiveTab('articles');
        setCurrentTab('articles');
      } else {
        setActiveTab('trips');
        setCurrentTab('trips');
      }
      return () => {
        isMounted = false;
      };
    }
  }, [searchParams, setCurrentTab]);

  return (
    <>
      <AlertMessage />
      <Container>
        <ImgWrapper>
          {userData?.photoURL ? <ProfileImg src={userData?.photoURL} /> : <NoProfileImg />}
          <EditButton onClick={() => fileInputRef.current?.click()}>
            <EditIcon />
          </EditButton>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleProfileImageChange}
          />
          {isUploading && <p>Uploading...</p>}
        </ImgWrapper>
        {isEditingName ? (
          <NameInput
            type="text"
            value={userData?.userName || ''}
            onChange={handleNameChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleNameUpdate();
              }
            }}
          />
        ) : (
          <UserName onClick={() => setIsEditingName(true)}>{userData?.userName || 'No name set'}</UserName>
        )}
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
    </>
  );
};

export default Sidebar;

const NameInput = styled.input`
  margin-top: 10px;
  font-size: 16px;
  font-weight: 600;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ddd;
  outline: none;
  &:hover {
    border-color: #94c3d2;
  }
`;

const EditButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(33, 37, 41, 0.502);
  border: none;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  /* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); */

  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;

  &:hover {
    background-color: #1b1b1b;
  }
`;

const EditIcon = styled(FaPencilAlt)`
  color: #ffff;
  font-size: 16px;
`;

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

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
  }
`;

const ImgWrapper = styled.div`
  box-shadow: 0 2px 3px #00000017;
  border: 4px solid #ffffff;
  background: #ecf6f9;
  border-radius: 50%;
  margin-top: 40px;
  width: 96px;
  height: 96px;
  position: relative;
  @media (max-width: 768px) {
    margin-top: 5px;
  }
`;

const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const NoProfileImg = styled.div`
  width: 100%;
  height: 100%;
  background-color: #edebeb;
  border-radius: 50%;
`;

const UserName = styled.h1`
  margin-top: 25px;
  font-weight: 700;
  font-size: 20px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    text-decoration-color: gray;
  }
`;

const InfoSection = styled.div`
  padding: 20px;

  @media (max-width: 768px) {
    margin-top: 5px;
    display: flex;
    text-align: center;
  }
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

  @media (max-width: 768px) {
    margin: 0;
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
  margin-left: 20px;
  font-weight: 700;
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
