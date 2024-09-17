'use client';

// mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
import React, { useState } from 'react';
import { FaCar } from 'react-icons/fa';
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

  console.log('days', days);

  return (
    <>
      {days.map((day, dateIndex) => {
        // const isOpen = openItems[day.date] || false;
        return (
          <ItemContainer key={day.date}>
            <ItemHeader onClick={() => handleToggleOpen(day.date)}>
              {/* <ToggleIcon>{isOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}</ToggleIcon> */}
              <ItemDate>
                {new Date(day.date).toLocaleDateString('en-US', {
                  weekday: 'long',

                  month: 'long',
                  day: 'numeric',
                })}
              </ItemDate>
            </ItemHeader>
            {/* <ItemContent isOpen={isOpen}> */}
            <ItemContent>
              {day.places?.map((place, index) => (
                <React.Fragment key={place.id}>
                  {index > 0 && day.places[index]?.route && (
                    <RouteInfo>
                      <RouteLine />
                      <CarIcon />
                      <RouteDetail>{day.places[index].route.duration}</RouteDetail>
                    </RouteInfo>
                  )}
                  <PlaceContainer>
                    <Marker index={index} dateIndex={dateIndex} />
                    <PlaceBlock>{place.name}</PlaceBlock>
                  </PlaceContainer>
                </React.Fragment>
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
  margin: 10px 20px;
  /* border-bottom: 1px solid #ccc; */
  padding-bottom: 10px;
`;

const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  /* padding: 10px 0px; */
  margin: 10px 20px 15px 20px;
`;

const ItemDate = styled.h3`
  color: #212529;
  font-weight: 700;
  font-size: 20px;
`;

const ToggleIcon = styled.span`
  font-size: 16px;
  margin-right: 10px;
`;

// const ItemContent = styled.div<ItemContentProps>`
const ItemContent = styled.div`
  /* display: ${(props) => (props.isOpen ? 'block' : 'none')};
  overflow: hidden;
  transition: transform 0.3s ease; */
  width: 90%;
`;

const PlaceContainer = styled.div`
  width: 100%;
  display: flex;
  margin: 5px 30px 0px 20px;
`;

const PlaceBlock = styled.div`
  width: 100%;
  padding: 10px;
  background-color: #f3f4f5;
  border: none;
  border-radius: 5px;
  height: 40px;
  font-size: 16px;
  cursor: pointer;
`;

const RouteInfo = styled.div`
  width: 100%;
  display: flex;
  margin: 10px 60px;
  align-items: center;
`;

const RouteLine = styled.div`
  border-left: 2px dashed #ccc;
  height: 30px;
`;

const CarIcon = styled(FaCar)`
  color: #888;
  margin: 0px 10px;
`;

const RouteDetail = styled.div`
  font-size: 12px;
  color: #888;
`;
