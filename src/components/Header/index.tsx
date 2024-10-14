'use client';

import Image from 'next/image';
// import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { RiCompassDiscoverLine } from 'react-icons/ri';
import styled from 'styled-components';

import LoadingAnimation from '@/components/Loading';
// import Loading from '@/app/loading';
import TripModal from '@/components/TripModal';
import { createNewTrip, fetchUserData } from '@/lib/firebaseApi';
import { useModalStore, useUserStore } from '@/lib/store';
// import { BsPersonCircle } from 'react-icons/bs';
import Logo from '@/public/PlanwanderLogo.png';
import { auth, onAuthStateChanged } from '../../lib/firebaseConfig';
import LoginModal from '../LoginModal';

interface SelectedOption {
  value: string;
  label: string;
}

const Header = () => {
  const { isModalOpen, openModal, closeModal, modalType } = useModalStore();
  const { userData } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  const isProfileActive = pathname === '/profile';
  const isDiscoverActive = pathname === '/discover';
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
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

  const handleToProfile = () => {
    startTransition(() => {
      router.push('/profile');
    });
  };

  const handleToDiscover = () => {
    startTransition(() => {
      router.push('/discover');
    });
  };

  const handleLogoClick = (e: any) => {
    e.preventDefault();
    startTransition(() => {
      router.push('/');
    });
  };

  const handleCreateTrip = async (
    tripTitle: string,
    startDate: Date,
    endDate: Date,
    selectedCountries: SelectedOption[]
  ) => {
    setLoading(true);
    try {
      const tripId = await createNewTrip(tripTitle, startDate, endDate, selectedCountries);
      router.push(`/trips/${tripId}`);
    } catch (error) {
      console.error('Error creating trip:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isPending && <LoadingAnimation />}
      {loading && <LoadingAnimation />}
      <Container>
        <LogoLink href="/" onClick={handleLogoClick}>
          <Image src={Logo} alt="Logo" width={180} height={22} style={{ cursor: 'pointer' }} />
        </LogoLink>
        {userData ? (
          <>
            <IconWrapper>
              <DiscoverWrapper isActive={isDiscoverActive} onClick={handleToDiscover}>
                <DiscoverIcon />
                <IconText>Discover</IconText>
              </DiscoverWrapper>
              <ProfileWrapper isActive={isProfileActive} onClick={handleToProfile}>
                {userData?.photoURL ? <ProfileIcon src={userData?.photoURL} /> : <NoProfileImg />}
                <IconText>{userData?.userName || 'You'}</IconText>
              </ProfileWrapper>
            </IconWrapper>
            <ButtonWrapper>
              <Button onClick={() => openModal('trip')}>+ Plan</Button>
            </ButtonWrapper>
          </>
        ) : (
          <ButtonWrapper>
            <LoginButton onClick={() => openModal('login')}>LogIn</LoginButton>
          </ButtonWrapper>
        )}
        {isModalOpen && modalType === 'trip' && (
          <TripModal onClose={closeModal} isEditing={false} onSubmit={handleCreateTrip} />
        )}
        {isModalOpen && modalType === 'login' && <LoginModal onClose={closeModal} onLoginSuccess={handleToProfile} />}
      </Container>
    </>
  );
};

export default Header;

const LogoLink = styled.a`
  cursor: pointer;
  display: inline-block;
`;

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

const ProfileIcon = styled.img`
  cursor: pointer;
  border-radius: 50%;
  width: 30px;
  height: 30px;

  &:hover {
    color: #d9d9d9;
  }
`;

const NoProfileImg = styled.div`
  width: 30px;
  height: 30px;
  background-color: #dcdada;
  border-radius: 50%;
`;

const IconWrapper = styled.div`
  width: auto;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: 43%;
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

const Button = styled.button`
  background-color: #78b7cc;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 700;
  &:hover {
    background-color: white;
    color: #78b7cc;
    border: 2px solid #78b7cc;
  }
`;

const LoginButton = styled.button`
  border-radius: 20px;
  padding: 8px 16px;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  font-weight: 700;
  background-color: white;
  border: none;
  &:hover {
    background-color: #78b7cc;
    color: white;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;
