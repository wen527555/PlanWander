import React, { useState } from 'react';
import styled from 'styled-components';

interface ButtonProps {
  variant: 'clear' | 'save';
}

interface TimePickerProps {
  place: { id: string };
  dayId: string;
  onSave: (placeId: string, dayId: string, startTime: string, endTime: string) => void;
  onClear: () => void;
}

const generateTimeSlots = () => {
  const times = [];
  let startTime = 0;
  while (startTime < 24 * 60) {
    const hours = Math.floor(startTime / 60);
    const minutes = startTime % 60;
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    times.push(timeString);
    startTime += 30;
  }
  return times;
};

const TimePickerWrapper = styled.div`
  position: absolute;
  width: 300px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  z-index: 999;
`;

const Label = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 12px;
  font-size: 16px;

  option {
    background-color: white;
    color: #333;
    padding: 10px;
    font-size: 14px;
  }

  /* &:focus {
    border-color: #94c3d2;
  }

  &:hover {
    border-color: #94c3d2;
  } */
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
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

const TimePicker: React.FC<TimePickerProps> = ({ place, dayId, onSave, onClear }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const timeSlots = generateTimeSlots();

  const handleSave = () => {
    onSave(place.id, dayId, startTime, endTime);
  };

  return (
    <TimePickerWrapper>
      <Label>Start time</Label>
      <Select value={startTime} onChange={(e) => setStartTime(e.target.value)}>
        {timeSlots.map((time, index) => (
          <option key={index} value={time}>
            {time}
          </option>
        ))}
      </Select>

      <Label>End time</Label>
      <Select value={endTime} onChange={(e) => setEndTime(e.target.value)}>
        {timeSlots.map((time, index) => (
          <option key={index} value={time}>
            {time}
          </option>
        ))}
      </Select>

      <ButtonGroup>
        <Button variant="clear" onClick={onClear}>
          Close
        </Button>
        <Button variant="save" onClick={handleSave}>
          Save
        </Button>
      </ButtonGroup>
    </TimePickerWrapper>
  );
};

export default TimePicker;
