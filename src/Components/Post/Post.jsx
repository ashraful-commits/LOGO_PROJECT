import styled from "styled-components";
import PostComponent from "../PostComponent/PostComponent";

const Post = () => {
  return (
    <PostContainer>
      <PostComponent />
      <PostComponent />
    </PostContainer>
  );
};
const PostContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;
export default Post;
