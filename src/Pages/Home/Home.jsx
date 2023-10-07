import styled from "styled-components";
import SideBar from "../../Components/SideBar/SideBar";
import Post from "../../Components/Post/Post";
import { useEffect } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const Home = () => {
  // Use the useEffect hook to fetch data when the component mounts.
  useEffect(() => {
    const getAllPost = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "posts"));
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.data());
      });
    };
    getAllPost();
  }, []); // The empty dependency array ensures this effect runs only once.

  // Render the 'Post' component.
  return (
    <Container>
      {/*sidebar container  */}
      <SideBar />
      {/* post container  */}
      <Post />
      <div className="white"></div>
    </Container>
  );
};
// Styled component for the main container
const Container = styled.div`
  /* Default styles for the container */
  width: 1165px;
  min-height: 100vh;
  padding-top: 33.5px;
  display: grid;
  gap: 109px;
  margin: 0 auto;
  grid-template-columns: 255.333px auto auto;

  /* Responsive design using media queries */
  @media (max-width: 768px) {
    width: 100%;
    grid-template-columns: 1fr;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 100%;
    grid-template-columns: 255.333px auto;
    gap: 10px;
    padding: 0 50px;

    /* Hide the "white" element on medium-sized screens */
    .white {
      display: none;
    }
  }

  @media (min-width: 1025px) and (max-width: 1279px) {
    width: 100vw;
    grid-template-columns: 255.333px auto auto;
  }
`;

export default Home;
