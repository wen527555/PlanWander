'use client';

// import { useMutation } from '@tanstack/react-query';
import { Libraries, LoadScript } from '@react-google-maps/api';
import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { FaMapMarker } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import styled from 'styled-components';

import { getColorForDate } from '@/lib/colors';
import { updatePlaceStayTime } from '../../../lib/firebaseApi';
// import usePlaceStore from '@/lib/store';
import LocationSearch from './LocationSearch';
import TimePicker from './TimePicker';
import TransportModeSelector from './TransportSelector';

const libraries: Libraries = ['places'];
interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  route?: any;
  startTime?: string;
  endTime?: string;
}

interface Day {
  date: string;
  places: Place[];
}

interface ListProps {
  tripId: string;
  days: Day[];
  onPlaceAdded: (place: Place, dayId: string) => void;
  onDaysUpdate: (updates: any[]) => void;
  onModeUpdate: (dayId: string, placeId: string, newRoute: any, newMode: any) => void;
  onPlaceDelete: (dayId: string, placeId: string) => void;
  onPlaceClick: (place: Place) => void;
}

interface SelectedTime {
  [key: string]: {
    startTime: string;
    endTime: string;
  };
}

const List: React.FC<ListProps> = ({
  tripId,
  days,
  onPlaceAdded,
  onDaysUpdate,
  onModeUpdate,
  onPlaceDelete,
  onPlaceClick,
}) => {
  const [selectedTime, setSelectedTime] = useState<SelectedTime>({});
  const [activePlaceId, setActivePlaceId] = useState<string | null>(null);
  // const [placeDescr]
  // const [expandedPlaceId, setExpanderPlace] = useState(null);
  //state應該要統一處理
  // useEffect(() => {
  //   const initializeSelectedTime = () => {
  //     const initialSelectedTime: SelectedTime = {};

  //     days.forEach((day) => {
  //       day.places?.forEach((place) => {
  //         if (place.startTime && place.endTime) {
  //           initialSelectedTime[place.id] = {
  //             startTime: place.startTime,
  //             endTime: place.endTime,
  //           };
  //         }
  //       });
  //     });
  //     console.log('initialSelectedTime', initialSelectedTime);
  //     setSelectedTime(initialSelectedTime);
  //   };

  //   if (days.length > 0) {
  //     initializeSelectedTime();
  //   }
  // }, [days]);

  // const handlePlaceClick = (palceId) => {
  //   if (expandedPlaceId === placeId) {
  //     setExpanderPlace(null);
  //   }else{
  //     setExpanderPlace(placeId)
  //   }
  // };

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

  // const updateMutation = useMutation({
  //   mutationFn: (updatedTime: { placeId: string; dayId: string; startTime: string; endTime: string }) => {
  //     const { placeId, dayId, startTime, endTime } = updatedTime;
  //     return updatePlaceStayTime(tripId, dayId, placeId, startTime, endTime);
  //   },
  //   onMutate: async (updatedTime) => {
  //     setSelectedTime((prev) => ({
  //       ...prev,
  //       [updatedTime.placeId]: {
  //         startTime: updatedTime.startTime,
  //         endTime: updatedTime.endTime,
  //       },
  //     }));
  //   },
  //   onError: (error) => {
  //     console.error('Error updating stay time:', error);
  //   },
  //   onSuccess: () => {
  //     console.log('Updated stay time successfully');
  //     setActivePlaceId(null);
  //   },
  // });

  const handleSaveTimePicker = async (
    placeId: string,
    dayId: string,
    startTime: string,
    endTime: string
  ): Promise<void> => {
    setSelectedTime((prev) => ({
      ...prev,
      [placeId]: { startTime, endTime },
    }));
    setActivePlaceId(null);

    try {
      await updatePlaceStayTime(tripId, dayId, placeId, startTime, endTime);
    } catch (error) {
      console.error('Error updating stay time:', error);
    }
  };

  const handleCloseTimePicker = (): void => {
    setActivePlaceId(null);
  };

  const handleTimeCardClick = (placeId: string): void => {
    setActivePlaceId(placeId);
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY!} libraries={libraries}>
      <DragDropContext onDragEnd={onDragEnd}>
        {days.map((day, dateIndex) => (
          <Droppable droppableId={`${day.date}`} key={`${day.date}-${dateIndex}`}>
            {(provided) => (
              <ItemContainer ref={provided.innerRef} {...provided.droppableProps}>
                <ItemHeader>
                  <ItemDate>
                    {new Date(day.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </ItemDate>
                </ItemHeader>
                <ItemContent>
                  {day.places?.map((place, index) => (
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
                          <PlaceContainer>
                            <MarkerContainer>
                              <MarkerIcon color={getColorForDate(dateIndex)} />
                              <MarkerNumber>{index + 1}</MarkerNumber>
                            </MarkerContainer>
                            <BlockWrapper>
                              <PlaceBlock onClick={() => onPlaceClick(place)}>
                                <PlaceName>{place.name}</PlaceName>
                              </PlaceBlock>
                              <PlaceBlock>
                                {selectedTime[place.id] ? (
                                  <TimeDisplayCard onClick={() => handleTimeCardClick(place.id)}>
                                    <TimeLabel>{`${selectedTime[place.id].startTime} - ${selectedTime[place.id].endTime}`}</TimeLabel>
                                  </TimeDisplayCard>
                                ) : (
                                  <TimeDisplayCard onClick={() => handleTimeCardClick(place.id)}>
                                    <TimeLabel>Add Time</TimeLabel>
                                  </TimeDisplayCard>
                                )}
                                {activePlaceId === place.id && (
                                  <TimePicker
                                    place={place}
                                    dayId={day.date}
                                    onSave={handleSaveTimePicker}
                                    onClear={handleCloseTimePicker}
                                  />
                                )}
                              </PlaceBlock>
                            </BlockWrapper>
                            <DeleteIcon onClick={() => onPlaceDelete(day.date, place.id)} />
                          </PlaceContainer>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ItemContent>
                <LocationSearch onPlaceAdded={onPlaceAdded} dayId={day.date} />
              </ItemContainer>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </LoadScript>
  );
};

export default List;

const ItemContainer = styled.div`
  margin: 64px 20px 10px 80px;
  /* border-bottom: 1px solid #ccc; */
  padding-bottom: 10px;
`;

const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  /* padding: 10px 0px; */
  margin: 10px 20px 15px 20px;
  gap: 10px;
`;

const ItemDate = styled.h3`
  color: #212529;
  font-weight: 700;
  font-size: 20px;
`;

const ItemContent = styled.div`
  width: 90%;
`;

const PlaceContainer = styled.div`
  width: 100%;
  display: flex;
  margin: 5px 30px 0px 20px;
  position: relative;
  /* &:hover .DeleteIcon {
    opacity: 1;
  } */
`;

const DeleteIcon = styled(RiDeleteBinLine)`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
  cursor: pointer;
  font-size: 18px;
  color: #888;
  width: 15px;
  height: 15px;
  &:hover {
    color: #c0c0c0;
  }
`;

const BlockWrapper = styled.div`
  width: 100%;
  padding: 10px;
  background-color: #f3f4f5;
  border-radius: 5px;
  height: auto;
  cursor: pointer;
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
  position: relative;
  display: inline-block;
  width: 24px;
  height: 36px;
`;

const MarkerIcon = styled(FaMapMarker)`
  width: 100%;
  height: 100%;
  /* border: 1px solid #ffff; */
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
