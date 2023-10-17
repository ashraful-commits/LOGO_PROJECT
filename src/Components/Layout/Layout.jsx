import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import styled from "styled-components";

const Layout = () => {
  return (
    <Container>
      <div className="container">
        <Header />
        <Outlet />
      </div>
    </Container>
  );
};

//
const Container = styled.div`
  width: 100vw;

  min-height: 100vh;

  max-height: fit-content;
  margin: 0 auto;
  background-color: white;

  display: flex;
  justify-content: center;
  .container {
    width: 100%;
  }
  @media (max-width: 767px) {
    width: 100vw; // Full width for smaller screens
  }
`;

export default Layout;
