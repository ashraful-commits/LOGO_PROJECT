// Import necessary libraries and components.
import styled from "styled-components";
import PostComponent from "../PostComponent/PostComponent";
import { useEffect, useState } from "react";

// Define the 'Post' component.
const Post = () => {
  // State to hold the post data fetched from an API.
  const [post, setPost] = useState([]);

  // Use the useEffect hook to fetch data when the component mounts.
  useEffect(() => {
    // Fetch post data from a JSON API.
    fetch(
      "https://gist.githubusercontent.com/poudyalanil/ca84582cbeb4fc123a13290a586da925/raw/14a27bd0bcd0cd323b35ad79cf3b493dddf6216b/videos.json"
    )
      .then((response) => response.json())
      .then((data) => {
        // Log the fetched data to the console (for debugging).
        console.log(data);

        // Update the 'post' state with the fetched data.
        setPost(data);
      })
      .catch((error) => {
        // Handle any errors that occur during the fetch operation.
        console.error("Error:", error);
      });
  }, []); // The empty dependency array ensures this effect runs only once.

  // Render the 'Post' component.
  return (
    <PostContainer>
      {post.map((item, index) => {
        // Map over the 'post' array and render 'PostComponent' instances for each item.
        return (
          <PostComponent
            key={index} // Unique 'key' prop is essential for efficient rendering.
            desc={item.description}
            thumbnailUrl={item.thumbnailUrl}
            videoUrl={item.videoUrl}
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
