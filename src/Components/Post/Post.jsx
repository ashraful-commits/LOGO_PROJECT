import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  orderBy,
  limit,
  getDoc,
  doc,
  startAfter,
} from "firebase/firestore";
import styled from "styled-components";
import PostComponent from "../PostComponent/PostComponent";
import { Box, Typography } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(2);
  const [lastPost, setLastPost] = useState(null);
  const [isLoading, SetIsLoading] = useState(false);
  const fetchMoreData = async () => {
    if (hasMore) {
      try {
        const db = getFirestore();
        const q = query(
          collection(db, "Posts"),
          limit,
          lastPost ? startAfter(lastPost) : null
        );

        const data = await getDocs(q);
        const newPosts = data.docs;

        if (newPosts.length === 0) {
          setHasMore(false);
        } else {
          setLastPost(newPosts[newPosts.length - 1]);
          setPosts([...posts, ...newPosts]);
        }
      } catch (error) {
        console.error("Error fetching more data:", error);
      }
    } else {
      setHasMore(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();
        const q = query(collection(db, "Posts"), limit);

        const data = await getDocs(q);
        const initialPosts = data.docs;

        if (initialPosts.length > 0) {
          setLastPost(initialPosts[initialPosts.length - 1]);
          const allPosts = await Promise.all(
            initialPosts.map(async (post) => {
              const postData = { postId: post.id, ...post.data() };
              const userId = postData.id;
              const userDocRef = doc(db, "users", userId);
              const userSnapshot = await getDoc(userDocRef);

              if (userSnapshot.exists()) {
                postData.user = userSnapshot.data();
              } else {
                console.log(
                  "User does not exist for post with userId: ",
                  userId
                );
              }
              return postData;
            })
          );
          setPosts(allPosts);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchData();
  }, [limit]);
  // This useEffect runs only once when the component mounts.

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <PostContainer>
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <img
              style={{ width: "50px" }}
              src="https://bestanimations.com/media/loading-gears/1575100148loading-gear-6.gif"
            />
          }
          endMessage="No more post!"
        >
          {posts.length > 0 &&
            posts
              .filter((item) => item.status === true)
              .map((item, index) => (
                <PostComponent
                  key={index}
                  desc={item.desc}
                  thumbnailUrl=""
                  videoUrl={item.video}
                  avatar={item.user.photoURL}
                  email={item.user.email}
                  name={item.user.name}
                  title={item.title}
                  id={item.id}
                  postId={item.postId}
                  Like={item.Like}
                  posts={posts}
                  messages={item.messages}
                />
              ))}
        </InfiniteScroll>
      </PostContainer>
    </Box>
  );
};
// Styled component for the container of 'Post' components.
const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: 52px;
  .infinite-scroll-component {
    text-align: center;
    overflow: hidden !important;
    min-height: 100vh;
    max-height: fit-content;
  }
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
  .infinite-scroll-component__outerdiv {
    margin: 0 auto;
    .infinite-scroll-component {
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      row-gap: 30px;
    }
  }
`;

// Export the 'Post' component as the default export.
export default Post;
