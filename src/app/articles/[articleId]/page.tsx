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
  const { articleId } = useParams<{ articleId: string }>();
  const [visiblePlace, setVisiblePlace] = useState<string | null>(null);
  const [manualScroll, setManualScroll] = useState(false);
  const { data: articleData, isLoading } = useQuery({
    queryKey: ['articleData', articleId],
    queryFn: () => fetchArticleData(articleId as string),
    enabled: !!articleId,
  });
  // const handleBackProfile = () => {
  //   router.push('/profile');
  // };

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
    <Container>
      <ListContainer>
        {/* <ListHeader>
          <HomeIcon onClick={handleBackProfile} />
        </ListHeader> */}
        <EditList articleData={articleData} articleId={articleId} onPlaceVisible={handlePlaceVisible} />
      </ListContainer>
      <MapContainer>
        <MapComponent
          places={places as any}
          routes={route as any}
          visiblePlace={visiblePlace}
          onMarkerClick={handleMarkerClick}
        />
      </MapContainer>
    </Container>
  );
};

export default ArticlesPage;

const Container = styled.div`
  display: flex;
`;

const ListContainer = styled.div`
  width: 50%;
  height: 100vh;
  overflow-y: auto;
  padding: 0px 30px;
`;

const MapContainer = styled.div`
  width: 50%;
  height: 100vh;
  position: relative;
`;
