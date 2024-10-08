'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FaMapMarker } from 'react-icons/fa';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
// import { MdPlace } from 'react-icons/md';
import styled from 'styled-components';

import { getColorForDate } from '@/lib/colors';
import { saveArticle, saveImageToStorage } from '@/lib/firebaseApi';
import useAlert from '@/lib/hooks/useAlertMessage';
import { useUserStore } from '@/lib/store';

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
  const { userData } = useUserStore();
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const { addAlert, AlertMessage } = useAlert();
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
    placeItems.forEach((item) => observer.observe(item));

    return () => {
      placeItems.forEach((item) => observer.unobserve(item));
    };
  }, [articleData, onPlaceVisible]);

  const handleCoverImageUpload = async (file: File) => {
    const localCoverImageUrl = URL.createObjectURL(file);
    setCoverImage(localCoverImageUrl);
    URL.revokeObjectURL(localCoverImageUrl);
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
        coverImage,
        userData?.photoURL || null,
        userData?.userName || null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articleData', articleId as string] });
      addAlert('Article saved successfully!');
    },
    onError: (error: Error) => {
      console.error('Error saving article:', error.message);
      addAlert('Error saving article. Please try again');
    },
  });
  const router = useRouter();
  const handleBackProfile = () => {
    router.push('/profile');
  };

  const handleSaveArticle = async () => {
    if (!coverImage) {
      addAlert('Please upload coverImage.');
      return;
    }
    if (!articleTitle || !articleDescription) {
      addAlert("Please enter the article's title and description.");
      return;
    }
    try {
      saveArticleMutation.mutate();
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };
  return (
    <Container>
      <AlertMessage />
      <ListHeader>
        <HomeIcon onClick={handleBackProfile} />
        <SaveWrapper>
          <Button onClick={handleSaveArticle}>Save</Button>
        </SaveWrapper>
      </ListHeader>
      <EditWrapper>
        <ImageUploadWrapper>
          {coverImage ? <Image src={coverImage} alt="Cover Image" /> : <div>No image has been uploaded.</div>}
          <input
            ref={coverImageInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleCoverImageUpload(file);
              }
            }}
          />
        </ImageUploadWrapper>
        <ButtonWrapper>
          <Button
            onClick={() => {
              coverImageInputRef.current?.click();
            }}
          >
            Upload
          </Button>
        </ButtonWrapper>
        <ArticleTitleInput value={articleTitle} onChange={handleTitleChange} placeholder="Enter article title..." />
        <DescriptionInput
          value={articleDescription}
          onChange={handleArticleDescChange}
          placeholder="Enter article description..."
        />
      </EditWrapper>
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
                      <div>No image has been uploaded.</div>
                    )}
                    <input
                      ref={(el) => {
                        fileInputRefs.current[place.id] = el;
                      }}
                      type="file"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(place.id, file);
                        }
                      }}
                    />
                  </ImageUploadWrapper>
                  <ButtonWrapper>
                    <Button
                      onClick={() => {
                        fileInputRefs.current[place.id]?.click();
                      }}
                    >
                      Upload
                    </Button>
                  </ButtonWrapper>
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

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed !important;
  top: 0;
  left: 0;
  border-bottom: 1px solid #e9ecef;
  height: 54px;
  width: 48%;
  background-color: white;
  padding: 5px 10px;
  margin: 0px 10px;
  z-index: 2;
`;

const HomeIcon = styled(IoArrowBackCircleOutline)`
  cursor: pointer;
  font-size: 30px;
`;

const SaveWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
`;

//跟 Add button一樣

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  margin-top: 10px;
`;

const Button = styled.div`
  background-color: #a7d6e6;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 700;
  &:hover {
    background-color: #dde9ed;
  }
`;

const EditWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  width: 100%;
  margin-top: 60px;
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
  height: 100px;
  border: none;
  line-height: 1.6;
  letter-spacing: 0.5px;
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
