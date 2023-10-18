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
  margin: 0 auto;
  background-color: white;

  display: flex;
  justify-content: center;
  .container {
    width: 99vw;
  }
  @media (max-width: 767px) {
    width: 100%;
  }
  @media (min-width: 768px) and (max-width: 1023px) {
    width: 100%;
  }
  @media (min-width: 1024px) and (max-width: 1365px) {
    width: 100%;
  }
`;

export default Layout;
