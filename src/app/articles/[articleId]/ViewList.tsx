'use client';

import { useEffect, useState } from 'react';
import { FaMapMarker } from 'react-icons/fa';
import styled from 'styled-components';

import { getColorForDate } from '@/lib/colors';

interface ListProps {
  articleData: {
    title: string;
    description: string;
    days: any;
  };
  articleId: string;
  onPlaceVisible: (placeId: string) => void;
}

const EditList: React.FC<ListProps> = ({ articleData, onPlaceVisible }) => {
  const [articleTitle, setArticleTitle] = useState('');
  const [articleDescription, setArticleDescription] = useState('');
  const [descriptions, setDescriptions] = useState<{ [key: string]: string }>({});
  const [images, setImages] = useState<{ [key: string]: string | File }>({});
  // const [coverImage, setCoverImage] = useState<string | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const placeId = entry.target.getAttribute('data-place-id');
            if (placeId) {
              console.log('placeId', placeId);
              onPlaceVisible(placeId);
            }
          }
        });
      },
      { threshold: 0.5 }
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
      // setCoverImage(articleData.coverImage);
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

  return (
    <Container>
      <ArticleHeader>
        <ArticleTitleInput>{articleTitle}</ArticleTitleInput>
        <DescriptionInput>{articleDescription}</DescriptionInput>
      </ArticleHeader>
      {articleData.days?.length > 0 ? (
        articleData.days.map((day: any, dateIndex: number) => (
          <ItemContainer key={dateIndex}>
            <ItemTitle>DAY {dateIndex + 1}</ItemTitle>
            {Array.isArray(day.places) &&
              day.places.map((place: any, index: string) => (
                <div key={index} data-place-id={place.id} className="place-item">
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
                </div>
              ))}
          </ItemContainer>
        ))
      ) : (
        <p>No trip days found.</p>
      )}
    </Container>
  );
};

export default EditList;

const Container = styled.div`
  margin: 10px;
  /* border-bottom: 1px solid #ccc; */
  padding-bottom: 10px;
`;

const ArticleHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  width: 100%;
`;

const ArticleTitleInput = styled.div`
  font-size: 16px;
  padding: 10px;
  background-color: #ececec;
  border-radius: 5px;
  height: auto;
  width: 100%;
`;

const DescriptionInput = styled.div`
  font-size: 14px;
  padding: 10px;
  height: auto;
  width: 100%;

  background-color: #ececec;
  height: 50px;
`;

const ItemContainer = styled.div`
  width: 100%;
  margin: 10px 0px;
`;

const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0px;
`;

const ItemTitle = styled.h3`
  width: 100px;
  font-size: 18px;
  font-weight: 500;
  border-radius: 15px;
  background-color: #ececec;
  color: #393a3c;
  text-align: center;
  padding: 5px 0px;
`;

const ItemName = styled.h3`
  font-size: 18px;
  font-weight: 500;
`;

const ImageUploadWrapper = styled.div`
  /* background-color: #f3f3f3; */
  height: 200px;
  margin-bottom: 10px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  /* border: 2px dashed #ccc; */
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const Description = styled.div`
  font-size: 14px;
  color: #888;
  margin-top: 10px;
  border: none;
  width: 100%;
  outline: none;
  height: auto;
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
