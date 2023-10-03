import styled from "styled-components";
import SideBar from "../../Components/SideBar/SideBar";
import Post from "../../Components/Post/Post";

const Home = () => {
  return (
    <Container>
      <SideBar />
      <Post />
      <div className="white"></div>
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
  @media (max-width: 768px) {
    width: 100%;
    grid-template-columns: 1fr;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 100%;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    padding: 0 50px;
    .white {
      display: none;
    }
  }
  @media (min-width: 1025px) and (max-width: 1279px) {
    width: 100%;
    grid-template-columns: 255.333px 400px 10px;
  }
`;
export default Home;
