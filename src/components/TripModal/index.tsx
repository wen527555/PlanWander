import { useQuery } from '@tanstack/react-query';
import { addDays } from 'date-fns';
// import { useRouter } from 'next/router';
import { useState } from 'react';
import { RangeKeyDict } from 'react-date-range';
import { IoMdClose } from 'react-icons/io';
import Select from 'react-select';
import styled from 'styled-components';

import DateRangePicker from '@/components/TripModal/DateRangePicker';
import { fetchCountries } from '@/lib/mapApi';

interface Country {
  code: string;
  name: string;
}

interface SelectedOption {
  value: string;
  label: string;
}

interface TripData {
  tripTitle: string;
  startDate: Date;
  endDate: Date;
  countries: SelectedOption[];
}

interface TripModalProps {
  onClose: () => void;
  isEditing: boolean;
  initialData?: TripData | null;
  onSubmit: (tripTitle: string, startDate: Date, endDate: Date, selectedCountries: SelectedOption[]) => Promise<void>;
}

const TripModal: React.FC<TripModalProps> = ({ onClose, isEditing = false, initialData, onSubmit }) => {
  const [date, setDate] = useState([
    {
      startDate: initialData?.startDate ?? new Date(),
      endDate: initialData?.endDate ?? addDays(new Date(), 2),
      key: 'selection',
    },
  ]);
  const [tripTitle, setTripTitle] = useState<string>(initialData?.tripTitle || '');
  const [selectedCountries, setSelectedCountries] = useState<SelectedOption[]>(
    initialData?.countries?.map((country: any) => ({
      value: country.code || country.value,
      label: country.name || country.label,
    })) || []
  );
  const [showCalendar, setShowCalendar] = useState(false);

  const { data: countryOptions } = useQuery<SelectedOption[]>({
    queryKey: ['countries'],
    queryFn: async () => {
      const countries: Country[] = await fetchCountries();
      return countries.map((country) => ({
        value: country.code,
        label: country.name,
      }));
    },
  });
  const handleChange = (selectedOptions: SelectedOption[]) => {
    setSelectedCountries(selectedOptions);
  };

  const handleSelect = (ranges: RangeKeyDict) => {
    const { selection } = ranges;
    setDate([
      {
        startDate: selection.startDate ?? new Date(),
        endDate: selection.endDate ?? addDays(new Date(), 2),
        key: selection.key,
      },
    ]);
    setShowCalendar(false);
  };

  const handleSubmit = async () => {
    const startDate = date[0].startDate;
    const endDate = date[0].endDate;
    if (!startDate || !endDate || !tripTitle) {
      console.error('Missing required fields');
      return;
    }
    try {
      await onSubmit(tripTitle, startDate, endDate, selectedCountries);
      onClose();
    } catch (error) {
      console.error('Error', error);
    }
  };

  return (
    <Overlay>
      <Modal>
        <CloseBtnWrapper onClick={onClose}>
          <CloseBtn />
        </CloseBtnWrapper>
        <Content>
          <Title>Trip Name</Title>
          <NameInput
            type="text"
            value={tripTitle}
            onChange={(e) => setTripTitle(e.target.value)}
            placeholder="Give you trip a name..."
          />
          <Title>Which countries are you going?</Title>
          <StyledSelect
            isMulti
            value={selectedCountries}
            onChange={(newValue) => handleChange(newValue as SelectedOption[])}
            options={countryOptions}
            classNamePrefix="select"
            placeholder="Select countries..."
          />
          <DateRangePicker
            date={date}
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
            handleSelect={handleSelect}
          />
          <CreateButtonWrapper>
            <CreateButton onClick={handleSubmit}>{isEditing ? 'Update Settings' : 'Start Planning'}</CreateButton>
          </CreateButtonWrapper>
        </Content>
      </Modal>
    </Overlay>
  );
};

export default TripModal;

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

const Modal = styled.div`
  background-color: white;
  padding: 64px 48px 48px 48px;
  border-radius: 25px;
  /* width: 450px; */
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.2);
`;

const Content = styled.div`
  padding: 0;
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
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 15px;
`;

const NameInput = styled.input`
  width: 100%;
  margin-bottom: 30px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  padding: 18px 24px;
  &:hover {
    border-color: #94c3d2;
  }
`;

const CreateButtonWrapper = styled.div`
  display: flex;
  justify-content: end;
`;

const CreateButton = styled.button`
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

const StyledSelect = styled(Select)`
  .select__control {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px 20px;
    box-shadow: none;
    &:hover {
      border-color: #94c3d2;
    }
  }

  .select__multi-value {
    background-color: #e0f7fa;
  }

  .select__multi-value__label {
    color: #333;
  }

  .select__multi-value__remove {
    color: #333;
    &:hover {
      background-color: #94c3d2;
      color: white;
    }
  }

  .select__option {
    background-color: white;
    color: #333;
    padding: 10px;
    &:hover {
      background-color: #e0f7fa;
      color: #333;
    }
    &.select__option--is-selected {
      background-color: #e0f7fa;
      color: #333;
    }
  }
`;
