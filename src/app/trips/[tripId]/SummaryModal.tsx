// import { useRef } from 'react';
// import { IoMdClose } from 'react-icons/io';
// import styled from 'styled-components';

// interface TripData {
//   tripTitle: string;
//   startDate: Date;
//   endDate: Date;
// }

// interface ModalProps {
//   onClose: () => void;
//   tripData: TripData | null;
// }

// const SummaryModal: React.FC<ModalProps> = ({ onClose, tripData }) => {
//   const textAreaRef = useRef(null);
//   const handleCopy = () => {
//     if (textAreaRef.current) {
//       navigator.clipboard
//         .writeText(textAreaRef.current.value)
//         .then(() => {
//           alert('行程內容已複製到剪貼板');
//         })
//         .catch((err) => {
//           console.error('複製失敗', err);
//         });
//     }
//   };

//   const formatTripSummary = () => {
//     let summary = `${tripData?.tripTitle}\n\n`;
//     tripData?.days.forEach((day, index) => {
//       summary += `Day ${index + 1} (${day.date})\n`;
//       day.places.forEach((place) => {
//         summary += `${place.startTime}-${place.endTime} ${place.name}\n`;
//       });
//       summary += '\n';
//     });
//     return summary;
//   };

//   return (
//     <Overlay>
//       <Modal>
//         <CloseBtnWrapper onClick={onClose}>
//           <CloseBtn />
//         </CloseBtnWrapper>
//         <Content>
//           <Title>Trip Summary</Title>
//           <TripTitle>{tripData?.tripTitle}</TripTitle>
//           <textarea
//             ref={textAreaRef}
//             readOnly
//             value={formatTripSummary()}
//             style={{ width: '100%', height: '300px', border: 'none', resize: 'none', fontSize: '16px' }}
//           />
//           <ButtonWrapper>
//             <Button onClick={handleCopy}>Copy</Button>
//           </ButtonWrapper>
//         </Content>
//       </Modal>
//     </Overlay>
//   );
// };

// export default SummaryModal;

// const Overlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100vw;
//   height: 100vh;
//   background-color: rgba(0, 0, 0, 0.5);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   z-index: 10;
// `;

// const Modal = styled.div`
//   background-color: white;
//   padding: 64px 48px 48px 48px;
//   border-radius: 25px;
//   /* width: 450px; */
//   position: relative;
//   border: 1px solid rgba(0, 0, 0, 0.2);
// `;

// const Content = styled.div`
//   padding: 0;
// `;

// const CloseBtn = styled(IoMdClose)`
//   cursor: pointer;
//   position: absolute;
//   top: 15px;
//   right: 15px;
//   font-size: 24px;
// `;

// const CloseBtnWrapper = styled.button`
//   cursor: pointer;
//   position: absolute;
//   top: 15px;
//   right: 15px;
//   background: none;
//   border: none;
//   font-size: 24px;
// `;

// const ButtonWrapper = styled.div`
//   display: flex;
//   justify-content: end;
// `;

// const Button = styled.button`
//   margin-top: 40px;
//   width: auto;
//   border-radius: 25px;
//   padding: 15px;
//   border: none;
//   text-align: center;
//   font-size: 14px;
//   font-weight: 600;
//   color: white;
//   cursor: pointer;
//   background-color: #78b7cc;
//   &:hover {
//     border-color: #94c3d2;
//   }
// `;

// //以上modal 元件應該要共用

// const Title = styled.h2`
//   font-size: 20px;
//   font-weight: 500;
//   color: #333;
//   margin-bottom: 15px;
// `;

// const TripTitle = styled.h3`
//   font-size: 14px;
//   font-weight: 500;
//   color: #333;
//   margin-bottom: 10px;
// `;
