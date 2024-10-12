import { IoMdClose } from 'react-icons/io';
import styled from 'styled-components';

export const Overlay = styled.div`
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

export const Modal = styled.div`
  background-color: white;
  padding: 64px 48px 48px 48px;
  border-radius: 25px;
  /* width: 450px; */
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.2);
`;

export const CloseBtn = styled(IoMdClose)`
  cursor: pointer;
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 24px;
`;

export const CloseBtnWrapper = styled.button`
  cursor: pointer;
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: end;
`;

export const Button = styled.button`
  margin-top: 40px;
  width: auto;
  border-radius: 25px;
  padding: 15px;
  border: none;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  background-color: #78b7cc;
  &:hover {
    border-color: #94c3d2;
  }
`;
