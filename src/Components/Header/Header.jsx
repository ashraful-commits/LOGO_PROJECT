import React from "react";
import Navbar from "../Navbar/Navbar";
import styled from "styled-components";

const Header = () => {
  return (
    <HeaderContainer>
      <Navbar />
    </HeaderContainer>
  );
};
const HeaderContainer = styled.div`
  width: 99.2vw;
  box-shadow: 0px 12px 42px -4px rgba(24, 39, 75, 0.12),
    0px 8px 18px -6px rgba(24, 39, 75, 0.12);
  display: flex;
  justify-content: center;
`;
export default Header;
