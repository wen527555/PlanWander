import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

import styled from 'styled-components';

interface ButtonProps {
  variant: 'clear' | 'save';
}

interface TimePickerProps {
  place: { id: string };
  initialStayDuration: number;
  dayId: string;
  onSave: (placeId: string, dayId: string, initialStayDuration: number) => void;
  onClose: () => void;
}

const TimePickerWrapper = styled.div`
  position: absolute;
  max-width: 250px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  z-index: 5;
  padding: 10px 25px 15px;
  display: flex;
  flex-direction: column;

  .flatpickr-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .flatpickr-calendar {
    width: 100px;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 999;
    overflow: hidden;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(10px);
  }
`;

const Label = styled.div`
  font-weight: 600;
  margin: 8px 0px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
`;

const Button = styled.button<ButtonProps>`
  padding: 8px 16px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  ${({ variant }) =>
    variant === 'clear'
      ? `
      background-color: #f0f0f0;
      color: #6d6f70;
    `
      : `
      background-color: #a7d6e6;
      color: white;
    `}
`;

const TimePickerComponent: React.FC<TimePickerProps> = ({
  place,
  initialStayDuration = 3600,
  dayId,
  onSave,
  onClose,
}) => {
  const [stayDuration, setStayDuration] = useState<number>(initialStayDuration);

  const hours = Math.floor(stayDuration / 3600);
  const minutes = Math.floor((stayDuration % 3600) / 60);
  const initialTime = new Date();
  initialTime.setHours(hours);
  initialTime.setMinutes(minutes);
  const handleSave = () => {
    onSave(place.id, dayId, stayDuration);
  };

  return (
    <TimePickerWrapper onClick={(e) => e.stopPropagation()}>
      <Label>Stay Duration</Label>
      <Flatpickr
        id="start-time-picker"
        value={initialTime}
        options={{
          enableTime: true,
          noCalendar: true,
          dateFormat: 'H:i',
          time_24hr: true,
          // allowInput: true,
        }}
        onChange={(selectedTime: Date[]) => {
          if (selectedTime.length > 0) {
            const selectedDate = selectedTime[0];
            const selectedHours = selectedDate.getHours();
            const selectedMinutes = selectedDate.getMinutes();
            setStayDuration(selectedHours * 3600 + selectedMinutes * 60);
          }
        }}
      />
      <ButtonGroup>
        <Button variant="clear" onClick={onClose}>
          Close
        </Button>
        <Button variant="save" onClick={handleSave}>
          Save
        </Button>
      </ButtonGroup>
    </TimePickerWrapper>
  );
};

export default TimePickerComponent;
