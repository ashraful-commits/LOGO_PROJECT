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
  position: sticky;
  top: 0; /* Specify the top position where it becomes sticky */
  background-color: white; /* You may want to specify a background color */
  z-index: 100; /* Adjust the z-index as needed */
  @media (max-width: 768px) {
    width: 100%;
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    width: 100%;
  }
  @media (min-width: 1025px) and (max-width: 1279px) {
    /* Styles for tablet devices */
    width: 100%;
  }
`;
export default Header;
