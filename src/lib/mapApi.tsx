import { Autocomplete, LoadScript } from '@react-google-maps/api';
import React, { useCallback, useState } from 'react';

const LocationAutocomplete: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const onLoad = useCallback((autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  }, []);

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      console.log('place', place);
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY!} libraries={['places']}>
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="輸入地點"
          style={{ width: '100%', padding: '8px' }}
        />
      </Autocomplete>
    </LoadScript>
  );
};

export default LocationAutocomplete;
