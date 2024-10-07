'use client';

import { FormEvent, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import styled from 'styled-components';

import { saveUserData } from '@/lib/firebaseApi';
import useAlert from '@/lib/hooks/useAlertMessage';
import {
  auth,
  createUserWithEmailAndPassword,
  provider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from '../../lib/firebaseConfig';

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
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userInfo = {
        uid: user.uid,
        displayName: user.displayName ?? '',
        email: user.email || '',
        photoURL: user.photoURL ?? '',
      };
      await saveUserData(userInfo);
      onLoginSuccess();
      onClose();
    } catch (error) {
      addAlert('Error Login. Please try again');
      console.error('Error during Google sign in', error);
    }
  };
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addAlert('Please enter email and password.');
      return;
    }
    if (isLogIn) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        onLoginSuccess();
        onClose();
      } catch (error) {
        addAlert('Error Login. Please try again');
        console.error('Error during login', error);
      }
    } else {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userInfo = {
          uid: user.uid,
          displayName: user.displayName ?? '',
          email: user.email || '',
          photoURL: user.photoURL ?? '',
        };
        await saveUserData(userInfo);
        addAlert('Sign up successful! Please login');
        setIsLogIn(true);
        setEmail('');
        setPassword('');
      } catch (error) {
        addAlert('Error sign up. Please try again');
        console.error('Error during login', error);
      }
    }
  };

  return (
    <Overlay>
      <Content>
        <CloseBtnWrapper onClick={onClose}>
          <CloseBtn />
        </CloseBtnWrapper>
        <Container>
          <Title>{isLogIn ? 'Login to PlanWander' : 'Sign up to PlanWander'}</Title>
          {isLogIn ? (
            <>
              <GoogleButton onClick={handleGoogleLogin}>Log in With Google</GoogleButton>
              <form onSubmit={handleFormSubmit}>
                <Divider>
                  <span>or</span>
                </Divider>
                <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input
                  type="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <LoginButton type="submit">Log in</LoginButton>
              </form>
            </>
          ) : (
            <>
              <GoogleButton onClick={handleGoogleLogin}>Sign up With Google</GoogleButton>
              <form onSubmit={handleFormSubmit}>
                <Divider>
                  <span>or</span>
                </Divider>
                <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <LoginButton type="submit">Sign up</LoginButton>
              </form>
            </>
          )}
          <ToggleLink onClick={handleToggleForm}>
            {isLogIn ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
          </ToggleLink>
        </Container>
      </Content>
      <AlertMessage />
    </Overlay>
  );
};

export default LoginModal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const Content = styled.div`
  background-color: white;
  padding: 10px;
  border-radius: 25px;
  width: 450px;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.2);
  height: 450px;
`;

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  margin: 20px 30px;
  padding: 20px 20px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 25px;
`;

const Input = styled.input`
  margin: 10px 0px;
  padding: 5px 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  &:hover {
    border-color: #94c3d2;
  }
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
    background: #f3f4f5;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  border-radius: 25px;
  padding: 10px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  background-color: #78b7cc;
  font-size: 14px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  border: none;
  &:hover {
    background-color: #e0e7ea;
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

  &:hover {
    color: #a7d6e6;
  }
`;
