'use client';

import { useState } from 'react';
import styled from 'styled-components';

import { saveUserData } from '../../lib/firebaseApi';
import {
  auth,
  createUserWithEmailAndPassword,
  provider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from '../../lib/firebaseConfig';
import useAuthStore from '../../lib/store';

const LoginForm = ({ onLoginSuccess }) => {
  const [isLogIn, setIsLogIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setUser = useAuthStore((state) => state.setUser);
  const handleToggleForm = () => {
    setEmail('');
    setPassword('');
    setIsLogIn((prev) => !prev);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await saveUserData(user);
      useAuthStore.getState().setUser(user);
      onLoginSuccess();
    } catch (error) {
      alert('Login failed: ' + error.message);
      console.error('Error during Google sign in', error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('請填寫email和密碼');
      return;
    }
    if (isLogIn) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        setUser(user);
        onLoginSuccess();
      } catch (error) {
        console.error(error);
        alert('出現錯誤：' + error.message);
      }
    } else {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await saveUserData(user);
      } catch (error) {
        alert('Signup failed: ' + error.message);
        console.error('Error during sign up', error);
      }
    }
  };

  return (
    <Container>
      <Title>{isLogIn ? 'Login to PlanWander' : 'Sign up to PlanWander'}</Title>
      {isLogIn ? (
        <>
          <GoogleButton onClick={handleGoogleLogin}>Log in With Google</GoogleButton>
          <form onSubmit={handleFormSubmit}>
            <Divider>
              <span>or</span>
            </Divider>
            <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <LoginButton type="submit">Log in</LoginButton>
          </form>
        </>
      ) : (
        <>
          <GoogleButton>Sign up With Google</GoogleButton>
          <form onSubmit={handleFormSubmit}>
            <Divider>
              <span>or</span>
            </Divider>
            <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <LoginButton type="submit">Sign up</LoginButton>
          </form>
        </>
      )}
      <ToggleLink onClick={handleToggleForm}>
        {isLogIn ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
      </ToggleLink>
    </Container>
  );
};
export default LoginForm;

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
  border: 1px solid #ccc;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
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
    color: #0056b3;
  }
`;
