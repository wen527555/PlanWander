import { FaMapMarker } from 'react-icons/fa';
import styled from 'styled-components';

const colors = [
  '#00c8ffe2',
  '#a5e7b7',
  '#b3b3eb',
  '#c3e5e6c6',
  '#eef3ac',
  '#D3D3D3',
  '#E0FFFF',
  '#FFE4E1',
  '#FFDAB9',
  '#FFF0F5',
];
const getRandomLightColor = () => {
  const letters = 'BCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
};

const getColorForDate = (dayId: string, dateIndex: number) => {
  if (dateIndex < 10) {
    return colors[dateIndex];
  } else {
    return getRandomLightColor();
  }
};

const Marker: React.FC<{ index: number; dayId: string; dateIndex: number }> = ({ index, dayId, dateIndex }) => {
  const color = getColorForDate(dayId, dateIndex);

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
  color: ${(props) => props.color};
`;

const MarkerNumber = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 18px;
  font-weight: bold;
`;
