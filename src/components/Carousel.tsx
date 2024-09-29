import styled from 'styled-components';

interface CarouselProp<T> {
  item: T[];
  renderItem: (item: T) => React.ReactNode;
}

const Carousel = <T,>({ item, renderItem }: CarouselProp<T>): React.ReactElement => {
  return (
    <CarouselContainer>
      {item.map((item, index) => (
        <CarouselItem key={index}>{renderItem(item)}</CarouselItem>
      ))}
    </CarouselContainer>
  );
};

export default Carousel;
const CarouselContainer = styled.div`
  position: relative;
  display: flex;
  overflow-x: auto;
  gap: 16px;
  /* padding: 20px 30px; */
  max-width: 800px;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CarouselItem = styled.div`
  scroll-snap-align: start;
  border-radius: 10px;
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  background-color: white;
  width: 98%;
  padding: 10px 20px;

  &:hover {
    opacity: 1;
    background: #ecf6f9;
    border-radius: 8px;
  }
`;
