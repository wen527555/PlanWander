'use client';

import { useState } from 'react';
import styled from 'styled-components';

import { ListHeader } from './Header';

interface MapToggleProps {
  listContent: React.ReactNode;
  mapContent: React.ReactNode;
  headerContent?: React.ReactNode;
}

const ListMapLayout: React.FC<MapToggleProps> = ({ listContent, mapContent, headerContent }) => {
  const [isMapVisible, setIsMapVisible] = useState(false);
  const toggleMapListView = () => {
    setIsMapVisible((prev) => !prev);
  };

  return (
    <Container>
      <ToggleButton onClick={toggleMapListView}>{isMapVisible ? 'List View' : 'Map View'}</ToggleButton>
      <ListContainer isMapVisible={isMapVisible}>
        <ListHeader>{headerContent}</ListHeader>
        {listContent}
      </ListContainer>
      <MapContainer isMapVisible={isMapVisible}>{mapContent}</MapContainer>
    </Container>
  );
};

export default ListMapLayout;

const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ListContainer = styled.div<{ isMapVisible: boolean }>`
  width: 50%;
  overflow-y: auto;
  box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 100%;
    display: ${(props) => (props.isMapVisible ? 'none' : 'block')};
  }
`;

const MapContainer = styled.div<{ isMapVisible: boolean }>`
  width: 50%;
  height: 100vh;
  position: sticky;
  top: 0;

  @media (max-width: 768px) {
    width: 100%;
    display: ${(props) => (props.isMapVisible ? 'block' : 'none')};
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  bottom: 20px;
  padding: 10px 20px;
  background-color: #212529;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  z-index: 3;
  font-weight: 600;
  font-size: 14px;

  left: 50%;
  transform: translateX(-50%);
  @media (min-width: 769px) {
    display: none;
  }
`;
