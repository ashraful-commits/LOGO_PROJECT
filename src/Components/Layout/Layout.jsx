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
  width: 99vw;

  min-height: 100vh;

  max-height: fit-content;

  background-color: #fff;

  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 100%;
  }
`;

export default Layout;
