import { Autocomplete, LoadScript } from '@react-google-maps/api';
import React, { useCallback, useState } from 'react';

export const LocationAutocomplete: React.FC = () => {
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

export const getRoute = async (start: any, end: any, mode: string = 'driving') => {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
  const url = `https://api.mapbox.com/directions/v5/mapbox/${mode}/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&access_token=${accessToken}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const route = data.routes[0];
    const duration = formatDuration(route.duration);
    const distance = (route.distance / 1000).toFixed(2);

    return {
      coordinates: route.geometry.coordinates,
      type: 'LineString',
      duration: duration,
      distance: distance,
    };
  } catch (error) {
    console.error('Error fetching route:', error);
    return null;
  }
};

const formatDuration = (duration: any) => {
  const hours = Math.floor(duration / 3600);
  const min = Math.floor((duration % 3600) / 60);
  if (hours > 0) {
    return `${hours}hr ${min}min`;
  } else {
    return `${min}min`;
  }
};

export const fetchPlaceDetail = async (lat: number, lng: number) => {
  // const hereApiKey = process.env.NEXT_PUBLIC_HERE_API_KEY;
  // const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  // const url = `https://places.ls.hereapi.com/places/v1/discover/explore?at=${lat},${lng}&apiKey=${hereApiKey}`;
  // const url = `/api/here/v1/discover/explore?at=${lat},${lng}&apiKey=${hereApiKey}`;
  const res = await fetch(`/api/map?lat=${lat}&lng=${lng}`);

  // const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=restaurant&language=zh-CN&key=${googleApiKey}`;
  // const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Failed to fetch places');
  }
  const data = await res.json();
  console.log('data', data);
  // return data.results.item;
  return data.results;
};