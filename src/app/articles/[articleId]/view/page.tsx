'use client';

import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import styled from 'styled-components';

import { fetchArticleData } from '@/lib/firebaseApi';
import { processDays } from '@/lib/processDays';
import ViewList from '../ViewList';

const MapComponent = dynamic(() => import('../Map'), {
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
  const router = useRouter();
  const handleBackHome = () => {
    router.push('/');
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

  if (isLoading || !articleData) return <p></p>;
  const { places, route } = processDays(articleData?.days as any);
  return (
    <Container>
      <ListContainer>
        <ListHeader>
          <HomeIcon onClick={handleBackHome} />
        </ListHeader>
        <ViewList
          articleData={articleData}
          articleId={articleId}
          onPlaceVisible={handlePlaceVisible}
          visiblePlace={visiblePlace}
          setManualScroll={setManualScroll}
        />
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

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed !important;
  top: 0;
  left: 0;
  border-bottom: 1px solid #e9ecef;
  height: 54px;
  width: 55%;
  background-color: white;
  padding: 5px 10px;
  z-index: 5;
`;

const HomeIcon = styled(IoArrowBackCircleOutline)`
  cursor: pointer;
  font-size: 30px;
`;

const ListContainer = styled.div`
  width: 55%;
  height: 100vh;
  overflow-y: auto;
  /* padding: 0px 30px; */
`;

const MapContainer = styled.div`
  width: 45%;
  height: 100vh;
  position: relative;
`;
