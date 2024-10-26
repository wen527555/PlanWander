import React from 'react';
import styled from 'styled-components';

interface AuthFormProps {
  isLogIn: boolean;
  email: string;
  password: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isLogIn,
  email,
  setEmail,
  password,
  setPassword,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) => {
  return (
    <Form onSubmit={onSubmit}>
      <Input placeholder="Email" value={email} onChange={onEmailChange} />
      <Input type="password" value={password} placeholder="Password" onChange={onPasswordChange} />
      <GuestButton
        type="button"
        onClick={() => {
          setEmail('test@gmail.com');
          setPassword('123456');
        }}
      >
        Guest Login
      </GuestButton>
      <LoginButton type="submit">{isLogIn ? 'Log in' : 'Sign up'}</LoginButton>
    </Form>
  );
};

export default AuthForm;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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

const GuestButton = styled.button`
  width: 30%;
  border-radius: 25px;
  padding: 5px 0px;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  background-color: #fff;
  color: #ccc;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  &:hover {
    color: white;
    background-color: #ccc;
  }
`;
