'use client';

import { User } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { fetchUserData } from '@/lib/firebaseApi';
import { useUserStore } from '@/lib/store';
// import { BsPersonCircle } from 'react-icons/bs';
import defaultProfileImg from '@/public/earth-profile.png';
import { auth, onAuthStateChanged } from '../../lib/firebaseConfig';
import LoginModal from '../LoginModal';
import placeWanderLogo from './PlanwanderLogo.png';

const Header = () => {
  const [isLoginModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { photoURL } = useUserStore();
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserData();
      } else {
        setUser(null);
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLoginClick = () => {
    setIsModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsModalOpen(false);
    router.push('/profile');
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error during logout: ', error);
    }
  };

  const handleToProfile = () => {
    router.push('/profile');
  };

  return (
    <Container>
      <Link href="/" passHref>
        <Image src={placeWanderLogo} alt="Logo" width={120} height={20} style={{ cursor: 'pointer' }} />
      </Link>
      {user ? (
        <IconWrapper>
          <ProfileIcon src={photoURL || defaultProfileImg.src} onClick={handleToProfile} />
          <Button onClick={handleLogout}>Logout</Button>
        </IconWrapper>
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
    </Container>
  );
};

export default Header;

const Container = styled.div`
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  padding: 5px 50px;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

// const ProfileIcon = styled(BsPersonCircle)`
//   cursor: pointer;
//   font-size: 30px;
// `;

const ProfileIcon = styled.img`
  cursor: pointer;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  /* border: 2px solid #403d3d; */
  /* background-color: white; */
`;

const IconWrapper = styled.div`
  width: auto;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 10px;
`;
