import Lottie from 'react-lottie-player';
import styled from 'styled-components';

import loadingGif from '@/public/earth.json';

const LoadingAnimation = () => {
  return (
    <LoadingContainer>
      {/* <iframe
        src="https://lottie.host/embed/40f5fa89-03f1-4b9b-ab1c-97730792e4e3/ZI9ThIosNU.json"
        width="400"
        height="400"
      ></iframe> */}
      <Lottie loop animationData={loadingGif} play style={{ width: 400, height: 400 }} />
    </LoadingContainer>
  );
};

export default LoadingAnimation;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: rgb(255, 255, 255);
`;
