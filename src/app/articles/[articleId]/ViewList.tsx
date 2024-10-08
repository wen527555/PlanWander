'use client';

import { useEffect, useRef, useState } from 'react';
import { FaMapMarker } from 'react-icons/fa';
import { MdOutlineLibraryBooks } from 'react-icons/md';
import styled from 'styled-components';

import { getColorForDate } from '@/lib/colors';
import defaultCoverImg from '@/public/travel.jpg';

interface ListProps {
  articleData: {
    title: string;
    description: string;
    days: any;
    coverImage: any;
  };
  articleId: string;
  onPlaceVisible: (placeId: string) => void;
  visiblePlace: string | null;
  setManualScroll: (placeId: boolean) => void;
  manualScroll: boolean;
}

const ViewList: React.FC<ListProps> = ({
  articleData,
  onPlaceVisible,
  visiblePlace,
  setManualScroll,
  manualScroll,
}) => {
  const [articleTitle, setArticleTitle] = useState('');
  const [articleDescription, setArticleDescription] = useState('');
  const [descriptions, setDescriptions] = useState<{ [key: string]: string }>({});
  const [images, setImages] = useState<{ [key: string]: string | File }>({});
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const placeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleScroll = (placeId: string) => {
    if (!manualScroll) {
      onPlaceVisible(placeId);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const placeId = entry.target.getAttribute('data-place-id');
          if (entry.isIntersecting && placeId) {
            handleScroll(placeId);
          }
        });
      },
      { threshold: 0.99 }
    );

    const placeItems = document.querySelectorAll('.place-item');
    placeItems.forEach((item) => observer.observe(item));

    return () => {
      placeItems.forEach((item) => observer.unobserve(item));
    };
  }, [articleData, onPlaceVisible]);

  useEffect(() => {
    if (articleData) {
      setArticleTitle(articleData.title);
      setArticleDescription(articleData.description);
      setCoverImage(articleData.coverImage);
      const initialDescriptions: { [key: string]: string } = {};
      const initialImages: { [key: string]: string } = {};

      articleData.days?.forEach((day: any) => {
        day.places?.forEach((place: any) => {
          initialDescriptions[place.id] = place.description || '';
          if (place.photos && place.photos.length > 0) {
            initialImages[place.id] = place.photos[0];
          }
        });
      });

      setDescriptions(initialDescriptions);
      setImages(initialImages);
    }
  }, [articleData]);

  useEffect(() => {
    if (manualScroll && visiblePlace && placeRefs.current[visiblePlace]) {
      placeRefs.current[visiblePlace].scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }

    setTimeout(() => {
      setManualScroll(false);
    }, 500);
  }, [visiblePlace, manualScroll, setManualScroll]);

  return (
    <>
      <Container>
        <CoverImageWrapper>
          <CoverImage src={coverImage || defaultCoverImg.src} />
          <ArticleTitle>{articleTitle}</ArticleTitle>
        </CoverImageWrapper>
        <ViewWrapper>
          <DescIcon />
          <ArticleDescription>{articleDescription}</ArticleDescription>
        </ViewWrapper>
        {articleData.days?.length > 0 ? (
          articleData.days.map((day: any, dateIndex: number) => (
            <ItemContainer key={dateIndex}>
              <ItemTitle>DAY {dateIndex + 1}</ItemTitle>
              {Array.isArray(day.places) &&
                day.places.map((place: any, index: string) => (
                  <PlaceItem
                    key={index}
                    data-place-id={place.id}
                    className="place-item"
                    visible={visiblePlace === place.id}
                    ref={(el) => {
                      placeRefs.current[place.id] = el;
                    }}
                  >
                    <ItemHeader>
                      <MarkerContainer>
                        <MarkerIcon color={getColorForDate(dateIndex)} />
                        <MarkerNumber>{index + 1}</MarkerNumber>
                      </MarkerContainer>
                      <ItemName>{place.name}</ItemName>
                    </ItemHeader>
                    {images[place.id] && (
                      <ImageUploadWrapper>
                        <Image src={`${images[place.id]}`} />
                      </ImageUploadWrapper>
                    )}
                    <Description>{descriptions[place.id] || ''}</Description>
                  </PlaceItem>
                ))}
            </ItemContainer>
          ))
        ) : (
          <p>No trip days found.</p>
        )}
      </Container>
    </>
  );
};

export default ViewList;

const Container = styled.div`
  /* margin: 10px; */
  /* border-bottom: 1px solid #ccc; */
  padding-bottom: 10px;
  margin-top: 54px;
`;

const CoverImageWrapper = styled.div`
  position: relative;
  height: 300px;
  margin-bottom: 10px;
  width: 100%;
  border: none;
  overflow: hidden;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
  }
`;

const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ViewWrapper = styled.div`
  width: 100%;
  background: #f9fcfd;
  display: flex;
  align-items: center;
  padding: 5px 30px 15px 30px;
`;

const DescIcon = styled(MdOutlineLibraryBooks)`
  font-size: 22px;
  color: #2c3e50;
`;

const ArticleTitle = styled.h2`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: 700;
  z-index: 1;
  font-size: 24px;
  line-height: 1.6;
  letter-spacing: 0.5px;
`;

const ArticleDescription = styled.div`
  font-size: 18px;
  padding: 10px 20px;
  width: 100%;
  height: auto;
  line-height: 1.6;
  letter-spacing: 0.5px;
`;
const ItemContainer = styled.div`
  width: 100%;
  margin: 10px 0px;
`;

const PlaceItem = styled.div<{ visible: boolean }>`
  position: relative;
  margin: 20px 0px;
  padding: 10px 12px;
  /* transition: background-color 0.3s ease; */
  /* min-height: 450px; */
  ${({ visible }) =>
    visible
      ? `
          background-color: #ecf6f9;
      `
      : `
         background-color:#ffff;
      `}
`;

const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0px 15px 10px;
  gap: 10px;
`;

const ItemTitle = styled.h3`
  width: 100px;
  font-size: 18px;
  font-weight: 500;
  border-radius: 20px;
  background-color: #ececec;
  color: #393a3c;
  text-align: center;
  padding: 10px 0px;
  margin: 20px 0px 0px 15px;
`;

const ItemName = styled.h3`
  font-size: 18px;
  font-weight: 500;
`;

const ImageUploadWrapper = styled.div`
  /* background-color: #f3f3f3; */
  height: 250px;
  margin-bottom: 10px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  /* border: 2px dashed #ccc; */
`;

const Image = styled.img`
  width: 90%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
`;

const Description = styled.div`
  font-size: 16px;
  color: #888;
  margin: 20px 0px 20px 0px;
  border: none;
  width: 100%;
  outline: none;
  height: auto;
  padding: 0px 40px;
  line-height: 1.6;
  letter-spacing: 0.5px;
`;

const MarkerContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 24px;
  height: 36px;
`;

const MarkerIcon = styled(FaMapMarker)`
  width: 100%;
  height: 100%;
  /* border: 1px solid #ffff; */
  color: ${(props) => props.color};
`;

const MarkerNumber = styled.div`
  position: absolute;
  top: 40%;
  left: 47%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 15px;
  font-weight: bold;
`;
