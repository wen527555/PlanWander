'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FaMapMarker } from 'react-icons/fa';
// import { MdPlace } from 'react-icons/md';
import styled from 'styled-components';

import { getColorForDate } from '@/lib/colors';
import { saveArticle, saveImageToStorage } from '@/lib/firebaseApi';

interface ListProps {
  articleData: {
    coverImage: string;
    title: string;
    description: string;
    days: any;
  };
  articleId: any;
  onPlaceVisible: (placeId: string) => void;
}

const EditList: React.FC<ListProps> = ({ articleData, articleId, onPlaceVisible }) => {
  const [articleTitle, setArticleTitle] = useState('');
  const [articleDescription, setArticleDescription] = useState('');
  const [descriptions, setDescriptions] = useState<{ [key: string]: string }>({});
  const [images, setImages] = useState<{ [key: string]: any }>({});
  const [coverImage, setCoverImage] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const placeId = entry.target.getAttribute('data-place-id');
            if (placeId) {
              onPlaceVisible(placeId);
            }
          }
        });
      },
      { threshold: 0.8 }
    );

    const placeItems = document.querySelectorAll('.place-item');
    observer.observe(placeItems[0]);
    placeItems.forEach((item) => observer.observe(item));

    return () => {
      placeItems.forEach((item) => observer.unobserve(item));
    };
  }, [articleData, onPlaceVisible]);
  const handleCoverImageUpload = async (file: File) => {
    const localCoverImageUrl = URL.createObjectURL(file);
    setCoverImage(localCoverImageUrl);

    try {
      const imageUrl = await saveImageToStorage('cover', file);
      setCoverImage(imageUrl);
    } catch (error) {
      console.error('Error uploading cover image:', error);
      alert('上傳圖片失敗，請重新上傳');
    }
  };
  const handleDescriptionChange = (placeId: string, value: string) => {
    setDescriptions((prev) => ({
      ...prev,
      [placeId]: value,
    }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArticleTitle(e.target.value);
  };

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

  const handleImageUpload = async (placeId: string, file: File) => {
    const localImageUrl = URL.createObjectURL(file);
    setImages((prev) => ({
      ...prev,
      [placeId]: localImageUrl,
    }));

    try {
      const imageUrl = await saveImageToStorage(placeId, file);
      setImages((prev) => ({
        ...prev,
        [placeId]: imageUrl,
      }));
    } catch (error) {
      console.error('Error during image upload:', error);
    }
  };

  const handleArticleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setArticleDescription(e.target.value);
  };

  const queryClient = useQueryClient();

  const saveArticleMutation = useMutation({
    mutationFn: async () => {
      await saveArticle(
        articleId,
        articleTitle,
        articleDescription,
        articleData.days,
        descriptions,
        images,
        coverImage
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articleData', articleId as string] });
      alert('Article saved successfully!');
    },
    onError: (error: Error) => {
      console.error('Error saving article:', error.message);
      alert('Error saving article. Please try again.');
    },
  });

  const handleSaveArticle = async () => {
    try {
      saveArticleMutation.mutate();
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };
  return (
    <Container>
      <ArticleHeader>
        <SaveWrapper>
          <SaveButton onClick={handleSaveArticle}>Save</SaveButton>
        </SaveWrapper>
        <ImageUploadWrapper>
          {coverImage ? (
            <Image src={coverImage} alt="Cover Image" />
          ) : (
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleCoverImageUpload(file);
                }
              }}
            />
          )}
        </ImageUploadWrapper>
        <ArticleTitleInput value={articleTitle} onChange={handleTitleChange} placeholder="Enter article title..." />
        <DescriptionInput
          value={articleDescription}
          onChange={handleArticleDescChange}
          placeholder="Enter article description..."
        />
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
                  <ImageUploadWrapper>
                    {images[place.id] ? (
                      <Image src={`${images[place.id]}`} alt={place.name} />
                    ) : (
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(place.id, file);
                          }
                        }}
                      />
                    )}
                  </ImageUploadWrapper>
                  <Description
                    value={descriptions[place.id] || ''}
                    placeholder="Enter a description..."
                    onChange={(e) => handleDescriptionChange(place.id, e.target.value)}
                  />
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

const SaveWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
`;

const SaveButton = styled.div`
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  font-size: 16px;
  border-radius: 20px;
  background-color: white;
  border: 1px solid #dde9ed;
  padding: 5px 10px;
  cursor: pointer;
`;

const ArticleHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  width: 100%;
`;

const ArticleTitleInput = styled.input`
  font-size: 16px;
  padding: 10px;
  background-color: #ececec;
  border-radius: 5px;
  outline: none;
  border: none;
`;

const DescriptionInput = styled.textarea`
  font-size: 14px;
  padding: 10px;
  background-color: #ececec;
  border-radius: 5px;
  outline: none;
  resize: none;
  height: auto;
  border: none;
`;

const ItemContainer = styled.div`
  width: 100%;
  margin: 10px 0px;
`;

const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0px;
  gap: 10px;
`;

// const MarkerIcon = styled(MdPlace)`
//   font-size: 20px;
// `;

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
  background-color: #f3f3f3;
  height: 200px;
  margin-bottom: 10px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #ccc;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Description = styled.textarea`
  font-size: 14px;
  color: #888;
  margin-top: 10px;
  border: none;
  width: 100%;
  outline: none;
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
