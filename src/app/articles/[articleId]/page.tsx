'use client';

import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import styled from 'styled-components';

import { fetchArticleData } from '@/lib/firebaseApi';
import { processDays } from '../../../lib/processDays';
import EditList from './EditList';

const MapComponent = dynamic(() => import('./Map'), {
  ssr: false,
});

const ArticlesPage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const [visiblePlace, setVisiblePlace] = useState<string | null>(null);
  const { data: articleData, isLoading } = useQuery({
    queryKey: ['articleData', articleId],
    queryFn: () => fetchArticleData(articleId as string),
    enabled: !!articleId,
  });
  // const handleBackProfile = () => {
  //   router.push('/profile');
  // };

  const handlePlaceVisible = (placeId: string) => {
    setVisiblePlace(placeId);
  };

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
        <MapComponent places={places as any} routes={route as any} visiblePlace={visiblePlace} />
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
