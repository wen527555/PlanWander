'use client';

import { IoMdClose } from 'react-icons/io';
import styled from 'styled-components';

interface AddTripModalProps {
  onClose: () => void;
}

const AddTripModal: React.FC<AddTripModalProps> = ({ onClose }) => {
  return (
    <Overlay>
      <Content>
        <CloseBtnWrapper onClick={onClose}>
          <CloseBtn />
        </CloseBtnWrapper>
      </Content>
    </Overlay>
  );
};

export default AddTripModal;

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

const CloseBtn = styled(IoMdClose)`
  cursor: pointer;
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 24px;
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
