'use client';

import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { FaCar } from 'react-icons/fa';
// import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import styled from 'styled-components';

import LocationSearch from './LocationSearch';
import Marker from './Marker';

// interface ItemContentProps {
//   isOpen: boolean;
// }

interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  route?: {
    duration: string;
  };
}

interface Day {
  date: string;
  places: Place[];
}

interface ListProps {
  days: Day[];
  onPlaceSelected: (place: Place, dayId: string) => void;
  onDaysUpdate: (updates: { dayId: string; places: any }[]) => void;
}

const List: React.FC<ListProps> = ({ days, onPlaceSelected, onDaysUpdate }) => {
  // const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
  // const [days,setDays]=useState([]);
  // const handleToggleOpen = (day: string) => {
  //   setOpenItems((prev) => ({
  //     ...prev,
  //     [day]: !prev[day],
  //   }));
  // };

  const onDragEnd = async (result: any) => {
    const { source, destination } = result;
    if (!destination) return;
    const sourceDayId = source.droppableId;
    const destinationDayId = destination.droppableId;
    const soureDayIndex = days.findIndex((day) => day.date === sourceDayId);
    const destinationDayIndex = days.findIndex((day) => day.date == destinationDayId);
    // const dayDate = source.droppableId;
    // const dayIndex = days.findIndex((day) => day.date === dayDate);
    if (soureDayIndex === -1 || destinationDayIndex === -1) {
      console.error('找不到對應的 day');
      return;
    }
    const newDays = [...days];
    // const currentDay = { ...newDays[dayIndex] };
    // const [movedPlace] = currentDay.places.splice(source.index, 1);
    // currentDay.places.splice(destination.index, 0, movedPlace);
    // newDays[dayIndex] = currentDay;
    // onDaysUpdate(currentDay.date, currentDay.places);
    const sourceDay = { ...newDays[soureDayIndex] };
    if (sourceDayId === destinationDayId) {
      const [movePlace] = sourceDay.places.splice(source.index, 1);
      sourceDay.places.splice(destination.index, 0, movePlace);
      newDays[soureDayIndex] = sourceDay;
      onDaysUpdate([{ dayId: sourceDayId, places: sourceDay.places }]);
    } else {
      const destinationDay = { ...newDays[destinationDayIndex] };
      const [movedPlace] = sourceDay.places.splice(source.index, 1);

      destinationDay.places.splice(destination.index, 0, movedPlace);
      newDays[soureDayIndex] = sourceDay;
      newDays[destinationDayIndex] = destinationDay;
      onDaysUpdate([
        { dayId: sourceDayId, places: sourceDay.places },
        { dayId: destinationDayId, places: destinationDay.places },
      ]);
    }
  };

  console.log('days', days);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {days.map((day, dateIndex) => (
        <Droppable droppableId={`${day.date}`} key={`${day.date}-${dateIndex}`}>
          {(provided) => (
            <ItemContainer ref={provided.innerRef} {...provided.droppableProps}>
              <ItemHeader>
                {/* <ToggleIcon>{isOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}</ToggleIcon> */}
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
                            <RouteLine />
                            <CarIcon />
                            <RouteDetail>{day.places[index].route.duration}</RouteDetail>
                          </RouteInfo>
                        )}
                        <PlaceContainer>
                          <Marker index={index} dateIndex={dateIndex} />
                          <PlaceBlock>{place.name}</PlaceBlock>
                        </PlaceContainer>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ItemContent>
              <LocationSearch onPlaceSelected={onPlaceSelected} dayId={day.date} />
            </ItemContainer>
          )}
        </Droppable>
      ))}
    </DragDropContext>
  );
};

export default List;

const ItemContainer = styled.div`
  margin: 10px 20px;
  /* border-bottom: 1px solid #ccc; */
  padding-bottom: 10px;
`;

const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  /* padding: 10px 0px; */
  margin: 10px 20px 15px 20px;
`;

const ItemDate = styled.h3`
  color: #212529;
  font-weight: 700;
  font-size: 20px;
`;

// const ToggleIcon = styled.span`
//   font-size: 16px;
//   margin-right: 10px;
// `;

// const ItemContent = styled.div<ItemContentProps>`
const ItemContent = styled.div`
  width: 90%;
`;

const PlaceContainer = styled.div`
  width: 100%;
  display: flex;
  margin: 5px 30px 0px 20px;
`;

const PlaceBlock = styled.div`
  width: 100%;
  padding: 10px;
  background-color: #f3f4f5;
  border: none;
  border-radius: 5px;
  height: 40px;
  font-size: 16px;
  cursor: pointer;
`;

const RouteInfo = styled.div`
  width: 100%;
  display: flex;
  margin: 10px 60px;
  align-items: center;
`;

const RouteLine = styled.div`
  border-left: 2px dashed #ccc;
  height: 30px;
`;

const CarIcon = styled(FaCar)`
  color: #888;
  margin: 0px 10px;
`;

const RouteDetail = styled.div`
  font-size: 12px;
  color: #888;
`;
