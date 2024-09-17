'use client';

import { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { auth, onAuthStateChanged } from '../../lib/firebaseConfig';
import LoginModal from '../LoginModal';

const Header = () => {
  const [isLoginModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  console.log('user', user);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
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

  return (
    <Container>
      {user ? (
        <>
          <Button onClick={handleLogout}>Logout</Button>
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
    </Container>
  );
};

export default Header;

const Container = styled.div`
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: end;
  padding: 5px 50px;
  align-items: center;
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
