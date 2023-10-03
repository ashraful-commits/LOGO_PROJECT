import styled from "styled-components";
import PostComponent from "../PostComponent/PostComponent";
import { useEffect, useState } from "react";

const Post = () => {
  const [post, setPost] = useState([]);
  useEffect(() => {
    fetch(
      "https://gist.githubusercontent.com/poudyalanil/ca84582cbeb4fc123a13290a586da925/raw/14a27bd0bcd0cd323b35ad79cf3b493dddf6216b/videos.json"
    )
      .then((response) => response.json())
      .then((data) => {
        // Now you can work with the 'data' object here
        console.log(data);
        setPost(data);
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error("Error:", error);
      });
  }, []);
  return (
    <PostContainer>
      {post.map((item, index) => {
        return (
          <PostComponent
            key={index}
            desc={item.description}
            thumbnailUrl={item.thumbnailUrl}
            videoUrl={item.videoUrl}
            title={item.title}
          />
        );
      })}
    </PostContainer>
  );
};
const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 52px;
  @media (max-width: 768px) {
    width: 100%;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    margin-top: 50px;
  }
`;
export default Post;
