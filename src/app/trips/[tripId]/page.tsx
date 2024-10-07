'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useTransition } from 'react';
import { FaGlobe, FaPhoneAlt, FaStar } from 'react-icons/fa';
import { FaClock, FaMapPin, FaRegCalendarDays } from 'react-icons/fa6';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import { RiEdit2Fill } from 'react-icons/ri';
// import { PiPencilLine } from 'react-icons/pi';
import styled from 'styled-components';

import LoadingAnimation from '@/components/Loading';
import TripModal from '@/components/TripModal';
import { processDays } from '@/lib/processDays';
import { useModalStore, usePlaceStore } from '@/lib/store';
import {
  addPlaceToDay,
  deletePlace,
  fetchTripData,
  fetchUpdateTrip,
  getLastPlaceOfDay,
  getPlaceForDay,
  updatePlaceRoute,
  updatePlacesForDay,
} from '../../../lib/firebaseApi';
import { getRoute } from '../../../lib/mapApi';
import List from './List';

interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  route?: any;
  openTime?: string[];
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

interface SelectedOption {
  value: string;
  label: string;
}
interface Day {
  date: string;
}

interface TripData {
  tripTitle: string;
  startDate: string;
  endDate: string;
  countries: SelectedOption[];
  imageUrl: string;
  days: Day[];
}

interface UpdateTripParams {
  tripId: string;
  tripTitle: string;
  startDate: Date;
  endDate: Date;
  selectedCountries: SelectedOption[];
  originalTripData?: TripData;
}

const daysMap = {
  星期日: 'Su',
  星期一: 'Mo',
  星期二: 'Tu',
  星期三: 'We',
  星期四: 'Th',
  星期五: 'Fr',
  星期六: 'Sa',
};

type TransportMode = 'driving' | 'walking' | 'cycling';

const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false,
});

const TripPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const queryClient = useQueryClient();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { isModalOpen, openModal, closeModal } = useModalStore();
  const [isPending, startTransition] = useTransition();
  const { data: tripData, isLoading } = useQuery({
    queryKey: ['tripData', tripId],
    queryFn: () => fetchTripData(tripId as string),
    staleTime: 5000,
  });

  const formattedStartDate = dayjs(tripData?.startDate).format('M/D');
  const formattedEndDate = dayjs(tripData?.endDate).format('M/D');

  const updateTripMutation = useMutation({
    mutationFn: fetchUpdateTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tripData', tripId as string] });
      console.log('Trip updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating trip:', error);
    },
  });

  const handleUpdateTrip = async (
    tripTitle: string,
    startDate: Date,
    endDate: Date,
    selectedCountries: SelectedOption[]
  ) => {
    const isTitleChanged = tripTitle !== tripData?.tripTitle;
    const isStartDateChanged = dayjs(startDate).format('YYYY-MM-DD') !== tripData?.startDate;
    const isEndDateChanged = dayjs(endDate).format('YYYY-MM-DD') !== tripData?.endDate;
    const isCountriesChanged = JSON.stringify(selectedCountries) !== JSON.stringify(tripData?.countries);

    if (isTitleChanged || isStartDateChanged || isEndDateChanged || isCountriesChanged) {
      const updateData: UpdateTripParams = {
        tripId,
        tripTitle,
        startDate,
        endDate,
        selectedCountries,
        originalTripData: tripData,
      };

      updateTripMutation.mutate(updateData);
    } else {
      console.log('No changes detected, no update required');
    }
  };

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

  const formattedOpeningHours =
    selectedPlace?.openTime?.map((time) => {
      const [day, hours] = time.split(': ');
      const mappedDay = daysMap[day as keyof typeof daysMap] || day;
      return { day: mappedDay, hours };
    }) || [];
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
      const placesBeforeDelete: Place[] = await getPlaceForDay(tripId, dayId);
      console.log('placesBeforeDelete', placesBeforeDelete);
      const placeIndex = placesBeforeDelete.findIndex((place: { id: string }) => place.id === placeId);
      console.log('placeIndex', placeIndex);
      const prevPlace = placeIndex > 0 ? placesBeforeDelete[placeIndex - 1] : null;
      const nextPlace = placeIndex < placesBeforeDelete.length ? placesBeforeDelete[placeIndex + 1] : null;
      console.log('nextPlace', nextPlace);
      await deletePlace(tripId, dayId, placeId);

      if (placeIndex === 0 && nextPlace) {
        await updatePlaceRoute(tripId, dayId, nextPlace.id, null, 'driving');
      } else if (prevPlace && nextPlace) {
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

  const handleBackProfile = () => {
    startTransition(() => {
      router.push('/profile');
    });
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (!tripData) {
    return <div></div>;
  }
  const { places, route } = processDays(tripData.days as any);

  return (
    <>
      {isPending && <LoadingAnimation />}
      <Container>
        <ListContainer>
          <ListHeader>
            <HomeIcon onClick={handleBackProfile} />
            <TripName>{tripData.tripTitle}</TripName>
            <TripDate>
              <CalendarIcon />
              {formattedStartDate}-{formattedEndDate}
            </TripDate>
            <EditIcon onClick={() => openModal('trip')} />
          </ListHeader>
          <List
            days={tripData.days as any}
            // activeDate={activeDate}
            onPlaceAdded={handleAddPlace}
            onDaysUpdate={handleDaysUpdate}
            onModeUpdate={handleModeChange}
            onPlaceDelete={handlePlaceDelete}
            tripId={tripId}
          />
        </ListContainer>
        <MapContainer>
          <MapComponent places={places as any} routes={route as any} />
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

              {formattedOpeningHours?.length > 0 && (
                <OpeningHoursWrapper>
                  <ClockIcon />
                  <OpeningHoursList>
                    {formattedOpeningHours.map((time, index) => (
                      <OpeningHourItem key={index}>
                        <DayCircle>{time.day}</DayCircle>
                        {/* <DayLabel>{time.day}</DayLabel> */}
                        <HoursLabel>{time.hours}</HoursLabel>
                      </OpeningHourItem>
                    ))}
                  </OpeningHoursList>
                </OpeningHoursWrapper>
              )}

              {selectedPlace.phone && (
                <Wrapper>
                  <PhoneIcon />
                  {selectedPlace.phone}
                </Wrapper>
              )}

              {selectedPlace.website && (
                <Wrapper>
                  <WebsiteIcon />
                  <a href={selectedPlace.website} target="_blank" rel="noopener noreferrer">
                    {selectedPlace.website}
                  </a>
                </Wrapper>
              )}
            </PlaceInfoModal>
          )}
        </MapContainer>
        {isModalOpen && (
          <TripModal onClose={closeModal} isEditing={true} initialData={tripData} onSubmit={handleUpdateTrip} />
        )}
      </Container>
    </>
  );
};

export default TripPage;

const Container = styled.div`
  display: flex;
  height: 100vh;
  /* overflow-y: auto; */
  overflow: hidden;
`;

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  position: fixed !important;
  top: 0;
  left: 0;
  border-bottom: 1px solid #e9ecef;
  height: 54px;
  width: 45%;
  background-color: white;
  padding: 5px 20px;
  z-index: 2;
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

const TripDate = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: #6c757d;
  margin-left: 8px;
  cursor: pointer;
`;

const CalendarIcon = styled(FaRegCalendarDays)`
  font-size: 15px;
  margin-right: 8px;
  color: #6c757d;
`;

const EditIcon = styled(RiEdit2Fill)`
  font-size: 22px;
  font-weight: 800;
  color: #6c757d;
  margin: 0px 20px 0px auto;
  cursor: pointer;
  &:hover {
    color: #495057;
  }
`;

const ListContainer = styled.div`
  width: 45%;
  overflow-y: auto;
  box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.1);
`;

const MapContainer = styled.div`
  width: 55%;
  height: 100vh;
  position: sticky;
  top: 0;
`;

const PlaceInfoModal = styled.div`
  background-color: #fff;
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 25px 30px;
  border-radius: 13px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-height: 300px;
  overflow-y: auto;
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
  display: flex;
  align-items: center;
`;

const Rating = styled.div`
  font-size: 14px;
  color: #ff9800;
  display: flex;
  align-items: center;
  font-weight: 700;
  margin: 10px 0px;
`;

const RatingIcon = styled(FaStar)`
  font-size: 14px;
  color: #ff9800;
  margin-right: 5px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  color: #333;
  margin-bottom: 8px;
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
  font-size: 14px;
`;

const OpeningHoursWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 15px 0px;
`;

const ClockIcon = styled(FaClock)`
  font-size: 14px;
  margin-right: 8px;
`;

const OpeningHoursList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const OpeningHourItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const DayCircle = styled.div`
  width: 20px;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 10px;
  font-size: 10px;
`;

const HoursLabel = styled.span`
  color: #888;
  font-size: 12px;
  font-weight: 500;
`;

const AddressIcon = styled(FaMapPin)`
  font-size: 14px;
  margin-right: 15px;
`;

const PhoneIcon = styled(FaPhoneAlt)`
  font-size: 14px;
  margin-right: 15px;
`;

const WebsiteIcon = styled(FaGlobe)`
  font-size: 14px;
  margin-right: 15px;
`;
