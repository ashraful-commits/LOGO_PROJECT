import styled from "styled-components";
import SideBar from "../../Components/SideBar/SideBar";

const Home = () => {
  return (
    <Container>
      <SideBar />
      <div></div>
      <div></div>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  padding: 2rem 9rem;
  max-height: fit-content;
  display: grid;
  grid-template-columns: 20% 40% 20%;
`;
export default Home;
