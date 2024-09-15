'use client';

import { useQuery } from '@tanstack/react-query';
// mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
import { useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import styled from 'styled-components';

import LocationSearch from './LocationSearch';

interface ItemContentProps {
  isOpen: boolean;
}

interface Place {
  id: string;
  name: string;
}

interface LocationLostProps {
  onPlaceSelected: (place: Place) => void;
  selectedPlaces: Place[];
}

const List: React.FC<LocationLostProps> = ({ onPlaceSelected, selectedPlaces }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <ItemContainer>
      <ItemHeader onClick={handleToggleOpen}>
        <ToggleIcon>{isOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}</ToggleIcon>
        <ItemTitle>Wednesday,September 18th</ItemTitle>
      </ItemHeader>
      <ItemContent isOpen={isOpen}>
        {selectedPlaces?.map((place) => (
          <PlaceContainer key={place.id}>
            <FaMapMarkerAlt />
            <PlaceBlock>{place.name}</PlaceBlock>
          </PlaceContainer>
        ))}
        <LocationSearch onPlaceSelected={onPlaceSelected} />
      </ItemContent>
    </ItemContainer>
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
  max-height: ${(props) => (props.isOpen ? 'auto' : '0')};
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
`;

// const SuggestionList = styled.ul`
//   position: absolute;
//   width: 100%;
//   background-color: #ffff;
//   border-radius: 5px;
//   max-height: 200px;
//   overflow-y: auto;
//   z-index: 100;
//   list-style-type: none;
//   padding: 0;
//   margin: 0;
// `;

// const SuggestionItem = styled.li`
//   padding: 10px;
//   cursor: pointer;
//   display: flex;
//   align-items: center;

//   &:hover {
//     background: #f0f0f0;
//   }
// `;

// const SearchIcon = styled(FaMapMarkerAlt)`
//   margin-right: 10px;
// `;
