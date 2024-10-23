import { Autocomplete } from '@react-google-maps/api';
import React, { useCallback, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface LocationSearchProps {
  onPlaceAdded: (place: Place, dayId: string) => void;
  dayId: string;
}
const LocationSearch: React.FC<LocationSearchProps> = ({ onPlaceAdded, dayId }) => {
  const [inputValue, setInputValue] = useState('');
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const onLoad = useCallback((autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  }, []);

  const onPlaceChanged = async () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry?.location && place.name) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const photoUrl = place.photos && place.photos.length > 0 ? place.photos[0].getUrl({ maxWidth: 400 }) : '';
        const newPlace = {
          id: place.place_id || '',
          name: place.name || '',
          lat: lat,
          lng: lng,
          address: place.formatted_address,
          phone: place.international_phone_number || '',
          website: place.website || '',
          googleUrl: place.url || '',
          rating: place.rating || 0,
          openTime: place.opening_hours?.weekday_text || [],
          photo: photoUrl,
        };
        onPlaceAdded(newPlace, dayId);
        setInputValue('');
      }
    }
  };

  return (
    <>
      <GlobalStyle />
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <SearchInput
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a place"
        />
      </Autocomplete>
    </>
  );
};

export default LocationSearch;

const SearchInput = styled.input`
  width: 90%;
  padding: 10px;
  background-color: #f3f4f5;
  border: none;
  border-radius: 5px;
  height: 40px;
  font-size: 16px;
  margin: 10px 0px 0px 21px;
  cursor: pointer;
  &:focus {
    box-shadow:
      inset 0 1px 1px rgba(0, 0, 0, 0.075),
      0 0 0 0.2rem rgba(63, 82, 227, 0.25);
    outline: none;
  }
`;
const GlobalStyle = createGlobalStyle`
  .pac-container {
    max-height: 150px;
    position:fixed;
    overflow-y: auto;
    border-radius: 8px;
    z-index: 1000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: white;
    white-space: normal;
    word-wrap: break-word; 
  }
  
  .pac-item {
    font-size: 16px;
    padding: 10px 15px;
    display: flex;
    align-items: center; 
    gap: 12px;
    color: #333;
    background-color: #fff;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
  }

  .pac-item:hover {
    background-color: #f5f5f5;
  }

  .pac-item-selected {
    background-color: #e0e0e0;
  }



  .pac-item-query {
    font-weight: bold;
    color: #000;
  }
`;
