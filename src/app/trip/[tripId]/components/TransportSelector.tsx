import { useState } from 'react';
import { FaCar, FaWalking } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';
import { MdDirectionsBike } from 'react-icons/md';
import styled from 'styled-components';

import { getRoute } from '@/services/otherApi';

type TransportMode = 'driving' | 'walking' | 'cycling';

interface Route {
  type: string;
  coordinates: [number, number][];
  duration: string;
  distance: string;
  transportMode: TransportMode;
}

interface TransportModeSelectorProps {
  onModeUpdate: (dayId: string, placeId: string, newRoute: Route | null, newMode: TransportMode) => void;
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  dayId: string;
  placeId: string;
  route: Route | null;
}

interface TransportOption {
  mode: TransportMode;
  label: string;
  icon: JSX.Element;
}

const formatDuration = (duration: any) => {
  const hours = Math.floor(duration / 3600);
  const min = Math.floor((duration % 3600) / 60);
  if (hours > 0) {
    return `${hours}hr ${min}min`;
  } else {
    return `${min}min`;
  }
};

const TransportModeSelector: React.FC<TransportModeSelectorProps> = ({
  onModeUpdate,
  start,
  end,
  dayId,
  placeId,
  route,
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedMode, setSelectedMode] = useState<TransportMode>(route?.transportMode || 'driving');
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleModeChange = async (newMode: TransportMode) => {
    setSelectedMode(newMode);
    setShowDropdown(false);
    try {
      const routeFromGetRoute = await getRoute(start, end, newMode);
      const newRoute: Route | null = routeFromGetRoute ? { ...routeFromGetRoute, transportMode: newMode } : null;
      await onModeUpdate(dayId, placeId, newRoute, newMode);
    } catch (error) {
      console.error('Error updating mode:', error);
    }
  };

  const transportModes: TransportOption[] = [
    { mode: 'driving', label: '駕車', icon: <CarIcon /> },
    { mode: 'walking', label: '步行', icon: <WalkIcon /> },
    { mode: 'cycling', label: '騎行', icon: <BikeIcon /> },
  ];
  return (
    <RouteInfo>
      <RouteLine />
      <CurrentMode onClick={toggleDropdown}>
        {transportModes.find((tm) => tm.mode === selectedMode)?.icon}
        {formatDuration(route?.duration)}
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
