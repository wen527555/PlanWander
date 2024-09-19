import { Autocomplete, LoadScript } from '@react-google-maps/api';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

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
      // console.log('place', place);
      if (place.geometry?.location && place.name) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

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
        };
        onPlaceAdded(newPlace, dayId);
        setInputValue('');
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY!} libraries={['places']}>
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <SearchInput
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a place"
        />
      </Autocomplete>
    </LoadScript>
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
`;
