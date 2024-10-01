'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RiCompassDiscoverLine } from 'react-icons/ri';
import styled from 'styled-components';

import TripModal from '@/components/TripModal';
import { createNewTrip, fetchUserData } from '@/lib/firebaseApi';
import { useUserStore } from '@/lib/store';
// import { BsPersonCircle } from 'react-icons/bs';
import defaultProfileImg from '@/public/earth-profile.png';
import { auth, onAuthStateChanged } from '../../lib/firebaseConfig';
import LoginModal from '../LoginModal';

interface SelectedOption {
  value: string;
  label: string;
}

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [user, setUser] = useState<User | null>(null);
  const { userData } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  const isProfileActive = pathname === '/profile';
  const isDiscoverActive = pathname === '/discover';
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData();
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    router.push('/profile');
  };

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // const handleLogout = async () => {
  //   try {
  //     await auth.signOut();
  //     setUser(null);
  //     router.push('/');
  //   } catch (error) {
  //     console.error('Error during logout: ', error);
  //   }
  // };

  const handleToProfile = () => {
    router.push('/profile');
  };

  const handleToDiscover = () => {
    router.push('/discover');
  };

  const handleCreateTrip = async (
    tripTitle: string,
    startDate: Date,
    endDate: Date,
    selectedCountries: SelectedOption[]
  ) => {
    const tripId = await createNewTrip(tripTitle, startDate, endDate, selectedCountries);
    console.log('Trip created successfully');
    router.push(`/trips/${tripId}`);
  };

  return (
    <Container>
      <Link href="/" passHref>
        <Image src="/PlanWanderLogo.png" alt="Logo" width={180} height={22} style={{ cursor: 'pointer' }} />
      </Link>
      {userData ? (
        <>
          <IconWrapper>
            <ProfileWrapper isActive={isProfileActive} onClick={handleToProfile}>
              <ProfileIcon src={userData?.photoURL || defaultProfileImg.src} />
              <IconText>You</IconText>
            </ProfileWrapper>
            <DiscoverWrapper isActive={isDiscoverActive} onClick={handleToDiscover}>
              <DiscoverIcon />
              <IconText>Discover</IconText>
            </DiscoverWrapper>
          </IconWrapper>
          {/* <Button onClick={handleLogout}>Logout</Button> */}
          <ButtonWrapper>
            <AddButton onClick={handleAddClick}>+ Add</AddButton>
          </ButtonWrapper>
        </>
      ) : (
        <>
          <Button onClick={handleLoginClick}>LogIn</Button>
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          ></LoginModal>
        </>
      )}
      {isModalOpen && <TripModal onClose={handleModalClose} isEditing={false} onSubmit={handleCreateTrip} />}
    </Container>
  );
};

export default Header;

const Container = styled.div`
  width: 100%;
  height: 60px;
  /* border-bottom: 1px solid #e9ecef; */
  border-bottom: 1px solid #dde9ed;
  display: flex;
  justify-content: space-between;
  padding: 5px 50px;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 1000;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
`;

const Button = styled.button`
  width: 50px;
  height: 30px;
  font-weight: 700;
  transition: all 0.2s ease-in-out;
  font-size: 12px;
  border-radius: 8px;
  border: none;
  background-color: white;
  cursor: pointer;
  &hover {
    background-color: #dde9ed;
  }
`;

const ProfileIcon = styled.img`
  cursor: pointer;
  border-radius: 50%;
  width: 30px;
  height: 30px;

  &:hover {
    color: #d9d9d9;
  }
`;

const IconWrapper = styled.div`
  width: auto;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: 50%;
  transform: translate(-100%);
`;

const ProfileWrapper = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
  &:hover {
    color: #d9d9d9;
  }
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: -15px;
    width: 100%;
    height: 4px;
    background-color: ${(props) => (props.isActive ? '#78b7cc' : 'transparent')};
    transition: background-color 0.3s ease;
  }
`;

const IconText = styled.span`
  /* font-size: 16px;
  color: #fdfeff; */
  font-size: 14px;
  font-weight: 600;
  /* color: #0f3e4a; */
  color: #658c96;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    color: #c7c4c4;
  }
`;

const DiscoverIcon = styled(RiCompassDiscoverLine)`
  cursor: pointer;
  margin-right: 5px;
  font-size: 20px;
  color: #658c96;
`;

const DiscoverWrapper = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  color: #6c757d;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: -20px;
    width: 100%;
    height: 4px;
    background-color: ${(props) => (props.isActive ? '#78b7cc' : 'transparent')};
    transition: background-color 0.3s ease;
  }
`;

const AddButton = styled.button`
  background-color: #78b7cc;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 700;
  &:hover {
    background-color: #e0e7ea;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;
