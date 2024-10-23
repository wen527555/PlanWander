import { IoMdClose } from 'react-icons/io';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
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

export const ListHeader = styled.div`
  display: flex;
  align-items: center;
  position: fixed !important;
  top: 0;
  left: 0;
  border-bottom: 1px solid #e9ecef;
  height: 54px;
  width: 50%;
  background-color: white;
  padding: 5px 40px 5px 20px;
  border-bottom: 1px solid #dde9ed;
  z-index: 2;
  justify-content: space-between;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const HomeIcon = styled(IoArrowBackCircleOutline)`
  cursor: pointer;
  font-size: 30px;
`;
