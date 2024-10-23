import styled from 'styled-components';

import { Overlay } from '@/app/styles/commonStyles';
import { useConfirmModalStore } from '@/lib/store';

const ConfirmModal = () => {
  const { isModalOpen, message, onConfirm, closeModal } = useConfirmModalStore();
  if (!isModalOpen) return null;
  return (
    isModalOpen && (
      <Overlay>
        <ModalContainer>
          <ModalHeader>Delete</ModalHeader>
          <ModalContent>{message}</ModalContent>
          <ModalActions>
            <CancelButton onClick={closeModal}>No, don’t delete</CancelButton>
            <DeleteButton
              onClick={() => {
                onConfirm();
                closeModal();
              }}
            >
              Yes, delete it
            </DeleteButton>
          </ModalActions>
        </ModalContainer>
      </Overlay>
    )
  );
};

export default ConfirmModal;

const ModalContainer = styled.div`
  width: 400px;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.h3`
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: 600;
`;

const ModalContent = styled.p`
  font-size: 15px;
  margin: 20px 0px;
  font-weight: 500;
  line-height: 20px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: #f0f0f0;
  color: #6d6f70;
  cursor: pointer;
  border-radius: 15px;
  padding: 8px 16px;
  border: none;
  font-weight: 600;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const DeleteButton = styled.button`
  padding: 10px 20px;
  background-color: #a7d6e6;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 15px;
  padding: 8px 16px;
  border: none;
  font-weight: 600;
`;
