import { useQuery } from '@tanstack/react-query';
import { addDays } from 'date-fns';
import { useState } from 'react';
import { RangeKeyDict } from 'react-date-range';
import Select from 'react-select';
import styled from 'styled-components';

import { Button, ButtonWrapper, CloseBtn, CloseBtnWrapper } from '@/app/styles/commonStyles';
import Overlay from '@/components/Overlay';
import DateRangePicker from '@/components/TripModal/DateRangePicker';
import useAlert from '@/lib/hooks/useAlertMessage';
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
  const { addAlert, AlertMessage } = useAlert();
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
    if (!startDate || !endDate || !tripTitle || selectedCountries.length === 0) {
      addAlert('Please fill in all fields');
      return;
    }
    try {
      await onSubmit(tripTitle, startDate, endDate, selectedCountries);
      addAlert('Creation successful');
      onClose();
    } catch (error) {
      console.error('Error', error);
      if (isEditing) {
        addAlert('Update failed, please try again');
      } else {
        addAlert('Creation failed, please try again');
      }
    }
  };

  return (
    <Overlay>
      <ModalContainer>
        <CloseBtnWrapper onClick={onClose}>
          <CloseBtn />
        </CloseBtnWrapper>
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
        <ButtonWrapper>
          <Button onClick={handleSubmit}>{isEditing ? 'Update Settings' : 'Start Planning'}</Button>
        </ButtonWrapper>
      </ModalContainer>
      <AlertMessage />
    </Overlay>
  );
};

export default TripModal;

const ModalContainer = styled.div`
  background-color: white;
  padding: 50px 48px 40px 48px;
  border-radius: 25px;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.2);
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
