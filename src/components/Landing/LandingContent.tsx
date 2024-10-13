'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import styled from 'styled-components';

const ClientAction = dynamic(() => import('@/components/Landing/ClientActions'), { ssr: false });

const LandingPageContent = () => {
  return (
    <>
      {/* <DetailWrapper>
        <DetailSection>
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
        <DetailSection>
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
        <DetailSection>
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
      </DetailWrapper> */}
      <Section4>
        <Section4Title>Ready to plan your trip in half the time?</Section4Title>
        <ButtonGroup>
          <ClientAction />
        </ButtonGroup>
      </Section4>
    </>
  );
};

export default LandingPageContent;

// const PageWrapper = styled.div`
//   display: flex;
//   height: 100vh;
//   width: 100vw;
//   position: relative;
//   overflow: hidden;
// `;

// const DetailWrapper = styled.div`
//   width: 100vw;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   position: relative;
// `;

// const DetailSection = styled.div`
//   width: 100%;
//   max-width: 1200px;
//   display: flex;
//   align-items: center;
//   margin: 0 auto;
//   position: relative;
//   padding-top: 100px;
//   padding-bottom: 100px;
//   opacity: 0;
//   transition: all 1s ease-in-out;
// `;

// const Details = styled.div`
//   width: 500px;
//   position: absolute;
//   right: -50px;
//   color: white;
// `;

// const Detail2 = styled.div`
//   width: 500px;
//   position: absolute;
//   left: 0;
//   color: white;
// `;

// const Detail3 = styled.div`
//   width: 500px;
//   position: absolute;
//   right: 0;
//   color: white;
// `;

// const ContentWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   padding: 0 50px;
//   width: 50%;
// `;

// const TextSection = styled.div`
//   max-width: 600px;
// `;

// const Heading = styled.h1`
//   font-size: 48px;
//   color: #2c3e50;
//   font-weight: bold;
// `;

// const Description = styled.p`
//   font-size: 20px;
//   font-weight: 500;
//   color: #6c757d;
//   margin: 30px 0;
//   line-height: 1.5;
//   letter-spacing: 0.2px;
// `;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
`;

// const StartButton = styled.button`
//   padding: 15px 20px;
//   background-color: #78b7cc;
//   color: white;
//   border: none;
//   border-radius: 25px;
//   font-size: 18px;
//   font-weight: 700;
//   cursor: pointer;

//   &:hover {
//     background-color: white;
//     color: #78b7cc;
//     border: 2px solid #78b7cc;
//   }
// `;

// const ImageSection = styled.div`
//   position: relative;
//   width: 50%;
//   height: 100vh;
//   overflow: hidden;
// `;

// const StyledVideo = styled.video`
//   width: 100%;
//   height: auto;
// `;

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
