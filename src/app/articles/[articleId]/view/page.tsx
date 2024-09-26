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
  const { data: articleData, isLoading } = useQuery({
    queryKey: ['articleData', articleId],
    queryFn: () => fetchArticleData(articleId as string),
    enabled: !!articleId,
  });
  const router = useRouter();
  const handleBackProfile = () => {
    router.push('/profile');
  };

  const handlePlaceVisible = (placeId: string) => {
    setVisiblePlace(placeId);
  };

  if (isLoading || !articleData) return <p></p>;
  const { places, route } = processDays(articleData?.days as any);
  return (
    <Container>
      <ListContainer>
        <ListHeader>
          <HomeIcon onClick={handleBackProfile} />
        </ListHeader>
        <ViewList articleData={articleData} articleId={articleId} onPlaceVisible={handlePlaceVisible} />
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

const ListHeader = styled.div`
  margin: 10px 20px;
  display: flex;
  align-items: center;
`;

const HomeIcon = styled(IoArrowBackCircleOutline)`
  cursor: pointer;
  font-size: 30px;
`;

const ListContainer = styled.div`
  width: 55%;
  height: 100vh;
  overflow-y: auto;
  padding: 0px 30px;
`;

const MapContainer = styled.div`
  width: 45%;
  height: 100vh;
  position: relative;
`;
