import { format } from 'date-fns';
import { DateRange, RangeKeyDict } from 'react-date-range';
import styled from 'styled-components';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface DateRangePickerProps {
  date: {
    startDate: Date | null;
    endDate: Date | null;
    key: string;
  }[];
  showCalendar: boolean;
  setShowCalendar: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelect: (ranges: RangeKeyDict) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ date, showCalendar, setShowCalendar, handleSelect }) => {
  return (
    <DatePickerWrapper>
      <DateDisplay onClick={() => setShowCalendar(!showCalendar)}>
        <DateBoxWrapper>
          <Label>Start date</Label>
          <DateBox>{date?.[0]?.startDate ? format(date[0].startDate, 'dd MMMM yyyy') : 'Start Date'}</DateBox>
        </DateBoxWrapper>
        <Arrow>→</Arrow>
        <DateBoxWrapper>
          <Label>End date</Label>
          <DateBox>{date?.[0]?.endDate ? format(date[0].endDate, 'dd MMMM yyyy') : 'End Date'}</DateBox>
        </DateBoxWrapper>
      </DateDisplay>

      {showCalendar && (
        <CalendarPopup>
          <DateRange
            editableDateInputs={true}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            ranges={date}
            months={2}
            direction="horizontal"
            rangeColors={['#94C3D2']}
            autoFocus={false}
          />
        </CalendarPopup>
      )}
    </DatePickerWrapper>
  );
};

export default DateRangePicker;

const DatePickerWrapper = styled.div`
  position: relative;
  max-width: 600px;
  margin: 20px auto;
  .rdrDateDisplayWrapper {
    display: none;
  }
`;

const DateDisplay = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: space-between;
  margin-bottom: 16px;
  border-radius: 8px;
`;

const DateBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const DateBox = styled.div`
  flex: 1;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  text-align: center;
`;

const Arrow = styled.div`
  margin: 15px 15px 0px 15px;
  font-size: 24px;
  color: #333;
`;

const CalendarPopup = styled.div`
  position: absolute;
  bottom: 60px;
  left: 0;
  z-index: 999;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  border-radius: 8px;
  width: 100%;
`;

const Label = styled.div`
  margin-bottom: 10px;
  color: #333;
  font-size: 16px;
  font-weight: 500;
`;
