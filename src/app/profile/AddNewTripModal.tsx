'use client';

import { useRouter } from 'next/navigation';
import { forwardRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import { IoMdClose } from 'react-icons/io';
import styled from 'styled-components';

import 'react-datepicker/dist/react-datepicker.css';

import { createNewTrip } from '@/lib/firebaseApi';

interface AddTripModalProps {
  onClose: () => void;
}

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
}

const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(({ value, onClick }, ref) => (
  <button className="date-input" onClick={onClick} ref={ref}>
    {value ? value : 'Select Date'}
  </button>
));

CustomInput.displayName = 'CustomInput';

const AddNewTripModal: React.FC<AddTripModalProps> = ({ onClose }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [tripTitle, setTripTitle] = useState<string>('');
  const router = useRouter();
  const handleCreateTrip = async () => {
    if (!startDate || !endDate || !tripTitle) {
      console.error('Missing required fields');
      return;
    }
    try {
      const tripId = await createNewTrip(tripTitle, startDate, endDate);
      console.log('Trip created successfully');
      onClose();
      router.push(`/trips/${tripId}`);
    } catch (err) {
      console.error('Error creating trip:', err);
    }
  };

  return (
    <Overlay>
      <Content>
        <CloseBtnWrapper onClick={onClose}>
          <CloseBtn />
        </CloseBtnWrapper>
        <Title>Trip name</Title>
        <NameInput type="text" value={tripTitle} onChange={(e) => setTripTitle(e.target.value)} />
        <StyledDatePickerWrapper>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date ?? undefined)}
            startDate={startDate}
            endDate={endDate}
            selectsStart
            dateFormat="d MMMM yyyy"
            customInput={<CustomInput />}
            placeholderText="Start date"
          />
          <span className="separator">→</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date ?? undefined)}
            startDate={startDate}
            endDate={endDate}
            selectsEnd
            minDate={startDate}
            dateFormat="d MMMM yyyy"
            customInput={<CustomInput />}
            placeholderText="End date"
          />
        </StyledDatePickerWrapper>
        <CreateButton onClick={handleCreateTrip}>Start Planning</CreateButton>
      </Content>
    </Overlay>
  );
};
AddNewTripModal.displayName = 'AddNewTripModal';
export default AddNewTripModal;

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

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
`;

const NameInput = styled.input`
  width: 80%;
  margin-bottom: 20px;
  font-size: 24px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
`;

const CreateButton = styled.button`
  width: 150px;
  border-radius: 25px;
  padding: 10px;
  border: none;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
`;

const StyledDatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  .date-input {
    padding: 10px;
    border: 1px solid #ddd;
    background: #ffff;
    border-radius: 8px;
    text-align: center;
    font-size: 16px;
    cursor: pointer;
    min-width: 150px;
  }

  .separator {
    font-size: 24px;
  }

  .description {
    font-size: 12px;
    color: #666;
    margin-top: 8px;
  }

  .react-datepicker {
    border: none;
  }

  .react-datepicker__header {
    background-color: white;
    border-bottom: none;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-range {
    background-color: #b4b5b4;
    color: white;
    border-radius: 50%;
  }

  .react-datepicker__day--in-range {
    background-color: #d2d2d2;
    color: white;
  }

  .react-datepicker__day--in-range-start,
  .react-datepicker__day--in-range-end {
    background-color: #b4b5b4;
    color: white;
  }

  .react-datepicker__day:hover {
    background-color: #d2d2d2;
    color: white;
  }
`;
