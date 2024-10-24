'use client';

import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import ListMapLayout from '@/components/ListWithMapLayout';
import LoadingAnimation from '@/components/Loading';
import { processDays } from '@/lib/processDays';
import { fetchArticleData } from '@/services/firebaseApi';

const MapComponent = dynamic(() => import('./ArticleMap'), {
  ssr: false,
});

interface ArticleProps {
  ListComponent: React.ComponentType<any>;
  isEdit?: boolean;
}

const ArticlePage: React.FC<ArticleProps> = ({ ListComponent, isEdit }) => {
  const { articleId } = useParams<{ articleId: string }>() ?? {};
  const [visiblePlace, setVisiblePlace] = useState<string | null>(null);
  const [manualScroll, setManualScroll] = useState(false);
  const { data: articleData, isLoading } = useQuery({
    queryKey: ['articleData', articleId],
    queryFn: () => fetchArticleData(articleId as string),
    enabled: !!articleId,
  });

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
      <ListMapLayout
        listContent={
          isEdit ? (
            <ListComponent articleData={articleData} articleId={articleId} onPlaceVisible={handlePlaceVisible} />
          ) : (
            <ListComponent
              articleData={articleData}
              articleId={articleId}
              onPlaceVisible={handlePlaceVisible}
              visiblePlace={visiblePlace}
              setManualScroll={setManualScroll}
              manualScroll={manualScroll}
            />
          )
        }
        mapContent={
          <MapComponent
            places={places as any}
            routes={route as any}
            visiblePlace={visiblePlace}
            onMarkerClick={handleMarkerClick}
          />
        }
      />
    </>
  );
};

export default ArticlePage;
