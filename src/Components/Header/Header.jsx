// Import the Navbar component and styled-components library for styling
import Navbar from "../Navbar/Navbar";
import styled from "styled-components";

// Define the Header component
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

  position: sticky;
  top: 0;

  background-color: white;

  z-index: 100;

  // Media queries for responsive design
  @media (max-width: 768px) {
    width: 100vw; // Full width for smaller screens
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    width: 100%; // Full width for medium-sized screens
  }
  @media (min-width: 1025px) and (max-width: 1279px) {
    width: 99.2vw; // Adjusted width for tablet devices
  }
`;

export default Header;
