// 'use client';

// import styled, { keyframes } from 'styled-components';

// const l4 = keyframes`
//   to {
//     clip-path: inset(0 -1ch 0 0);
//   }
// `;

// const Loader = styled.div`
//   width: fit-content;
//   font-weight: bold;
//   font-family: monospace;
//   font-size: 30px;
//   clip-path: inset(0 3ch 0 0);
//   animation: ${l4} 1s steps(4) infinite;

//   &:before {
//     content: 'Loading...';
//   }
// `;

// const FullScreenLoader = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
//   width: 100vw;
// `;

// export default function Loading() {
//   return (
//     <FullScreenLoader>
//       <Loader />
//     </FullScreenLoader>
//   );
// }
