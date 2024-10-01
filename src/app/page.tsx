// import ArticleList from '@/components/AllArticle';
'use client';

// import { fetchAllPublishedArticles } from '@/lib/firebaseApi';
import Image from 'next/image';
import styled from 'styled-components';

import bgImage from '@/public/travel.jpg';

const HomePage = () => {
  return (
    <PageWrapper>
      <ContentWrapper>
        <TextSection>
          <Heading>A travel planner for everyone</Heading>
          <Description>
            Organize flights & hotels and map your trips in a free travel app designed for vacation planning & road
            trips, powered by AI and Google Maps.
          </Description>
          <ButtonGroup>
            <StartButton>Start planning</StartButton>
          </ButtonGroup>
        </TextSection>
      </ContentWrapper>
      <ImageSection>
        <Image src={bgImage} alt="Travel planning" layout="fill" objectFit="cover" quality={100} />
      </ImageSection>
    </PageWrapper>
  );
};

export default HomePage;

const PageWrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 50px;
  width: 50%;
  z-index: 2;
  background-color: white;
`;

const TextSection = styled.div`
  max-width: 600px;
`;

const Heading = styled.h1`
  font-size: 48px;
  color: #2c3e50;
  font-weight: bold;
`;

const Description = styled.p`
  font-size: 20px;
  color: #6c757d;
  margin: 30px 0;
  line-height: 1.5;
  letter-spacing: 0.2px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const StartButton = styled.button`
  padding: 15px 20px;
  background-color: #78b7cc;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background-color: #d5eff7;
  }
`;

const ImageSection = styled.div`
  position: relative;
  width: 50%;
  height: 100vh;
  overflow: hidden;
`;
