// import ArticleList from '@/components/AllArticle';
'use client';

import Head from 'next/head';
// import { fetchAllPublishedArticles } from '@/lib/firebaseApi';
import Image from 'next/image';
import styled from 'styled-components';

import planGif from '@/public/plan.gif';
import bgImage from '@/public/travel.jpg';

const HomePage = () => {
  return (
    <>
      <Head>
        <title>PlanWander - 為每個人設計的旅行規劃工具</title>
        <meta name="description" content="PlanWander 是一個免費的旅行規劃網站，讓您輕鬆安排並規劃您的旅程。" />
        <meta name="keywords" content="旅行, 行程規劃, 度假, 旅程, 旅遊地圖" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="PlanWander - 為每個人設計的旅行規劃工具" />
        <meta property="og:description" content="PlanWander 是一個免費的旅行規劃網站，讓您輕鬆安排並組織您的旅程。" />
        <meta property="og:image" content="/travel.jpg" />
        <meta property="og:type" content="website" />
      </Head>
      <PageWrapper>
        <ContentWrapper>
          <TextSection>
            <Heading>A travel planner for everyone</Heading>
            <Description>Organize map your trip in a free travel website designed for vacation planning.</Description>
            <ButtonGroup>
              <StartButton>Start planning</StartButton>
            </ButtonGroup>
          </TextSection>
        </ContentWrapper>
        <ImageSection>
          <Image
            src={bgImage}
            alt="A detailed travel planning website for vacation and itinerary management"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </ImageSection>
      </PageWrapper>
      <Section2>
        <ImageSection>
          <Image
            src={planGif}
            alt="Interactive travel plan demonstration"
            layout="fill"
            objectFit="contain"
            quality={100}
            style={{ borderRadius: '20px' }}
          />
        </ImageSection>
        <ContentWrapper>
          <TextSection>
            <Heading>Your itinerary and your map in one view</Heading>
            <Description>
              No more switching between different apps, tabs, and tools to keep track of your travel plans.
            </Description>
          </TextSection>
        </ContentWrapper>
      </Section2>
    </>
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
  /* background-color: white; */
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

const Section2 = styled.section`
  display: flex;
  padding: 50px;
  background-color: #f9f9f9;
`;
