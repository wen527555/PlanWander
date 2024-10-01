'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { GoShare } from 'react-icons/go';
import { IoEarthOutline } from 'react-icons/io5';
import { PiArticleNyTimes } from 'react-icons/pi';
import { SlOptions } from 'react-icons/sl';
import { TbLogout2 } from 'react-icons/tb';
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
  const { userData, setUserData } = useUserStore();
  // console.log('photoURL', photoURL);
  const queryClient = useQueryClient();
  // const handleAddClick = () => {
  //   setIsModalOpen(true);
  // };

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
  console.log('trips', trips);
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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUserData(null);
      router.push('/');
    } catch (error) {
      console.error('Error during logout: ', error);
    }
  };

  if (loadingTrips) {
    return <p>Loading</p>;
  }

  return (
    <>
      <Container>
        <Sidebar>
          <ImgWrapper>
            <ProfileImg src={userData?.photoURL || defaultProfileImg.src} />
          </ImgWrapper>
          {userData?.userName && <UserName>{userData?.userName}</UserName>}
          <InfoSection>
            <InfoItem>
              <TripsIcon />
              <InfoText>Trips</InfoText>
              <InfoCount>{trips?.length}</InfoCount>
            </InfoItem>
            <InfoItem>
              <ArticlesIcon />
              <InfoText>Articles</InfoText>
              <InfoCount>{articles?.length}</InfoCount>
            </InfoItem>
          </InfoSection>
          <LogoutWrapper>
            <LogoutIcon />
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </LogoutWrapper>
        </Sidebar>
        <MainContent>
          <Separator>
            <Title>Trip plans</Title>
          </Separator>
          <TripContainer>
            {trips?.length > 0 ? (
              <CarouselWrapper>
                <Carousel<Trip>
                  item={trips}
                  renderItem={(trip) => {
                    const formattedStartDate = dayjs(trip.startDate).format('DD MMM YYYY');
                    const formattedEndDate = dayjs(trip.endDate).format('DD MMM YYYY');

                    return (
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
                            <TripDate>
                              {formattedStartDate} - {formattedEndDate}
                            </TripDate>
                          </CardDetails>
                        </CardContent>
                      </CardWrapper>
                    );
                  }}
                />
              </CarouselWrapper>
            ) : (
              <p>No trips found.</p>
            )}
          </TripContainer>
          <ArticleContainer>
            <Separator>
              <Title>Travel Memories</Title>
            </Separator>
            {articles?.length > 0 ? (
              <CarouselWrapper>
                <Carousel<Article>
                  item={articles}
                  renderItem={(article) => (
                    <CardWrapper>
                      <ArticleHeader>
                        <OptionIcon onClick={() => handleArticleOptionClick(article.id)} />
                        {openMenuArticleId === article.id && (
                          <Menu>
                            <MenuItem>
                              <DeleteWrapper onClick={() => handleDeleteArticleClick(article.id)}>
                                <DeleteIcon />
                                Delete
                              </DeleteWrapper>
                            </MenuItem>
                          </Menu>
                        )}
                      </ArticleHeader>
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
              </CarouselWrapper>
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
  height: calc(100vh - 54px);
  margin-top: 60px;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #f9fcfd;
  border-right: 1px solid #dde9ed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  height: calc(100vh - 54px);
`;

const UserName = styled.h1`
  margin-top: 25px;
  font-weight: 700;
  font-size: 20px;
`;

const ImgWrapper = styled.div`
  box-shadow: 0 2px 3px #00000017;
  border: 4px solid #ffffff;
  background: #ecf6f9;
  border-radius: 50%;
  margin-top: 40px;
  width: 96px;
  height: 96px;
`;

const ProfileImg = styled.img`
  border-radius: 50%;
  width: 100%;
  height: 100%;
  /* border: 2px solid #a19a9a; */
  object-fit: cover;
`;

const InfoSection = styled.div`
  padding: 20px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ecf6f9;
  padding: 10px 20px;
  border-radius: 15px;
  margin: 30px 0px;
  width: 180px;
  font-size: 16px;
  font-weight: 600;
  &:nth-child(2) {
    background-color: #f9fcfd;
  }
`;

const TripsIcon = styled(IoEarthOutline)`
  font-size: 14px;
  color: #0f3e4a;
`;

const ArticlesIcon = styled(PiArticleNyTimes)`
  font-size: 14px;
  color: #0f3e4a;
`;

const InfoText = styled.span`
  font-size: 16px;
  color: #333;
  flex-grow: 1;
  margin-left: 10px;
`;

const InfoCount = styled.span`
  font-size: 16px;
  color: #6c757d;
`;

const LogoutWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: auto;
  margin-bottom: 15px;

  /* &:hover {
    background-color: #78b7cc;
  } */
`;

const LogoutButton = styled.button`
  width: 80px;
  font-weight: 700;
  font-size: 16px;
  padding: 5px 10px;
  cursor: pointer;
  color: #0f3e4a;
  background-color: #f9fcfd;
  border: none;
`;

const LogoutIcon = styled(TbLogout2)`
  font-size: 14px;
  color: #0f3e4a;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 10px 0px;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Separator = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0px 20px 30px;
  position: relative;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: #658c96;
  background: #fff;
  letter-spacing: 5px;
`;

const TripImg = styled.img`
  background-color: #efefef;
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 10px;
`;

const CardWrapper = styled.div`
  width: 100%;
  cursor: pointer;
  border-radius: 15px;
  overflow: hidden;
  /* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); */
`;

const CardDetails = styled.div`
  padding: 10px 20px;
  color: #333;
`;

const CardHeader = styled.div`
  width: 100%;
  height: 50px;
  padding: 5px 20px;
  display: flex;
  justify-content: end;
`;

const ArticleHeader = styled.div`
  width: 100%;
  height: 20px;
  padding: 5px 20px;
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
  border-radius: 8px;
  padding: 5px 10px;
  &:hover {
    background-color: #d5eff7;
  }
`;

const PublishIcon = styled(GoShare)`
  cursor: pointer;
  font-size: 18px;
  margin-right: 5px;
`;

const DeleteWrapper = styled.div`
  cursor: pointer;
  width: 100%;
`;

const DeleteIcon = styled(AiOutlineDelete)`
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
  border-radius: 8px;
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
  margin: 0px 20px;
  position: relative;
`;

const CarouselWrapper = styled.div`
  max-width: 800px;
  margin: 0px 25px;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -5px;
    height: 100%;
    width: 100px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
    pointer-events: none;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: -5px;
    height: 100%;
    width: 100px;
    background: linear-gradient(-90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
    pointer-events: none;
    z-index: 1;
  }
`;

const ArticleContainer = styled.div`
  margin: 0;
  position: relative;
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
