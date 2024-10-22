import { IoArrowBackCircleOutline } from 'react-icons/io5';
import styled from 'styled-components';

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
  padding: 5px 20px;
  z-index: 2;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const HomeIcon = styled(IoArrowBackCircleOutline)`
  cursor: pointer;
  font-size: 30px;
`;
