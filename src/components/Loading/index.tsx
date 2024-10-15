import Lottie from 'react-lottie-player';
import styled from 'styled-components';

import loadingGif from '@/public/earth.json';

const LoadingAnimation = () => {
  return (
    <LoadingContainer>
      <Lottie loop animationData={loadingGif} play style={{ width: 400, height: 400 }} />
    </LoadingContainer>
  );
};

export default LoadingAnimation;

const LoadingContainer = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: rgb(255, 255, 255);
`;
