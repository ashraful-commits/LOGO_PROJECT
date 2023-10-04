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

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  max-height: fit-content;
  background-color: #fff;
  display: flex;
  justify-content: center;
  @media (max-width: 768px) {
    width: 99vw;
  }
`;
export default Layout;
