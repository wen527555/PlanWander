'use client';

import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import styled from 'styled-components';

import LoadingAnimation from '@/components/Loading';
import { fetchArticleData } from '@/lib/firebaseApi';
import { processDays } from '../../../lib/processDays';
import EditList from './EditList';

const MapComponent = dynamic(() => import('./Map'), {
  ssr: false,
});

const ArticlesPage = () => {
  const { articleId } = useParams<{ articleId: string }>() ?? {};
  const [visiblePlace, setVisiblePlace] = useState<string | null>(null);
  const [manualScroll, setManualScroll] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const { data: articleData, isLoading } = useQuery({
    queryKey: ['articleData', articleId],
    queryFn: () => fetchArticleData(articleId as string),
    enabled: !!articleId,
  });
  const toggleMapListView = () => {
    setIsMapVisible((prev) => !prev);
  };

  const handlePlaceVisible = (placeId: string) => {
    if (!manualScroll) {
      setVisiblePlace(placeId);
    }
  };

  const handleMarkerClick = (placeId: string) => {
    setManualScroll(true);
    setVisiblePlace(placeId);
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (isLoading || !articleData) return;
  const { places, route } = processDays(articleData?.days as any);
  return (
    <>
      <ToggleButton onClick={toggleMapListView}>{isMapVisible ? 'List View' : 'Map View'}</ToggleButton>
      <Container>
        <ListContainer isMapVisible={isMapVisible}>
          <EditList articleData={articleData} articleId={articleId} onPlaceVisible={handlePlaceVisible} />
        </ListContainer>
        <MapContainer isMapVisible={isMapVisible}>
          <MapComponent
            places={places as any}
            routes={route as any}
            visiblePlace={visiblePlace}
            onMarkerClick={handleMarkerClick}
          />
        </MapContainer>
      </Container>
    </>
  );
};

export default ArticlesPage;

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

const Container = styled.div`
  display: flex;
`;

const ListContainer = styled.div<{ isMapVisible: boolean }>`
  width: 50%;
  height: 100vh;
  overflow-y: auto;
  padding: 0px 30px;

  @media (max-width: 768px) {
    width: 100%;
    display: ${(props) => (props.isMapVisible ? 'none' : 'block')};
  }
`;

const MapContainer = styled.div<{ isMapVisible: boolean }>`
  width: 50%;
  height: 100vh;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
    display: ${(props) => (props.isMapVisible ? 'block' : 'none')};
  }
`;
