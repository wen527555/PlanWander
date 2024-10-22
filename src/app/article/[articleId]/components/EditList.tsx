'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import { FaMapMarker, FaPencilAlt } from 'react-icons/fa';
import styled from 'styled-components';

import { HomeIcon, ListHeader } from '@/components/ListWithMap/Header';
import LoadingAnimation from '@/components/Loading';
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
    imageUrl: string;
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
  const [isPending, startTransition] = useTransition();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const allowImgFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  const maxImgSize = 5 * 1024 * 1024;
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
    if (!allowImgFormats.includes(file.type)) {
      addAlert('Please upload an image in JPG or PNG format.');
      return;
    }

    if (file.size > maxImgSize) {
      addAlert('The image size should not exceed 5MB.');
      return;
    }
    const localCoverImageUrl = URL.createObjectURL(file);
    setCoverImage(localCoverImageUrl);
    URL.revokeObjectURL(localCoverImageUrl);
    try {
      const imageUrl = await saveImageToStorage('cover', file);
      setCoverImage(imageUrl);
    } catch (error) {
      console.error('Error uploading cover image:', error);
      addAlert('Image upload failed, please try again.');
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
      setCoverImage(articleData.coverImage || articleData.imageUrl);
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
    if (!allowImgFormats.includes(file.type)) {
      addAlert('Please upload an image in JPG or PNG format.');
      return;
    }

    if (file.size > maxImgSize) {
      addAlert('The image size should not exceed 5MB.');
      return;
    }
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
    startTransition(() => {
      router.push('/profile/articles');
    });
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
    <>
      {isPending && <LoadingAnimation />}
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
            <EditButton
              onClick={() => {
                coverImageInputRef.current?.click();
              }}
            >
              <EditIcon />
            </EditButton>
          </ImageUploadWrapper>
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
                      <EditButton
                        onClick={() => {
                          fileInputRefs.current[place.id]?.click();
                        }}
                      >
                        <EditIcon />
                      </EditButton>
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
          <div></div>
        )}
      </Container>
    </>
  );
};

export default EditList;

const Container = styled.div`
  margin: 10px;
  padding-bottom: 10px;
`;

const SaveWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
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

const EditButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(33, 37, 41, 0.502);
  border: none;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;

  &:hover {
    background-color: #1b1b1b;
  }
`;

const EditIcon = styled(FaPencilAlt)`
  color: #ffff;
  font-size: 16px;
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
  background-color: #f2f4f7;
  border-radius: 5px;
  outline: none;
  border: none;
`;

const DescriptionInput = styled.textarea`
  font-size: 14px;
  padding: 10px;
  outline: none;
  resize: none;
  border: none;
  line-height: 1.6;
  letter-spacing: 0.5px;
  background-color: #f2f4f7;
  height: 100px;
  border-radius: 5px;
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
  position: relative;
  background-color: #f3f3f3;
  height: 300px;
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
  background-color: #f9fafb;
  height: 100px;
  border-radius: 5px;
  padding: 10px;
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
