'use client';

import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { FaGripVertical, FaMapMarker } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import { VscTrash } from 'react-icons/vsc';
import styled from 'styled-components';

// import GoogleApiProvider from '@/lib/GoogleApiProvider';

import 'flatpickr/dist/flatpickr.min.css';

import { getColorForDate } from '@/lib/colors';
import { updateDepartureTime, updatePlaceStayTime } from '@/lib/firebaseApi';
import { usePlaceStore } from '@/lib/store';
import LocationSearch from './LocationSearch';
import TimePicker from './TimePicker';
import TransportModeSelector from './TransportSelector';

interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  route?: any;
  startTime?: string;
  endTime?: string;
  stayDuration?: number;
}

interface Day {
  date: string;
  departureTime: Date;
  places: Place[];
}

interface ListProps {
  tripId: string;
  days: Day[];
  onPlaceAdded: (place: Place, dayId: string) => void;
  onDaysUpdate: (updates: any[]) => void;
  onModeUpdate: (dayId: string, placeId: string, newRoute: any, newMode: any) => void;
  onPlaceDelete: (dayId: string, placeId: string) => void;
}

interface PlaceContainerProps {
  isActive: boolean;
}

interface UpdateDepartureTimeParams {
  tripId: string;
  dayId: string;
  newDate: string;
}

const List: React.FC<ListProps> = ({ tripId, days, onPlaceAdded, onDaysUpdate, onModeUpdate, onPlaceDelete }) => {
  const [openTimePick, setOpenTimePick] = useState<string | null>(null);
  const [openDays, setOpenDays] = useState<{ [key: string]: boolean }>(
    days.reduce((acc, day) => ({ ...acc, [day.date]: true }), {})
  );
  const { selectedPlace, setSelectedPlace } = usePlaceStore();

  const handleToggleOpen = (date: string) => {
    setOpenDays((prev) => ({ ...prev, [date]: !prev[date] }));
  };
  const queryClient = useQueryClient();
  const onDragEnd = async (result: any) => {
    const { source, destination } = result;
    if (!destination) return;
    const sourceDayId = source.droppableId;
    const destinationDayId = destination.droppableId;
    const sourceDayIndex = days.findIndex((day) => day.date === sourceDayId);
    const destinationDayIndex = days.findIndex((day) => day.date == destinationDayId);
    if (sourceDayIndex === -1 || destinationDayIndex === -1) {
      console.error('找不到對應的 day');
      return;
    }
    const newDays = [...days];
    const sourceDay = { ...newDays[sourceDayIndex], places: newDays[sourceDayIndex].places || [] };
    if (sourceDayId === destinationDayId) {
      const [movePlace] = sourceDay.places.splice(source.index, 1);
      sourceDay.places.splice(destination.index, 0, movePlace);
      newDays[sourceDayIndex] = sourceDay;
      onDaysUpdate([{ dayId: sourceDayId, places: sourceDay.places }]);
    } else {
      const destinationDay = { ...newDays[destinationDayIndex], places: newDays[destinationDayIndex].places || [] };
      const [movedPlace] = sourceDay.places.splice(source.index, 1);
      destinationDay.places.splice(destination.index, 0, movedPlace);
      newDays[sourceDayIndex] = sourceDay;
      newDays[destinationDayIndex] = destinationDay;
      onDaysUpdate([
        { dayId: sourceDayId, places: sourceDay.places },
        { dayId: destinationDayId, places: destinationDay.places },
      ]);
    }
  };

  const updateStayDurationMutation = useMutation({
    mutationFn: async ({
      tripId,
      dayId,
      placeId,
      stayDuration,
    }: {
      tripId: string;
      dayId: string;
      placeId: string;
      stayDuration: number;
    }) => {
      await updatePlaceStayTime(tripId, dayId, placeId, stayDuration);
    },
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: ['tripData', tripId] });
      setOpenTimePick(null);
    },
    onError: (error: Error) => {
      console.error('Error updating stay time:', error.message);
    },
  });

  const handleSaveTimePicker = (placeId: string, dayId: string, stayDuration: number) => {
    updateStayDurationMutation.mutate({ tripId, dayId, placeId, stayDuration });
  };

  const handleCloseTimePicker = (): void => {
    setOpenTimePick(null);
  };

  const handleTimeCardClick = (placeId: string): void => {
    setOpenTimePick(placeId);
  };

  const handlePlaceClick = (place: any) => {
    setSelectedPlace(place);
  };

  const updateDepartureTimeMutation = useMutation({
    mutationFn: async ({ tripId, dayId, newDate }: UpdateDepartureTimeParams) => {
      await updateDepartureTime(tripId, dayId, newDate);
    },
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: ['tripData', tripId] });
    },
    onError: (error: Error) => {
      console.error(error.message);
    },
  });

  const handleUpdateDepartureTime = (dayId: string, selectedTime: Date) => {
    const formattedTime = dayjs(selectedTime).toISOString();
    updateDepartureTimeMutation.mutate({ tripId, dayId, newDate: formattedTime });
  };

  return (
    // <GoogleApiProvider>
    // <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY!} libraries={libraries}>
    <ListContainer>
      <DragDropContext onDragEnd={onDragEnd}>
        {days.map((day, dateIndex) => {
          let lastPlaceEndTime: dayjs.Dayjs | null = null;
          return (
            <Droppable droppableId={`${day.date}`} key={`${day.date}-${dateIndex}`}>
              {(provided) => (
                <ItemContainer ref={provided.innerRef} {...provided.droppableProps}>
                  <ItemHeader onClick={() => handleToggleOpen(day.date)}>
                    {openDays[day.date] ? <IoIosArrowDown /> : <IoIosArrowForward />}
                    <ItemDate>
                      {new Date(day.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </ItemDate>
                  </ItemHeader>
                  {openDays[day.date] && (
                    <>
                      <ItemContent>
                        <DepartureWrapper>
                          <DepartureTitle>Departure Time:</DepartureTitle>
                          <DepartureTime>
                            <Flatpickr
                              id="departure-time-picker"
                              value={
                                day.departureTime && !isNaN(new Date(day.departureTime).getTime())
                                  ? dayjs(day.departureTime).toDate()
                                  : dayjs().hour(8).minute(0).toDate()
                              }
                              options={{
                                enableTime: true,
                                noCalendar: true,
                                dateFormat: 'H:i',
                                time_24hr: true,
                                allowInput: true,
                              }}
                              onChange={([selectedTime]: Date[]) => handleUpdateDepartureTime(day.date, selectedTime)}
                            />
                          </DepartureTime>
                        </DepartureWrapper>
                        {day.places?.map((place, index) => {
                          let currentPlaceStartTime: dayjs.Dayjs | null = null;
                          let currentPlaceEndTime: dayjs.Dayjs | null = null;
                          const stayDuration = place.stayDuration || 3600;
                          if (index === 0) {
                            currentPlaceStartTime = day.departureTime
                              ? dayjs(day.departureTime)
                              : dayjs().hour(8).minute(0);
                          } else {
                            const travelDuration = day.places[index]?.route?.duration || 0;
                            currentPlaceStartTime = lastPlaceEndTime
                              ? lastPlaceEndTime.add(travelDuration, 'second')
                              : dayjs();
                          }
                          currentPlaceEndTime = currentPlaceStartTime.add(stayDuration, 'second');
                          lastPlaceEndTime = currentPlaceEndTime;
                          return (
                            <Draggable key={`${place.id}-${index}`} draggableId={`${place.id}-${index}`} index={index}>
                              {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                  {index > 0 && day.places[index]?.route && (
                                    <RouteInfo>
                                      <TransportModeSelector
                                        onModeUpdate={onModeUpdate}
                                        start={{ lat: day.places[index - 1].lat, lng: day.places[index - 1].lng }}
                                        end={{ lat: place.lat, lng: place.lng }}
                                        dayId={day.date}
                                        placeId={place.id}
                                        route={day.places[index].route}
                                      />
                                    </RouteInfo>
                                  )}
                                  <PlaceContainer onClick={() => handlePlaceClick(place)}>
                                    <MarkerContainer>
                                      <MarkerIcon color={getColorForDate(dateIndex)} />
                                      <MarkerNumber>{index + 1}</MarkerNumber>
                                    </MarkerContainer>
                                    <BlockWrapper isActive={selectedPlace?.id === place.id}>
                                      <PlaceBlock>
                                        <PlaceName>{place.name}</PlaceName>
                                      </PlaceBlock>
                                      <PlaceBlock>
                                        <TimeDisplayCard
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleTimeCardClick(place.id);
                                          }}
                                        >
                                          <TimeLabel>
                                            {`${currentPlaceStartTime.format('HH:mm')} - ${currentPlaceEndTime.format('HH:mm')}`}
                                          </TimeLabel>
                                        </TimeDisplayCard>
                                        {openTimePick === place.id && (
                                          <TimePicker
                                            place={place}
                                            dayId={day.date}
                                            initialStayDuration={place.stayDuration || 3600}
                                            onSave={handleSaveTimePicker}
                                            onClose={handleCloseTimePicker}
                                          />
                                        )}
                                      </PlaceBlock>
                                    </BlockWrapper>
                                    <DragIcon />
                                    <DeleteIcon
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onPlaceDelete(day.date, place.id);
                                      }}
                                    />
                                  </PlaceContainer>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </ItemContent>
                      <LocationSearch onPlaceAdded={onPlaceAdded} dayId={day.date} />
                    </>
                  )}
                </ItemContainer>
              )}
            </Droppable>
          );
        })}
      </DragDropContext>
    </ListContainer>
    // </LoadScript>
  );
};

export default List;

const ListContainer = styled.div`
  margin: 60px 30px 150px 45px;
`;

const ItemContainer = styled.div`
  padding: 10px 0px 20px 0px;
  border-bottom: 1px dashed #dddcdc;
  overflow: visible;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 10px 20px 15px 0px;
  gap: 10px;
`;

const ItemDate = styled.h3`
  color: #212529;
  font-weight: 700;
  font-size: 20px;
  margin: 0;
`;

const ItemContent = styled.div`
  width: 90%;
`;

const DepartureWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0px 0px 10px 30px;
`;
const DepartureTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #888;
`;
const DepartureTime = styled.div`
  .flatpickr-input {
    width: 50px;
    padding: 0px 5px;
    border: none;
    color: #888;
    border-bottom: 1px solid #888;
    outline: none;
    font-size: 14px;
    margin-left: 8px;
  }

  .flatpickr-input:focus {
    border-bottom-color: #333;
  }
`;

const DragIcon = styled(FaGripVertical)`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  cursor: grab;
  font-size: 16px;
  color: #6c757d;
`;

const DeleteIcon = styled(VscTrash)`
  position: absolute;
  right: -35px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  cursor: pointer;
  font-size: 20px;
  font-weight: 600;
  color: #6c757d;
  &:hover {
    color: #c0c0c0;
  }
`;

const PlaceContainer = styled.div`
  width: 100%;
  display: flex;
  margin: 5px 30px 0px 20px;
  position: relative;
  overflow: visible;
  &:hover ${DeleteIcon}, &:hover ${DragIcon} {
    opacity: 1;
  }
`;

const BlockWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isActive',
})<PlaceContainerProps>`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  height: auto;
  cursor: pointer;
  padding-left: 25px;

  background-color: ${(props) => (props.isActive ? '#ebedee' : '#f3f4f5')};
`;

const PlaceBlock = styled.div`
  width: 100%;
`;

const PlaceName = styled.h1`
  font-size: 16px;
`;

const RouteInfo = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const TimeDisplayCard = styled.div`
  border-radius: 10px;
  width: 100px;
  margin-top: 5px;
  cursor: pointer;
  background-color: #e7e7ef;
  color: #3f51b5;
  text-align: center;
`;

const TimeLabel = styled.div`
  border-radius: 10px;
  padding: 5px;
  font-weight: bold;
  font-size: 12px;
`;

const MarkerContainer = styled.div`
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-block;
  width: 24px;
  height: 36px;
`;

const MarkerIcon = styled(FaMapMarker)`
  width: 100%;
  height: 100%;
  color: ${(props) => props.color};
`;

const MarkerNumber = styled.div`
  position: absolute;
  top: 40%;
  left: 47%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 15px;
  font-weight: bold;
`;
