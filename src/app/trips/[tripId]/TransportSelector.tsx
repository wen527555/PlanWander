// import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FaCar, FaWalking } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';
import { MdDirectionsBike } from 'react-icons/md';
import styled from 'styled-components';

import { getRoute } from '@/lib/mapApi';

interface Route {
  type: string;
  coordinates: [number, number][];
  duration: string;
  transportMode: string;
}

interface TransportModeSelectorProps {
  onModeUpdate: (dayId: string, placeId: string, newMode: string) => void;
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  dayId: string;
  placeId: string;
  route: Route | null;
}

const TransportModeSelector: React.FC<TransportModeSelectorProps> = ({
  onModeUpdate,
  start,
  end,
  dayId,
  placeId,
  route,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMode, setSelectedMode] = useState(route?.transportMode || 'driving');
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleModeChange = async (newMode) => {
    setSelectedMode(newMode);
    setShowDropdown(false);
    const route = await getRoute(start, end, newMode);
    await onModeUpdate(dayId, placeId, route, newMode);
  };

  const transportModes = [
    { mode: 'driving', label: '駕車', icon: <CarIcon /> },
    { mode: 'walking', label: '步行', icon: <WalkIcon /> },
    { mode: 'cycling', label: '騎行', icon: <BikeIcon /> },
  ];
  return (
    <RouteInfo>
      <RouteLine />
      <CurrentMode onClick={toggleDropdown}>
        {transportModes.find((tm) => tm.mode === selectedMode)?.icon}
        {route?.duration}
        <DropdownIcon />
      </CurrentMode>
      {showDropdown && (
        <Dropdown>
          {transportModes
            .filter((currentMode) => currentMode.mode !== selectedMode)
            .map((currentMode) => (
              <DropdownItem key={currentMode.mode} onClick={() => handleModeChange(currentMode.mode)}>
                {currentMode.icon}
              </DropdownItem>
            ))}
        </Dropdown>
      )}
    </RouteInfo>
  );
};

export default TransportModeSelector;

const RouteInfo = styled.div`
  width: 100%;
  display: flex;
  margin: 10px 60px;
  align-items: center;
  position: relative;
`;

const RouteLine = styled.div`
  border-left: 2px dashed #ccc;
  height: 30px;
`;

const CarIcon = styled(FaCar)`
  color: #888;
  margin: 0px 10px;
  width: 20px;
  height: 20px;
`;
const WalkIcon = styled(FaWalking)`
  color: #888;
  margin: 0px 10px;
  width: 20px;
  height: 20px;
`;
const BikeIcon = styled(MdDirectionsBike)`
  color: #888;
  margin: 0px 10px;
  width: 20px;
  height: 20px;
`;

const DropdownIcon = styled(IoMdArrowDropdown)`
  color: #888;
  width: 20px;
  height: 20px;
  margin: 0px 10px;
`;

const CurrentMode = styled.button`
  font-size: 12px;
  color: #888;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 25px;
  left: 0;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  margin-top: 10px;
  z-index: 10;
  width: 70px;
  border-radius: 8px;
  text-align: center;
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
  svg {
    margin-right: 8px;
  }
`;
