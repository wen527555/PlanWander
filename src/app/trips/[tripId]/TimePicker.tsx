import React, { useState } from 'react';
import styled from 'styled-components';

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
  padding: 20px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
`;

const Label = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-bottom: 12px;
  font-size: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  ${({ variant }) =>
    variant === 'clear'
      ? `
      background-color: #f0f0f0;
      color: #757575;
    `
      : `
      background-color: #a1a9a8;
      color: white;
    `}
`;

// TimePicker and TimeDisplayCard component
const TimePicker = ({ place, dayId, onSave, onClear }) => {
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
        <option value="">Select start time</option>
        {timeSlots.map((time, index) => (
          <option key={index} value={time}>
            {time}
          </option>
        ))}
      </Select>

      <Label>End time</Label>
      <Select value={endTime} onChange={(e) => setEndTime(e.target.value)}>
        <option value="">Select end time</option>
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
