import styled from "styled-components";
import SideBar from "../../Components/SideBar/SideBar";
import Post from "../../Components/Post/Post";

const Home = () => {
  //========= Render the 'Post' component.
  return (
    <Container>
      {/*============sidebar container  */}
      <SideBar />
      {/*============= post container  */}
      <Post />
      <div className="white"></div>
    </Container>
  );
};
// =============Styled component for the main container
const Container = styled.div`
  /*================ Default styles for the container */
  width: 1165px;
  min-height: 100vh;
  padding-top: 33.5px;
  display: grid;
  gap: 109px;
  margin: 0 auto;
  grid-template-columns: 255.333px auto auto;

  /*================= Responsive design using media queries */
  @media (max-width: 767px) {
    width: 100%;
    grid-template-columns: 1fr;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    width: 100%;
    grid-template-columns: 255.333px auto;
    gap: 10px;
    padding: 0 50px;

    /* ==============Hide the "white" element on medium-sized screens */
    .white {
      display: none;
    }
  }

  @media (min-width: 1024px) and (max-width: 1365px) {
    width: 100vw;
    grid-template-columns: 255.333px auto;
    padding: 0 100px;
    gap: 50px;
  }
`;

export default Home;
