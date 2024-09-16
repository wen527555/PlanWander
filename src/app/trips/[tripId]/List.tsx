'use client';

// mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
import { useState } from 'react';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import styled from 'styled-components';

import LocationSearch from './LocationSearch';
import Marker from './Marker';

interface ItemContentProps {
  isOpen: boolean;
}

interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface Day {
  date: string;
  places: Place[];
}

interface ListProps {
  days: Day[];
  onPlaceSelected: (place: Place, dayId: string) => void;
}

const List: React.FC<ListProps> = ({ days, onPlaceSelected }) => {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const handleToggleOpen = (day: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  return (
    <>
      {days.map((day, dateIndex) => {
        const isOpen = openItems[day.date] || false;
        return (
          <ItemContainer key={day.date}>
            <ItemHeader onClick={() => handleToggleOpen(day.date)}>
              <ToggleIcon>{isOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}</ToggleIcon>
              <ItemTitle>
                {new Date(day.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </ItemTitle>
            </ItemHeader>
            <ItemContent isOpen={isOpen}>
              {day.places?.map((place, index) => (
                <PlaceContainer key={place.id}>
                  <Marker index={index} dateIndex={dateIndex} />
                  <PlaceBlock>{place.name}</PlaceBlock>
                </PlaceContainer>
              ))}
              <LocationSearch onPlaceSelected={onPlaceSelected} dayId={day.date} />
            </ItemContent>
          </ItemContainer>
        );
      })}
    </>
  );
};

export default List;

const ItemContainer = styled.div`
  margin: 10px 10px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  width: 100%;
`;

const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ItemTitle = styled.h3``;

const ToggleIcon = styled.span`
  font-size: 24px;
`;

const ItemContent = styled.div<ItemContentProps>`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  overflow: hidden;
  transition: transform 0.3s ease;
  width: 90%;
`;

const PlaceContainer = styled.div`
  width: 100%;
  display: flex;
`;

const PlaceBlock = styled.div`
  width: 90%;
  padding: 10px;
  background-color: #f3f4f5;
  border: none;
  border-radius: 5px;
  height: 40px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
`;
