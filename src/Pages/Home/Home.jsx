import styled from "styled-components";
import SideBar from "../../Components/SideBar/SideBar";
import Post from "../../Components/Post/Post";

const Home = () => {
  return (
    <Container>
      <SideBar />
      <Post />
      <div></div>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  padding: 1.8rem 9rem;
  max-height: fit-content;
  display: grid;
  grid-template-columns: 20% 40% 20%;
`;
export default Home;
