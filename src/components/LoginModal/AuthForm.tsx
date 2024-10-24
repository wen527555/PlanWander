import React from 'react';
import styled from 'styled-components';

interface AuthFormProps {
  isLogIn: boolean;
  email: string;
  password: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogIn, email, password, onEmailChange, onPasswordChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <Input placeholder="Email" value={email || 'test@gmail.com'} onChange={onEmailChange} />
      <Input type="password" value={password || '123456'} placeholder="Password" onChange={onPasswordChange} />
      <LoginButton type="submit">{isLogIn ? 'Log in' : 'Sign up'}</LoginButton>
    </form>
  );
};

export default AuthForm;

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

  &:focus {
    box-shadow:
      inset 0 1px 1px rgba(0, 0, 0, 0.075),
      0 0 0 0.2rem rgba(58, 202, 234, 0.25);
    outline: none;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  border-radius: 25px;
  padding: 10px 25px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  background-color: #78b7cc;
  font-size: 14px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  border: 2px solid transparent;
  &:hover {
    background-color: white;
    color: #78b7cc;
    border-color: #78b7cc;
  }
`;
