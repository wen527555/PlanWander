import ArticleContainer from './components/ArticleContainer';
import ViewList from './components/ViewList';

const ViewArticlePage = () => {
  return <ArticleContainer ListComponent={ViewList} isEdit={false} />;
};

export default ViewArticlePage;

// 'use client';

// import { useQuery } from '@tanstack/react-query';
// import dynamic from 'next/dynamic';
// import { useParams, useRouter } from 'next/navigation';
// import { useState, useTransition } from 'react';
// import { IoArrowBackCircleOutline } from 'react-icons/io5';
// import styled from 'styled-components';

// import LoadingAnimation from '@/components/Loading';
// import { fetchArticleData } from '@/lib/firebaseApi';
// import { processDays } from '@/lib/processDays';
// import ViewList from '../components/ViewList';

// const MapComponent = dynamic(() => import('../components/Map'), {
//   ssr: false,
// });

// const ArticlesPage = () => {
//   const { articleId } = useParams<{ articleId: string }>();
//   const [visiblePlace, setVisiblePlace] = useState<string | null>(null);
//   const [manualScroll, setManualScroll] = useState(false);
//   const [isPending, startTransition] = useTransition();
//   const [isMapVisible, setIsMapVisible] = useState(false);
//   const { data: articleData, isLoading } = useQuery({
//     queryKey: ['articleData', articleId],
//     queryFn: () => fetchArticleData(articleId as string),
//     enabled: !!articleId,
//   });
//   const router = useRouter();

//   const toggleMapListView = () => {
//     setIsMapVisible((prev) => !prev);
//   };

//   const handleBackHome = () => {
//     startTransition(() => {
//       router.push('/discover');
//     });
//   };

//   const handlePlaceVisible = (placeId: string) => {
//     if (!manualScroll) {
//       setVisiblePlace(placeId);
//     }
//   };

//   const handleMarkerClick = (placeId: string) => {
//     setManualScroll(true);
//     setVisiblePlace(placeId);
//   };

//   if (isLoading) {
//     return <LoadingAnimation />;
//   }

//   if (!articleData) return;
//   const { places, route } = processDays(articleData?.days as any);
//   return (
//     <>
//       {isPending && <LoadingAnimation />}
//       <ToggleButton onClick={toggleMapListView}>{isMapVisible ? 'List View' : 'Map View'}</ToggleButton>
//       <Container>
//         <ListContainer isMapVisible={isMapVisible}>
//           <ListHeader>
//             <HomeIcon onClick={handleBackHome} />
//           </ListHeader>
//           <ViewList
//             articleData={articleData}
//             articleId={articleId}
//             onPlaceVisible={handlePlaceVisible}
//             visiblePlace={visiblePlace}
//             setManualScroll={setManualScroll}
//             manualScroll={manualScroll}
//           />
//         </ListContainer>
//         <MapContainer isMapVisible={isMapVisible}>
//           <MapComponent
//             places={places as any}
//             routes={route as any}
//             visiblePlace={visiblePlace}
//             onMarkerClick={handleMarkerClick}
//           />
//         </MapContainer>
//       </Container>
//     </>
//   );
// };

// export default ArticlesPage;

// const Container = styled.div`
//   display: flex;
// `;

// const ToggleButton = styled.button`
//   position: absolute;
//   bottom: 20px;
//   padding: 10px 20px;
//   background-color: #212529;
//   color: white;
//   border: none;
//   border-radius: 20px;
//   cursor: pointer;
//   z-index: 3;
//   font-weight: 600;
//   font-size: 14px;

//   left: 50%;
//   transform: translateX(-50%);
//   @media (min-width: 769px) {
//     display: none;
//   }
// `;

// const ListHeader = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   position: fixed !important;
//   top: 0;
//   left: 0;
//   border-bottom: 1px solid #e9ecef;
//   height: 54px;
//   width: 55%;
//   background-color: white;
//   padding: 5px 10px;
//   z-index: 5;

//   @media (max-width: 768px) {
//     width: 100%;
//   }
// `;

// const HomeIcon = styled(IoArrowBackCircleOutline)`
//   cursor: pointer;
//   font-size: 30px;
// `;

// const ListContainer = styled.div<{ isMapVisible: boolean }>`
//   width: 55%;
//   height: 100vh;
//   overflow-y: auto;
//   /* padding: 0px 30px; */

//   @media (max-width: 768px) {
//     width: 100%;
//     display: ${(props) => (props.isMapVisible ? 'none' : 'block')};
//   }
// `;

// const MapContainer = styled.div<{ isMapVisible: boolean }>`
//   width: 45%;
//   height: 100vh;
//   position: relative;

//   @media (max-width: 768px) {
//     width: 100%;
//     display: ${(props) => (props.isMapVisible ? 'block' : 'none')};
//   }
// `;
