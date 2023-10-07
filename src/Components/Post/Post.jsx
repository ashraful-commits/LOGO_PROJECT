// Import necessary libraries and components.
import styled from "styled-components";
import PostComponent from "../PostComponent/PostComponent";
import { useEffect, useState } from "react";

import { collection, getDocs, getFirestore, limit } from "firebase/firestore";

// Define the 'Post' component.
const Post = () => {
  // State to hold the post data fetched from an API.
  const [post, setPost] = useState([]);

  // Use the useEffect hook to fetch data when the component mounts.
  useEffect(() => {
    const getAllPost = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "Posts"));
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        setPost((prev) => [...prev, doc.data()]);
      });
    };
    getAllPost();
  }, []); // The empty dependency array ensures this effect runs only once.

  // Render the 'Post' component.
  return (
    <PostContainer>
      {post.map((item, index) => {
        // Map over the 'post' array and render 'PostComponent' instances for each item.
        return (
          <PostComponent
            key={index} // Unique 'key' prop is essential for efficient rendering.
            desc={item.desc}
            thumbnailUrl=""
            videoUrl={item.video}
            avatar={item.avatar}
            email={item.email}
            name={item.name}
            title={item.title}
            id={item.id}
          />
        );
      })}
    </PostContainer>
  );
};

// Styled component for the container of 'Post' components.
const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 52px;

  // Media query for smaller screens.
  @media (max-width: 768px) {
    width: 100%;
  }

  // Media query for screens between 300px and 768px.
  @media (min-width: 300px) and (max-width: 768px) {
    gap: 32px;
  }

  // Media query for screens between 769px and 1024px.
  @media (min-width: 769px) and (max-width: 1024px) {
    margin-top: 50px;
    top: 33%;
  }
`;

// Export the 'Post' component as the default export.
export default Post;
