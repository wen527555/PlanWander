'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { GoShare } from 'react-icons/go';
import { SlOptions } from 'react-icons/sl';
import styled from 'styled-components';

import TripModal from '@/components/TripModal';
import {
  createArticleFromTrip,
  createNewTrip,
  fetchDeleteArticle,
  fetchDeleteTrip,
  fetchUserAllArticles,
  fetchUserAllTrips,
} from '@/lib/firebaseApi';
import { useUserStore } from '@/lib/store';
import defaultProfileImg from '@/public/earth-profile.png';
import Carousel from '../../components/Carousel';
import { auth } from '../../lib/firebaseConfig';

interface Trip {
  imageUrl: string | undefined;
  id: string;
  tripTitle: string;
  startDate: string;
  endDate: string;
}

interface Article {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  coverImage: string;
}

interface SelectedOption {
  value: string;
  label: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuTripId, setOpenTripId] = useState<string | null>(null);
  const [openMenuArticleId, setOpenArticleId] = useState<string | null>(null);
  const { photoURL, userName } = useUserStore();
  // console.log('photoURL', photoURL);
  const queryClient = useQueryClient();
  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleTripOptionClick = (tripId: string) => {
    if (openMenuTripId === tripId) {
      setOpenTripId(null);
    } else {
      setOpenTripId(tripId);
    }
  };

  const handleArticleOptionClick = (ArticleId: string) => {
    if (openMenuArticleId === ArticleId) {
      setOpenArticleId(null);
    } else {
      setOpenArticleId(ArticleId);
    }
  };

  const deleteTripMutation = useMutation({
    mutationFn: fetchDeleteTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTrips'] });
      alert('delete trip successfully!');
    },
    onError: (error) => {
      console.error('Error deleting trip:', error);
    },
  });

  const handleDeleteTripClick = (tripId: string) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      deleteTripMutation.mutate(tripId);
    }
  };

  const deleteArticleMutation = useMutation({
    mutationFn: fetchDeleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userArticles'] });
      alert('delete article successfully!');
    },
    onError: (error) => {
      console.error('Error deleting trip:', error);
    },
  });

  const handleDeleteArticleClick = (articleId: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteArticleMutation.mutate(articleId);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, []);

  const { data: trips = [], isLoading: loadingTrips } = useQuery<any>({
    queryKey: ['userTrips'],
    queryFn: fetchUserAllTrips,
  });

  const { data: articles = [] } = useQuery<any>({
    queryKey: ['userArticles'],
    queryFn: fetchUserAllArticles,
  });

  const handleTripClick = (tripId: string) => {
    router.push(`trips/${tripId}`);
  };

  const handleArticleClick = (articleId: string) => {
    router.push(`articles/${articleId}`);
  };

  const handlePublishClick = async (tripId: string) => {
    try {
      await createArticleFromTrip(tripId);
      router.push(`/articles/${tripId}`);
    } catch (error) {
      console.error('Error publishing article:', error);
    }
  };

  const handleCreateTrip = async (
    tripTitle: string,
    startDate: Date,
    endDate: Date,
    selectedCountries: SelectedOption[]
  ) => {
    const tripId = await createNewTrip(tripTitle, startDate, endDate, selectedCountries);
    console.log('Trip created successfully');
    router.push(`/trips/${tripId}`);
  };

  if (loadingTrips) {
    return <p>Loading</p>;
  }

  return (
    <>
      <Container>
        <Sidebar>
          <ProfileImg src={photoURL || defaultProfileImg.src} />
          {userName && <UserName>{userName}</UserName>}
        </Sidebar>
        <MainContent>
          <ButtonWrapper>
            <Button onClick={handleAddClick}>Add</Button>
          </ButtonWrapper>
          <TripContainer>
            <Title>Trips</Title>
            {trips?.length > 0 ? (
              <Carousel<Trip>
                item={trips}
                renderItem={(trip) => (
                  <CardWrapper>
                    <CardHeader>
                      <IconWrapper>
                        <PublishWrapper onClick={() => handlePublishClick(trip.id)}>
                          <PublishIcon />
                          Publish
                        </PublishWrapper>
                        <OptionIcon onClick={() => handleTripOptionClick(trip.id)} />
                        {openMenuTripId === trip.id && (
                          <Menu>
                            <MenuItem>
                              <DeleteIcon onClick={() => handleDeleteTripClick(trip.id)} />
                              Delete
                            </MenuItem>
                          </Menu>
                        )}
                      </IconWrapper>
                    </CardHeader>
                    <CardContent onClick={() => handleTripClick(trip.id)}>
                      <TripImg src={trip.imageUrl} />
                      <CardDetails>
                        <TripName>{trip.tripTitle}</TripName>
                        <TripDate>{trip.startDate}</TripDate>
                        <TripDate>{trip.endDate}</TripDate>
                      </CardDetails>
                    </CardContent>
                  </CardWrapper>
                )}
              />
            ) : (
              <p>No trips found.</p>
            )}
          </TripContainer>
          <ArticleContainer>
            <Title>Articles</Title>
            {articles?.length > 0 ? (
              <Carousel<Article>
                item={articles}
                renderItem={(article) => (
                  <CardWrapper>
                    <CardHeader>
                      <OptionIcon onClick={() => handleArticleOptionClick(article.id)} />
                      {openMenuArticleId === article.id && (
                        <Menu>
                          <MenuItem>
                            <DeleteIcon onClick={() => handleDeleteArticleClick(article.id)} />
                            Delete
                          </MenuItem>
                        </Menu>
                      )}
                    </CardHeader>
                    <ArticleWrapper onClick={() => handleArticleClick(article.id)}>
                      <ArticleContent>
                        <ArticleTitle>{article.title}</ArticleTitle>
                        <ArticleDescription>{article.description}</ArticleDescription>
                        <PublishedDate>Published on {article.createdAt}</PublishedDate>
                      </ArticleContent>
                      <ArticleImage src={article.coverImage} alt={article.title} />
                    </ArticleWrapper>
                  </CardWrapper>
                )}
              />
            ) : (
              <p>No Article found.</p>
            )}
          </ArticleContainer>
        </MainContent>
        {isModalOpen && <TripModal onClose={handleModalClose} isEditing={false} onSubmit={handleCreateTrip} />}
      </Container>
    </>
  );
};

export default ProfilePage;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  margin-top: 60px;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #f1f1f1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserName = styled.div`
  margin-top: 25px;
  font-weight: 700;
  font-size: 20px;
`;

const ProfileImg = styled.img`
  border-radius: 50%;
  width: 150px;
  height: 150px;
  margin-top: 30px;
  /* border: 2px solid #a19a9a; */
  background-color: white;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  overflow-x: hidden;
  margin: 0px 60px;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  width: 80px;
  font-weight: 700;
  transition: all 0.2s ease-in-out;
  font-size: 20px;
  border-radius: 20px;
  background-color: white;
  border: 1px solid #dde9ed;
  padding: 5px 10px;
  cursor: pointer;
  &hover {
    background-color: #dde9ed;
  }
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-left: 30px;
`;

const TripImg = styled.img`
  background-color: #efefef;
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 10px;
`;

const CardWrapper = styled.div`
  width: 700px;
  cursor: pointer;
`;

const CardDetails = styled.div`
  padding: 16px;
  color: #333;
`;

const CardHeader = styled.div`
  width: 100%;
  height: 50px;
  /* margin-bottom: 2px; */
  display: flex;
  justify-content: end;
`;

const CardContent = styled.div`
  width: 100%;
`;

const TripName = styled.h3`
  color: #0f3e4a;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const TripDate = styled.div`
  font-weight: 400;
  color: #658c96;
  font-size: 14px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const PublishWrapper = styled.div`
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
`;

const PublishIcon = styled(GoShare)`
  cursor: pointer;
  font-size: 18px;
  margin-right: 5px;
`;

const DeleteIcon = styled(AiOutlineDelete)`
  cursor: pointer;
  font-size: 18px;
  margin-right: 5px;
`;

const Menu = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const MenuItem = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const OptionIcon = styled(SlOptions)`
  cursor: pointer;
  font-size: 15px;
  margin-left: 10px;
  position: relative;
`;

const TripContainer = styled.div`
  margin: 0;
`;

const ArticleContainer = styled.div`
  margin: 10px 0px;
`;

const ArticleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  height: 250px;
  cursor: pointer;
  align-items: center;
`;

const ArticleContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
  margin: 10px 15px;
  justify-content: space-between;
  height: 100%;
`;

const ArticleTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 15px;
`;

const ArticleDescription = styled.p`
  font-size: 16px;
  color: #555;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: auto;
  margin-top: 15px;
`;

const PublishedDate = styled.p`
  margin-top: 10px;
  font-size: 12px;
  color: #999;
`;

const ArticleImage = styled.img`
  width: 250px;
  height: auto;
  object-fit: cover;
  height: 90%;
  border-radius: 10px;
`;
