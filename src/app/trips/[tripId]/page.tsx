'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import styled from 'styled-components';

// import useStore from '@/lib/store';
import { addPlaceToDay, fetchTripData, getLastPlaceOfDay, updatePlacesForDay } from '../../../lib/firebaseApi';
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

const MapComponent = dynamic(() => import('./map'), {
  ssr: false,
});

const formatDuration = (duration: any) => {
  const hours = Math.floor(duration / 3600);
  const min = Math.floor((duration % 3600) / 60);
  if (hours > 0) {
    return `${hours}hr ${min}min`;
  } else {
    return `${min}min`;
  }
};

//move to api file
const getRoute = async (start: any, end: any) => {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&access_token=${accessToken}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const route = data.routes[0];
    const duration = formatDuration(route.duration);
    console.log('data', data);

    return {
      coordinates: route.geometry.coordinates,
      type: 'LineString',
      duration: duration,
    };
  } catch (error) {
    console.error('Error fetching route:', error);
    return null;
  }
};

const TripPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const queryClient = useQueryClient();
  const { data: tripData, isLoading } = useQuery({
    queryKey: ['tripData', tripId],
    queryFn: () => fetchTripData(tripId as string),
    staleTime: 5000,
  });
  // const { days, setDays } = useStore();
  //*要再研究是否有必要用到zustand
  console.log('tripData', tripData);

  const addMutation = useMutation({
    mutationFn: async ({ place, dayId }: AddLocationParams) => {
      if (tripId) {
        const prevPlace = await getLastPlaceOfDay(tripId, dayId);
        let route = null;
        if (prevPlace) {
          route = await getRoute(prevPlace, place);
        }
        await addPlaceToDay(tripId, dayId, place, route);
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
    addMutation.mutate({ place, dayId });
  };

  const updateMutation = useMutation({
    mutationFn: async ({ dayId, places }: { dayId: string; places: Place[] }) => {
      const updatedPlaces = await Promise.all(
        places.map(async (place, index) => {
          if (index === 0) {
            return { ...place, route: null };
          }
          const prevPlace = places[index - 1];
          const route = await getRoute(prevPlace, place);
          return {
            ...place,
            route: route
              ? {
                  type: route.type,
                  coordinates: route.coordinates.map((coord: [number, number]) => ({
                    lat: coord[1],
                    lng: coord[0],
                  })),
                  duration: route.duration,
                }
              : null,
          };
        })
      );
      await updatePlacesForDay(tripId, dayId, updatedPlaces);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tripData', tripId as string] });
    },
    onError: (error) => {
      console.error('更新時發生錯誤:', error);
    },
  });

  const handleDaysUpdate = (updates: { dayId: string; places: any }[]) => {
    updates.forEach(({ dayId, places }) => {
      updateMutation.mutate({ dayId, places });
    });
  };

  if (isLoading || !tripData) {
    return <div>Loading...</div>;
  }
  const { places, route } = processDays(tripData.days as any);

  return (
    <Container>
      <ListContainer>
        <TripName>{tripData.tripTitle}</TripName>
        <List days={tripData.days as any} onPlaceSelected={handlePlaceSelected} onDaysUpdate={handleDaysUpdate} />
      </ListContainer>
      <MapContainer>
        <MapComponent places={places as any} routes={route as any} />
      </MapContainer>
    </Container>
  );
};

export default TripPage;

const Container = styled.div`
  display: flex;
`;

const TripName = styled.h1`
  margin: 10px 20px;
  font-size: 20px;
  font-weight: 700;
`;

const ListContainer = styled.div`
  width: 45%;
  height: 100vh;
  overflow-y: auto;
`;

const MapContainer = styled.div`
  width: 55%;
  height: 100vh;
  position: relative;
`;
