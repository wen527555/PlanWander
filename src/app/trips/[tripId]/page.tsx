'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import styled from 'styled-components';

import { addPlaceToDay, fetchTripData } from '../../../lib/firebaseApi';
import List from './List';
import { processDays } from './processDays';

interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface AddLocationParams {
  place: Place;
  dayId: string;
}

const MapComponent = dynamic(() => import('../../../components/Map'), {
  ssr: false,
});

const TripPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const queryClient = useQueryClient();

  const { data: tripData, isLoading } = useQuery({
    queryKey: ['tripData', tripId],
    queryFn: () => fetchTripData(tripId as string),
    staleTime: 5000,
  });

  console.log('tripData', tripData);

  const mutation = useMutation({
    mutationFn: async ({ place, dayId }: AddLocationParams) => {
      if (tripId) {
        await addPlaceToDay(tripId, dayId, place);
      }
    },

    onSuccess: () => {
      if (tripId) {
        queryClient.invalidateQueries({ queryKey: ['tripData', tripId as string] });
      }
    },
    onError: (error: Error) => {
      console.error(error.message);
    },
  });

  const handlePlaceSelected = (place: Place, dayId: string) => {
    mutation.mutate({ place, dayId });
  };

  if (isLoading || !tripData) {
    return <div>Loading...</div>;
  }
  const { tripTitle, days } = tripData;
  const placeWithMarkerAndRoutes = processDays(days);

  return (
    <Container>
      <ListContainer>
        <h1>{tripTitle}</h1>
        <List days={days} onPlaceSelected={handlePlaceSelected} />
      </ListContainer>
      <MapContainer>
        <MapComponent placesWithMarkerAndRoutes={placeWithMarkerAndRoutes} />
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
  height: 100vh;
`;

const MapContainer = styled.div`
  width: 50%;
  height: 100vh;
  position: relative;
`;
