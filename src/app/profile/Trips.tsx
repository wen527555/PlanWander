'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { GoShare } from 'react-icons/go';
import { SlOptions } from 'react-icons/sl';
import styled from 'styled-components';

import TripModal from '@/components/TripModal';
import { createArticleFromTrip, createNewTrip, fetchDeleteTrip, fetchUserAllTrips } from '@/lib/firebaseApi';
import { useModalStore } from '@/lib/store';
import Carousel from '../../components/Carousel';

interface Trip {
  imageUrl: string | undefined;
  id: string;
  tripTitle: string;
  startDate: string;
  endDate: string;
}

interface SelectedOption {
  value: string;
  label: string;
}

const TripsContainer = () => {
  const { data: trips = [], isLoading: loadingTrips } = useQuery<any>({
    queryKey: ['userTrips'],
    queryFn: fetchUserAllTrips,
  });
  const today = dayjs();
  const [openMenuTripId, setOpenTripId] = useState<string | null>(null);
  const upcomingTrips = trips?.filter((trip) => dayjs(trip.startDate).isAfter(today));
  const pastTrips = trips?.filter((trip) => dayjs(trip.endDate).isBefore(today));
  const pastTripsByYear = pastTrips.reduce((acc, trip) => {
    const year = dayjs(trip.startDate).year();
    if (!acc[year]) acc[year] = [];
    acc[year].push(trip);
    return acc;
  }, {});
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const currentTrip = upcomingTrips[currentIndex];
  const daysUntilNextTrip = currentTrip ? dayjs(currentTrip.startDate).diff(today, 'day') : null;
  const { isModalOpen, openModal, closeModal, modalType } = useModalStore();
  console.log('currentTrip', currentTrip);
  const handleSlideChange = (newIndex) => {
    setCurrentIndex(newIndex);
  };

  const handlePublishClick = async (tripId: string) => {
    try {
      await createArticleFromTrip(tripId);
      router.push(`/articles/${tripId}`);
    } catch (error) {
      console.error('Error publishing article:', error);
    }
  };

  const handleTripOptionClick = (tripId: string) => {
    if (openMenuTripId === tripId) {
      setOpenTripId(null);
    } else {
      setOpenTripId(tripId);
    }
  };

  const handleCreateTrip = async (
    tripTitle: string,
    startDate: Date,
    endDate: Date,
    selectedCountries: SelectedOption[]
  ) => {
    const tripId = await createNewTrip(tripTitle, startDate, endDate, selectedCountries);
    console.log('Trip created successfully');
    router.push(`/trips/${tripId}`);
  };

  const handleTripClick = (tripId: string) => {
    router.push(`trips/${tripId}`);
  };
  const queryClient = useQueryClient();
  const deleteTripMutation = useMutation({
    mutationFn: fetchDeleteTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTrips'] });
      alert('delete trip successfully!');
    },
    onError: (error) => {
      console.error('Error deleting trip:', error);
    },
  });

  const handleDeleteTripClick = (tripId: string) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      deleteTripMutation.mutate(tripId);
    }
  };

  if (loadingTrips) {
    return <p>Loading</p>;
  }

  return (
    <>
      {isModalOpen && modalType === 'trip' && (
        <TripModal onClose={closeModal} isEditing={false} onSubmit={handleCreateTrip} />
      )}

      <TripContainer>
        {upcomingTrips?.length > 0 ? (
          <>
            <UpcomingTripsInfo>
              <TripsCount>{upcomingTrips.length} upcoming trips</TripsCount>
              {daysUntilNextTrip !== null && (
                <NextTripInfo>This adventure starts in {daysUntilNextTrip} days</NextTripInfo>
              )}
            </UpcomingTripsInfo>
            <CarouselWrapper>
              <Carousel<Trip>
                item={upcomingTrips}
                currentIndex={currentIndex}
                onChange={handleSlideChange}
                renderItem={(trip) => {
                  const formattedStartDate = dayjs(trip.startDate).format('DD MMM YYYY');
                  const formattedEndDate = dayjs(trip.endDate).format('DD MMM YYYY');
                  return (
                    <CardWrapper>
                      <CardHeader>
                        <IconWrapper>
                          <PublishWrapper onClick={() => handlePublishClick(trip.id)}>
                            <PublishIcon />
                            Publish
                          </PublishWrapper>
                          <OptionIcon onClick={() => handleTripOptionClick(trip.id)} />
                          {openMenuTripId === trip.id && (
                            <Menu>
                              <MenuItem>
                                <DeleteIcon onClick={() => handleDeleteTripClick(trip.id)} />
                                Delete
                              </MenuItem>
                            </Menu>
                          )}
                        </IconWrapper>
                      </CardHeader>
                      <CardContent onClick={() => handleTripClick(trip.id)}>
                        <TripImg src={trip.imageUrl} />
                        <CardDetails>
                          <TripName>{trip.tripTitle}</TripName>
                          <TripDate>
                            {formattedStartDate} - {formattedEndDate}
                          </TripDate>
                        </CardDetails>
                      </CardContent>
                    </CardWrapper>
                  );
                }}
              />
            </CarouselWrapper>
          </>
        ) : (
          <NoPlannedContainer>
            <NoPlannedTitle>Create your first trip</NoPlannedTitle>
            <NoPlannedTitleDescription>
              Planning is where the adventure starts. Plan a new trip and start yours! 🚀
            </NoPlannedTitleDescription>
            <ButtonWrapper>
              <Button onClick={() => openModal('trip')}>Create new trip</Button>
            </ButtonWrapper>
          </NoPlannedContainer>
        )}
        {Object.keys(pastTripsByYear).map((year) => (
          <YearSection key={year}>
            <YearSeparator>
              <YearTitle>
                {year} • {pastTripsByYear[year].length} trips
              </YearTitle>
            </YearSeparator>
            {pastTripsByYear[year].map((trip, index) => {
              const formattedStartDate = dayjs(trip.startDate).format('DD MMM YYYY');
              const formattedEndDate = dayjs(trip.endDate).format('DD MMM YYYY');

              return (
                <YearWrapper key={index}>
                  <CardWrapper>
                    <CardHeader>
                      <IconWrapper>
                        <OptionIcon onClick={() => handleTripOptionClick(trip.id)} />
                        {openMenuTripId === trip.id && (
                          <Menu>
                            <MenuItem>
                              <DeleteIcon onClick={() => handleDeleteTripClick(trip.id)} />
                              Delete
                            </MenuItem>
                          </Menu>
                        )}
                      </IconWrapper>
                    </CardHeader>
                    <CardContent onClick={() => handleTripClick(trip.id)}>
                      <TripImg src={trip.imageUrl} />
                      <CardDetails>
                        <TripName>{trip.tripTitle}</TripName>
                        <TripDate>
                          {formattedStartDate} - {formattedEndDate}
                        </TripDate>
                      </CardDetails>
                    </CardContent>
                  </CardWrapper>
                </YearWrapper>
              );
            })}
          </YearSection>
        ))}
      </TripContainer>
    </>
  );
};

export default TripsContainer;

const NoPlannedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const NoPlannedTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 10px;
`;

const NoPlannedTitleDescription = styled.p`
  font-size: 16px;
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 30px;
`;

const TripContainer = styled.div`
  margin: 0px 20px;
  position: relative;
`;

const UpcomingTripsInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 20px;
`;

const TripsCount = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #6c757d;
`;

const NextTripInfo = styled.div`
  background-color: #78b7cc;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 16px;
  margin-top: 10px;
`;

const Button = styled.button`
  background-color: #78b7cc;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 700;
  &:hover {
    background-color: #e0e7ea;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const TripImg = styled.img`
  background-color: #efefef;
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 10px;
`;

const CardWrapper = styled.div`
  width: 100%;
  cursor: pointer;
  border-radius: 15px;
  overflow: hidden;
  /* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); */
`;

const CardDetails = styled.div`
  padding: 10px 20px;
  color: #333;
`;

const CardHeader = styled.div`
  width: 100%;
  height: 50px;
  padding: 5px 20px;
  display: flex;
  justify-content: end;
`;

const CardContent = styled.div`
  width: 100%;
  padding: 0px 20px;
`;

const TripName = styled.h3`
  color: #0f3e4a;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const TripDate = styled.div`
  font-weight: 400;
  color: #658c96;
  font-size: 14px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const PublishWrapper = styled.div`
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 5px 10px;
  &:hover {
    background-color: #d5eff7;
  }
`;

const PublishIcon = styled(GoShare)`
  cursor: pointer;
  font-size: 18px;
  margin-right: 5px;
`;

// const DeleteWrapper = styled.div`
//   cursor: pointer;
//   width: 100%;
//   display: flex;
//   align-items: center;
// `;

const DeleteIcon = styled(AiOutlineDelete)`
  font-size: 18px;
  margin-right: 5px;
`;

const Menu = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const MenuItem = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const OptionIcon = styled(SlOptions)`
  cursor: pointer;
  font-size: 15px;
  margin-left: 10px;
  position: relative;
`;

const CarouselWrapper = styled.div`
  width: 800px;
  margin: 0px 25px;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -5px;
    height: 35%;
    width: 100px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
    pointer-events: none;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: -5px;
    height: 35%;
    width: 100px;
    background: linear-gradient(-90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
    pointer-events: none;
    z-index: 1;
  }
`;

const YearSection = styled.div`
  margin: 5px 0;
`;

const YearSeparator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  position: relative;
  width: 100%;

  &:after {
    content: '';
    height: 1px;
    width: 100%;
    position: absolute;
    top: 50%;
    left: 0;
    background: #dde9ed;
    z-index: 0;
  }
`;

const YearTitle = styled.div`
  background-color: #e9f5fb;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 18px;
  color: #2c3e50;
  display: inline-block;
  z-index: 1;
`;

const YearWrapper = styled.div`
  margin: 0px 25px;
  width: 94%;
  padding: 10px 5px;

  &:hover {
    opacity: 1;
    background: #ecf6f9;
    border-radius: 10px;
  }
`;
