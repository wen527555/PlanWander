import { FaMapMarker } from 'react-icons/fa';
import styled from 'styled-components';

//!要和processDay共用
const colors = [
  '#8e8ee0',
  '#00adb0',
  '#00c8ff',
  '#4b61cf',
  '#f1a731',
  '#ed7fcc',
  '#41e26c',
  '#83d685',
  '#dc9a61',
  '#dc618a',
];
const getRandomLightColor = () => {
  const letters = 'BCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
};

const getColorForDate = (dateIndex: number) => {
  if (dateIndex < 10) {
    return colors[dateIndex];
  } else {
    return getRandomLightColor();
  }
};

const Marker: React.FC<{ index: number; dateIndex: number }> = ({ index, dateIndex }) => {
  const color = getColorForDate(dateIndex);

  return (
    <MarkerContainer>
      <MarkerIcon color={color} />
      <MarkerNumber>{index + 1}</MarkerNumber>
    </MarkerContainer>
  );
};

export default Marker;

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
