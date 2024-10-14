// import { useState } from 'react';
import { useRef, useState } from 'react';
import styled from 'styled-components';

interface CarouselProp<T> {
  item: T[];
  renderItem: (item: T) => React.ReactNode;
  currentIndex: number;
  onChange: (index: number) => void;
}

const Carousel = <T,>({ item, renderItem, currentIndex, onChange }: CarouselProp<T>): React.ReactElement => {
  const [startX, setStartX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    console.log('Touch Start at', e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;

    if (diffX > 30 && currentIndex < item.length - 1) {
      onChange(currentIndex + 1);
    } else if (diffX < -30 && currentIndex > 0) {
      onChange(currentIndex - 1);
    }
  };

  return (
    <>
      <CarouselContainer ref={carouselRef} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {item.map((item, index) => (
          <CarouselItem key={index}>{renderItem(item)}</CarouselItem>
        ))}
      </CarouselContainer>
    </>
  );
};

export default Carousel;
const CarouselContainer = styled.div`
  position: relative;
  display: flex;
  overflow-x: auto;
  /* gap: 16px; */
  /* padding: 20px 30px; */
  max-width: 1000px;
  scroll-behavior: smooth;
  /* scroll-snap-type: x mandatory; */

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CarouselItem = styled.div`
  /* scroll-snap-align: start; */
  border-radius: 10px;
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  background-color: white;
  width: 94%;
  padding: 10px 5px;

  &:hover {
    opacity: 1;
    background: #ecf6f9;
    border-radius: 10px;
  }
`;
