import styled from 'styled-components';

const Sidebar = ({ days, activeDate, onDateClick }) => {
  return (
    <SidebarContainer>
      <SidebarWrapper>
        {days.map((day, index) => (
          <DateButton key={index} isActive={activeDate === day.date} onClick={() => onDateClick(day.date)}>
            {new Date(day.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </DateButton>
        ))}
      </SidebarWrapper>
    </SidebarContainer>
  );
};

export default Sidebar;

const SidebarContainer = styled.div`
  margin-top: 54px;
`;

const SidebarWrapper = styled.div`
  width: 50px;
  height: calc(100% - 54px);
  position: fixed;
  background-color: #fff;
  border-right: 1px solid #dee2e6;
  /* z-index: 50; */
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DateButton = styled.button`
  background-color: ${(props) => (props.isActive ? '#aacaed' : 'transparent')};
  color: ${(props) => (props.isActive ? '#fff' : '#000')};
  border: none;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 15px;
  cursor: pointer;
  width: 100%;
  text-align: center;
  font-size: 14px;

  &:hover {
    background-color: #aacaed;
    color: white;
  }

  &:focus {
    outline: none;
  }
`;
