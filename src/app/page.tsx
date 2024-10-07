'use client';

import Head from 'next/head';
import Image from 'next/image';
import styled from 'styled-components';

import planGif from '@/public/list.gif';
import planImg from '@/public/planMap.png';
import bgImage from '@/public/travel.jpg';

const HomePage = () => {
  return (
    <>
      <Head>
        <title>PlanWander - 為每個人設計的旅行規劃工具</title>
        <meta name="description" content="PlanWander 是一個免費的旅行規劃網站，讓您輕鬆安排並規劃旅程。" />
        <meta name="keywords" content="旅行, 行程規劃, 度假, 旅程, 旅遊地圖" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="PlanWander - 為每個人設計的旅行規劃工具" />
        <meta property="og:description" content="PlanWander 是一個免費的旅行規劃網站，讓您輕鬆安排並規劃旅程" />
        <meta property="og:image" content="/travel.jpg" />
        <meta property="og:type" content="website" />
      </Head>
      <PageWrapper>
        <ContentWrapper>
          <TextSection>
            <Heading>隨心所欲規劃你的下一次冒險！</Heading>
            <Description>
              PlanWander
              是為每個人設計的旅行規劃工具，不論是輕鬆的週末遊還是長途冒險，這裡讓你輕鬆安排旅程，出發無負擔！
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
      <Section2>
        <ImageSection2>
          <StyledImage src={planImg} alt="Travel plan image" quality={100} />
          <OverlayGif src={planGif} alt="Travel plan gif" quality={100} />
        </ImageSection2>
        <ContentWrapper2>
          <TextSection>
            <Heading>一站式旅程安排和地圖操作</Heading>
            <Description>告別繁瑣的工具切換，PlanWander 讓你輕鬆規劃旅行，地圖和行程一目了然。</Description>
          </TextSection>
        </ContentWrapper2>
      </Section2>
      <Section3>
        <ContentWrapper2>
          <TextSection>
            <Heading>互動式旅程分享，地圖與內容一目了然</Heading>
            <Description>隨著行程文章瀏覽地圖，跟隨每個景點的步伐，仿佛親身走過每一段旅程。</Description>
          </TextSection>
        </ContentWrapper2>
        <ImageSection2>
          <StyledVideo autoPlay loop muted>
            <source src="/articleVideo.mp4" type="video/mp4" />
            您的瀏覽器不支援影片播放。
          </StyledVideo>
        </ImageSection2>
      </Section3>
      <Section4>
        <Section4Title>準備好用一半的時間完成你的旅行計劃了嗎？</Section4Title>
        <ButtonGroup>
          <StartButton>Start planning</StartButton>
        </ButtonGroup>
      </Section4>
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
  font-weight: 500;
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
    background-color: white;
    color: #78b7cc;
    border: 2px solid #78b7cc;
  }
`;

const ImageSection = styled.div`
  position: relative;
  width: 50%;
  height: 100vh;
  overflow: hidden;
`;

const ImageSection2 = styled.div`
  position: relative;
  width: 55%;
  height: 100vh;
  overflow: hidden;
`;

const StyledImage = styled(Image)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 450px;
  object-fit: contain;
  border-radius: 20px;
  z-index: 5;
`;

const OverlayGif = styled(Image)`
  position: absolute;
  top: 35%;
  width: 360px;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
  z-index: 10;
`;

const Section2 = styled.section`
  display: flex;
  padding: 20px 50px;
  background-color: #fafafa;
  justify-content: center;
`;

const Section3 = styled.section`
  display: flex;
  padding: 20px 50px;
  background-color: #ffffff;
  justify-content: center;
`;

const ContentWrapper2 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 50px;
  width: 45%;
`;

const StyledVideo = styled.video`
  position: absolute;
  width: 100%;
  object-fit: cover;
  border-radius: 10px;
  z-index: 5;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Section4 = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 50px;
  background-color: #f9f9f9;
  text-align: center;
  height: 500px;
`;

const Section4Title = styled.div`
  color: #2c3e50;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 20px;
`;
