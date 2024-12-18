'use client';

import { FormEvent, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import styled from 'styled-components';

import Overlay from '@/components/Overlay';
import useAlert from '@/hooks/useAlertMessage';
import { fetchGeneralLogin, fetchGoogleLogin, fetchSignUp } from '@/services/api';
import { useUserStore } from '@/stores/store';
import {
  auth,
  createUserWithEmailAndPassword,
  provider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from '../../config/firebaseConfig';
import AuthForm from './AuthForm';

interface LoginModalProps {
  onLoginSuccess: () => void;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess, onClose }) => {
  const [isLogIn, setIsLogIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { addAlert, AlertMessage } = useAlert();
  const handleToggleForm = () => {
    setEmail('');
    setPassword('');
    setIsLogIn((prev) => !prev);
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();
      const data = await fetchGoogleLogin(idToken);
      useUserStore.getState().setUserData(data.userData);
      onLoginSuccess();
      onClose();
    } catch (error) {
      addAlert('Error Login. Please try again');
      console.error('Error during Google sign in', error);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      const data = await fetchGeneralLogin(idToken);
      useUserStore.getState().setUserData(data.userData);
      onLoginSuccess();
      onClose();
    } catch (error) {
      handleAuthError(error, 'login');
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      const data = await fetchSignUp(idToken);
      useUserStore.getState().setUserData(data.userData);
      onLoginSuccess();
      onClose();
      addAlert('Sign up successfully.');
    } catch (error) {
      handleAuthError(error, 'signUp');
    }
  };

  const handleAuthError = (error: any, action: 'login' | 'signUp') => {
    if (error.code === 'auth/invalid-email') {
      addAlert('Please enter a valid email address.');
    } else if (error.code === 'auth/weak-password') {
      addAlert('Password should be at least 6 characters.');
    } else if (error.code === 'auth/email-already-in-use') {
      addAlert('This email is already registered. Please log in.');
    } else if (error.message === 'User not found') {
      addAlert('User not found. Please register.');
    } else {
      addAlert(`Error during ${action}. Please try again.`);
    }
  };
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addAlert('Please enter email and password.');
      return;
    }
    if (isLogIn) {
      await handleLogin(email, password);
    } else {
      await handleSignUp(email, password);
    }
  };

  return (
    <Overlay>
      <AlertMessage />
      <ModalContainer>
        <CloseBtnWrapper onClick={onClose}>
          <CloseBtn />
        </CloseBtnWrapper>
        <Container>
          <Title>{isLogIn ? 'Login to PlanWander' : 'Sign up to PlanWander'}</Title>
          {isLogIn && (
            <>
              <GoogleButton onClick={handleGoogleLogin}>LogIn With Google</GoogleButton>
              <Divider>
                <span>or</span>
              </Divider>
            </>
          )}
          <AuthForm
            isLogIn={isLogIn}
            email={email}
            password={password}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onSubmit={handleFormSubmit}
            setEmail={setEmail}
            setPassword={setPassword}
          />
          <ToggleLink onClick={handleToggleForm}>
            {isLogIn ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
          </ToggleLink>
        </Container>
        <AlertMessage />
      </ModalContainer>
    </Overlay>
  );
};

export default LoginModal;

const CloseBtnWrapper = styled.button`
  cursor: pointer;
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
`;

const CloseBtn = styled(IoMdClose)`
  font-size: 24px;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 10px;
  border-radius: 25px;
  width: 450px;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.2);
  height: 450px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px 20px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 25px;
`;

const GoogleButton = styled.button`
  margin-top: 10px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 25px;
  cursor: pointer;
  background: #ffff;
  height: 50px;
  width: 100%;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    background-color: white;
    color: #78b7cc;
    border: 2px solid #78b7cc;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 8px 0;
  width: 100%;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ccc;
  }

  &::before {
    margin-right: 1rem;
  }

  &::after {
    margin-left: 1rem;
  }
`;

const ToggleLink = styled.span`
  cursor: pointer;
  text-decoration: none;
  margin-top: 1rem;
  font-size: 16px;
  font-weight: 500;
  &:hover {
    color: #78b7cc;
  }
`;
