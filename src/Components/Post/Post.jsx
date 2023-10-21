import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  getDoc,
  doc,
  startAfter,
} from "firebase/firestore";
import styled from "styled-components";
import PostComponent from "../PostComponent/PostComponent";
import { Box } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import getDocumentById from "../../Utility/getSingleData";

const Post = () => {
  //====================al state
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(2);

  const [lastPost, setLastPost] = useState(null);
  //====================fetch more data
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
  //=====================fetch all post data
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

              // Fetch messages for the post
              postData.messages = [];
              for (const element of postData.messages) {
                const newMessages = await Promise.all(
                  element.messages.map(async (message) => {
                    const msgUser = await getDocumentById("users", message.id);
                    return { ...message, user: msgUser };
                  })
                );
                element.messages = newMessages;
              }

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

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <PostContainer>
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <img
              style={{ width: "50px", margin: "0 auto" }}
              src="https://bestanimations.com/media/loading-gears/1575100148loading-gear-6.gif"
            />
          }
          endMessage="No post!"
        >
          {posts.length > 0 &&
            posts
              .filter(
                (item) =>
                  item?.pending === false &&
                  item?.decline === false &&
                  item?.suspended?.status === false
              )
              .map((item, index) => (
                <PostComponent
                  key={index}
                  desc={item.desc}
                  thumbnailUrl=""
                  videoUrl={item.video}
                  avatar={item?.user?.photoURL}
                  email={item?.user?.email}
                  name={item?.user?.name}
                  title={item.title}
                  id={item?.id}
                  postId={item?.postId}
                  Like={item?.Like}
                  posts={posts}
                  messages={item?.messages}
                />
              ))}
        </InfiniteScroll>
      </PostContainer>
    </Box>
  );
};

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
  @media (max-width: 767px) {
    width: 100%;
  }

  // Media query for screens between 300px and 768px.
  @media (min-width: 300px) and (max-width: 766px) {
    gap: 32px;
  }

  // Media query for screens between 769px and 1024px.
  @media (min-width: 768px) and (max-width: 1023px) {
    margin-top: 50px;
    top: 33%;
  }
  // Media query for screens between 769px and 1024px.
  @media (min-width: 1024px) and (max-width: 1365px) {
    margin-top: 50px;
    top: 30%;
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

//======================= Export the 'Post' component as the default export.
export default Post;
