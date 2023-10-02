import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import styled from "styled-components";

const Layout = () => {
  return (
    <Container>
      <Header />
      <Outlet />
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: auto;
  min-height: 100vh;
  max-height: fit-content;
  background-color: #fff;
`;
export default Layout;
