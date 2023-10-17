//======== Import the Navbar component and styled-components library for styling
import Navbar from "../Navbar/Navbar";
import styled from "styled-components";

//========== Define the Header component
const Header = () => {
  return (
    <HeaderContainer>
      <Navbar />
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  width: 100%;

  box-shadow: 0px 12px 42px -4px rgba(24, 39, 75, 0.12),
    0px 8px 18px -6px rgba(24, 39, 75, 0.12);

  display: flex;
  justify-content: center;
  margin: 0 auto;
  position: sticky;
  top: 0;

  background-color: white;

  z-index: 100;

  // Media queries for responsive design
  @media (max-width: 767px) {
    width: 100; // Full width for smaller screens
  }
  @media (min-width: 768px) and (max-width: 1023px) {
    width: 100%; // Full width for medium-sized screens
  }
  @media (min-width: 1024px) and (max-width: 1365px) {
    width: 100%;
  }
`;

export default Header;
