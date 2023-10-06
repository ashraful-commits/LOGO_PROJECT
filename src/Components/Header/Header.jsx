// Import the Navbar component and styled-components library for styling
import Navbar from "../Navbar/Navbar";
import styled from "styled-components";

// Define the Header component
const Header = () => {
  return (
    // Render the HeaderContainer component, which contains the Navbar
    <HeaderContainer>
      <Navbar />
    </HeaderContainer>
  );
};

// Define the styled HeaderContainer component to style the header
const HeaderContainer = styled.div`
  // Set the width to 99.2% of the viewport width for responsiveness
  width: 99.2vw;
  // Apply a box shadow to create a subtle shadow effect
  box-shadow: 0px 12px 42px -4px rgba(24, 39, 75, 0.12),
    0px 8px 18px -6px rgba(24, 39, 75, 0.12);
  // Use flex to horizontally center the content
  display: flex;
  justify-content: center;
  // Make the header sticky at the top of the viewport
  position: sticky;
  top: 0;
  // Specify a background color for the header (you can customize this)
  background-color: white;
  // Set a z-index to control the stacking order of elements
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

// Export the Header component as the default export
export default Header;
