import styled from 'styled-components';

const Sidebar = () => {
  return (
    <SidebarContainer>
      <SidebarWrapper>
        <SidebarItem></SidebarItem>
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
`;

const SidebarItem = styled.div``;
