'use client';

import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useTransition } from 'react';
import styled from 'styled-components';

import LoadingAnimation from '@/components/Loading';
import LoginModal from '@/components/LoginModal';
import { useModalStore } from '@/lib/store';
import bgImage from '@/public/travel.jpg';

const HomePage = () => {
  const router = useRouter();
  const sectionOneRef = useRef<HTMLDivElement | null>(null);
  const sectionTwoRef = useRef<HTMLDivElement | null>(null);
  const sectionThreeRef = useRef<HTMLDivElement | null>(null);
  const { isModalOpen, openModal, closeModal, modalType } = useModalStore();
  const [isPending, startTransition] = useTransition();
  const handleToProfile = () => {
    startTransition(() => {
      router.push('/profile');
    });
  };
  useEffect(() => {
    function handleScroll() {
      const windowPos = window.scrollY;

      if (sectionOneRef.current && windowPos > 150) {
        sectionOneRef.current.style.opacity = '1';
      }

      if (sectionTwoRef.current && windowPos > 200 + 605 * 0.85 + 150) {
        sectionTwoRef.current.style.opacity = '1';
      }

      if (sectionThreeRef.current && windowPos > 200 + 605 * 0.85 + 200 + 658 * 0.85 + 150) {
        sectionThreeRef.current.style.opacity = '1';
      }
    }

    window.removeEventListener('scroll', () => handleScroll());
    window.addEventListener('scroll', () => handleScroll());

    return () => window.removeEventListener('scroll', () => handleScroll());
  }, []);
  return (
    <>
      {isPending && <LoadingAnimation />}
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
            <Heading>A travel planner for everyone</Heading>
            <Description>
              Organize your trip and map it out on a free travel website designed for vacation planning.
            </Description>
            <ButtonGroup>
              <StartButton onClick={() => openModal('login')}>Start planning</StartButton>
            </ButtonGroup>
          </TextSection>
        </ContentWrapper>
        <ImageSection>
          <Image src={bgImage} alt="Travel planning" layout="fill" objectFit="cover" quality={100} />
        </ImageSection>
      </PageWrapper>

      <DetailWrapper>
        <DetailSection ref={sectionOneRef}>
          <StyledVideo autoPlay loop muted>
            <source src="/searchVideo.mp4" type="video/mp4" />
          </StyledVideo>
          <Details>
            <Heading>
              Your itinerary and your map <br />
              in one view
            </Heading>
            <br />
            <Description>
              No more switching between different apps, tabs, and tools to keep track of your travel plans.
            </Description>
          </Details>
        </DetailSection>

        <DetailSection style={{ justifyContent: 'flex-end' }} ref={sectionTwoRef}>
          <Detail2>
            <div style={{ width: '100%', height: '45px' }}></div>
            <Heading>
              Easily Edit Your Itinerary with <br /> Drag-and-Drop
            </Heading>
            <br />
            <Description>Quickly organize your trip by dragging and dropping to adjust your itinerary.</Description>
          </Detail2>
          <StyledVideo autoPlay loop muted>
            <source src="/dropVideo.mp4" type="video/mp4" style={{ objectFit: 'cover' }} />
          </StyledVideo>
        </DetailSection>
        <DetailSection ref={sectionThreeRef}>
          <StyledVideo autoPlay loop muted>
            <source src="/articleVideo.mp4" type="video/mp4" />
          </StyledVideo>
          <Detail3>
            <Heading>Read stories along with map</Heading>
            <br />
            <Description>
              Browse the map alongside travel stories, following in the footsteps of each attraction as if you were
              experiencing every part of the journey firsthand.
            </Description>
          </Detail3>
        </DetailSection>
      </DetailWrapper>
      <Section4>
        <Section4Title>Ready to plan your trip in half the time?</Section4Title>
        <ButtonGroup>
          <StartButton onClick={() => openModal('login')}>Start planning</StartButton>
        </ButtonGroup>
      </Section4>
      {isModalOpen && modalType === 'login' && <LoginModal onClose={closeModal} onLoginSuccess={handleToProfile} />}
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

const DetailWrapper = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const DetailSection = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  margin: 0 auto;
  position: relative;
  padding-top: 100px;
  padding-bottom: 100px;
  opacity: 0;
  transition: all 1s ease-in-out;
`;

const Details = styled.div`
  width: 500px;
  position: absolute;
  right: -50px;
  color: white;
`;

const Detail2 = styled.div`
  width: 500px;
  position: absolute;
  left: 0;
  color: white;
`;

const Detail3 = styled.div`
  width: 500px;
  position: absolute;
  right: 0;
  color: white;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 50px;
  width: 50%;
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

const StyledVideo = styled.video`
  width: 100%;
  height: auto;
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
  gap: 50px;
`;

const Section4Title = styled.div`
  color: #2c3e50;
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 20px;
`;
