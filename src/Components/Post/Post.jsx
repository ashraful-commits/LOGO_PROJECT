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
  display: flex;
  flex-direction: column;

  gap: 52px;
`;
export default Post;
