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
  width: 1165px;
  min-height: 100vh;
  padding-top: 33.5px;
  display: grid;
  gap: 109px;
  margin: 0 auto;
  grid-template-columns: 255.333px auto auto;
`;
export default Home;
