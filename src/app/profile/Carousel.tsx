import styled from 'styled-components';

interface CarouselProp<T> {
  item: T[];
  renderItem: (item: T) => React.ReactNode;
}

const Carousel = <T,>({ item, renderItem }: CarouselProp<T>): React.ReactElement => {
  console.log('item', item);
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
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding: 20px;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CarouselItem = styled.div`
  /* min-width: 500px; */
  scroll-snap-align: start;
  border-radius: 10px;
  position: relative;
  /* overflow: hidden; */
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0, 0.1);
`;
