//使用dynamic 來禁用服務端渲染
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import styled from 'styled-components';

import List from './List';

interface Place {
  id: string;
  name: string;
}

const Map = dynamic(() => import('../../components/Map'), {
  ssr: false,
});

const TripPage: React.FC = () => {
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  console.log('selectedPlaces', selectedPlaces);
  const handlePlaceSelect = (place: Place) => {
    setSelectedPlaces([...selectedPlaces, place]);
  };
  return (
    <Container>
      <ListContainer>
        <List onPlaceSelected={handlePlaceSelect} selectedPlaces={selectedPlaces} />
      </ListContainer>
      <MapContainer>
        <Map />
      </MapContainer>
    </Container>
  );
};

export default TripPage;

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const ListContainer = styled.div`
  width: 50%;
`;

const MapContainer = styled.div`
  width: 50%;
`;
