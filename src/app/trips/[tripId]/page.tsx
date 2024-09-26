'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { FaGlobe, FaPhoneAlt, FaStar } from 'react-icons/fa';
import { FaClock, FaMapPin } from 'react-icons/fa6';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import styled from 'styled-components';

import { processDays } from '@/lib/processDays';
import { usePlaceStore } from '@/lib/store';
import {
  addPlaceToDay,
  deletePlace,
  fetchTripData,
  getLastPlaceOfDay,
  getPlaceForDay,
  updatePlaceRoute,
  updatePlacesForDay,
} from '../../../lib/firebaseApi';
import { getRoute } from '../../../lib/mapApi';
// import useStore from '../../../lib/store';
import List from './List';

interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  route?: any;
  openingHours?: any;
  phone?: string;
  website?: string;
}

interface AddLocationParams {
  place: any;
  dayId: string;
  newRoute: Route | null;
  transportMode: string;
}

interface Route {
  type: string;
  coordinates: [number, number][];
  duration: string;
}

type TransportMode = 'driving' | 'walking' | 'cycling';

const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false,
});

const TripPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const queryClient = useQueryClient();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { data: tripData, isLoading } = useQuery({
    queryKey: ['tripData', tripId],
    queryFn: () => fetchTripData(tripId as string),
    staleTime: 5000,
  });

  //*要再研究是否有必要用到zustand
  const { selectedPlace, setSelectedPlace } = usePlaceStore();
  const router = useRouter();
  const addMutation = useMutation({
    mutationFn: async ({ place, dayId, transportMode = 'driving' }: AddLocationParams) => {
      if (tripId) {
        const prevPlace = await getLastPlaceOfDay(tripId, dayId);
        let route = null;
        if (prevPlace) {
          route = await getRoute(prevPlace, place, transportMode);
        }
        await addPlaceToDay(tripId, dayId, place, route, transportMode);
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

  //研究有沒有更好的寫法
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedPlace(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddPlace = (place: Place, dayId: string) => {
    addMutation.mutate({
      place,
      dayId,
      newRoute: null,
      transportMode: 'driving',
    });
  };

  const updateMutation = useMutation({
    mutationFn: async ({ dayId, places }: { dayId: string; places: Place[] }) => {
      const updatedPlaces = await Promise.all(
        places.map(async (place, index) => {
          if (index === 0) {
            return { ...place, route: null };
          }
          const prevPlace = places[index - 1];
          // const prevPlace =places[index+1];
          const transportMode = place.route?.transportMode || 'driving';
          const route = await getRoute(prevPlace, place, transportMode);
          return {
            ...place,
            route: route
              ? {
                  type: route.type,
                  transportMode,
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

  const handleDaysUpdate = (updates: any[]) => {
    updates.forEach(({ dayId, places }) => {
      updateMutation.mutate({ dayId, places });
    });
  };

  //應該用zustand減少不必要的重複炫染
  const transportModeUpdateMutation = useMutation({
    mutationFn: async ({ dayId, place, newRoute, transportMode }: AddLocationParams) => {
      await updatePlaceRoute(tripId, dayId, place, newRoute, transportMode);
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
  const handleModeChange = async (dayId: string, place: string, newRoute: Route | null, newMode: TransportMode) => {
    await transportModeUpdateMutation.mutateAsync({ dayId, place, newRoute, transportMode: newMode });
  };

  const deletePlaceMutation = useMutation({
    mutationFn: async ({ tripId, dayId, placeId }: { tripId: string; dayId: string; placeId: string }) => {
      await deletePlace(tripId, dayId, placeId);
      const remainingPlaces: Place[] = await getPlaceForDay(tripId, dayId);
      const placeIndex = remainingPlaces.findIndex((place: { id: string }) => place.id === placeId);
      const prevPlace = placeIndex > 0 ? remainingPlaces[placeIndex - 1] : null;
      const nextPlace = placeIndex < remainingPlaces.length ? remainingPlaces[placeIndex + 1] : null;
      if (prevPlace && nextPlace) {
        const newRoute = await getRoute(prevPlace, nextPlace, 'driving');
        console.log('newRoute', newRoute);
        await updatePlaceRoute(tripId, dayId, nextPlace.id, newRoute, 'driving');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tripData', tripId as string] });
    },
    onError: (error: Error) => {
      console.error('Error deleting place:', error.message);
    },
  });

  const handlePlaceDelete = (dayId: string, placeId: string) => {
    deletePlaceMutation.mutate({ tripId, dayId, placeId });
  };

  const handlePlaceClick = async (place: Place) => {
    setSelectedPlace(place);
  };

  const handleBackProfile = () => {
    router.push('/profile');
  };

  if (isLoading || !tripData) {
    return <div>Loading...</div>;
  }
  // console.log('tripData', tripData);
  const { places, route } = processDays(tripData.days as any);

  return (
    <Container>
      <ListContainer>
        <ListHeader>
          <HomeIcon onClick={handleBackProfile} />
          <TripName>{tripData.tripTitle}</TripName>
        </ListHeader>
        <List
          days={tripData.days as any}
          onPlaceAdded={handleAddPlace}
          onDaysUpdate={handleDaysUpdate}
          onModeUpdate={handleModeChange}
          onPlaceDelete={handlePlaceDelete}
          onPlaceClick={handlePlaceClick}
          tripId={tripId}
        />
      </ListContainer>
      <MapContainer>
        <MapComponent places={places as any} routes={route as any} onPlaceClick={handlePlaceClick} />
        {selectedPlace && (
          <PlaceInfoModal ref={modalRef}>
            <ModalHeader>
              <PlaceName>{selectedPlace.name}</PlaceName>
            </ModalHeader>

            {selectedPlace?.rating && (
              <RatingWrapper>
                <RatingIcon />
                <Rating>{selectedPlace.rating}</Rating>
              </RatingWrapper>
            )}

            {selectedPlace?.address && (
              <Wrapper>
                <AddressIcon />
                <PlaceAddress>{selectedPlace.address}</PlaceAddress>
              </Wrapper>
            )}

            {selectedPlace.openingHours && (
              <HoursWrapper>
                <FaClock />
                {selectedPlace.openingHours}
              </HoursWrapper>
            )}

            {selectedPlace.phone && (
              <Wrapper>
                <FaPhoneAlt />
                {selectedPlace.phone}
              </Wrapper>
            )}

            {selectedPlace.website && (
              <Wrapper>
                <FaGlobe />
                <a href={selectedPlace.website} target="_blank" rel="noopener noreferrer">
                  {selectedPlace.website}
                </a>
              </Wrapper>
            )}
          </PlaceInfoModal>
        )}
      </MapContainer>
    </Container>
  );
};

export default TripPage;

const Container = styled.div`
  display: flex;
`;

const ListHeader = styled.div`
  margin: 10px 20px;
  display: flex;
  align-items: center;
`;

const HomeIcon = styled(IoArrowBackCircleOutline)`
  cursor: pointer;
  font-size: 30px;
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

const PlaceInfoModal = styled.div`
  background-color: #fff;
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 80%;
  height: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
`;

const PlaceName = styled.h1`
  font-size: 20px;
  font-weight: 600;
`;

const RatingWrapper = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
`;

const Rating = styled.div`
  font-size: 14px;
  color: #ff9800;
  display: flex;
  align-items: center;
  font-weight: 700;
`;

const Wrapper = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  color: #333;
  svg {
    margin-right: 8px;
  }
  a {
    color: #1e88e5;
    text-decoration: none;
    margin-left: 5px;
  }
`;

const PlaceAddress = styled.div`
  font-size: 16px;
`;

const AddressIcon = styled(FaMapPin)`
  font-size: 16px;
  margin-right: 10px;
`;

const RatingIcon = styled(FaStar)`
  font-size: 14px;
  color: #ff9800;
  margin-right: 10px;
`;

const HoursWrapper = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  color: #555;
  svg {
    margin-right: 10px;
  }
`;
