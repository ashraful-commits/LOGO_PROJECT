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

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPoset, setTotalPoset] = useState(1);
  const totalPost = async () => {
    const db = getFirestore();
    const postsRef = collection(db, "Posts");
    const querySnapshot = await getDocs(postsRef);
    setTotalPoset(querySnapshot.docs.length);
  };
  const fetchMoreData = async () => {
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);

      const db = getFirestore();
      const postsRef = collection(db, "Posts");
      let queryPosts;

      if (lastVisible) {
        // If we have a lastVisible document, use it to fetch the next batch
        queryPosts = query(
          postsRef,
          orderBy("timestamp", "desc"),
          startAfter(lastVisible),
          limit(3 * currentPage)
        );
      } else {
        // If there's no lastVisible document, fetch the initial data
        queryPosts = query(postsRef, orderBy("timestamp", "desc"), limit(3));
      }

      const querySnapshot = await getDocs(queryPosts);

      const allPosts = [];

      for (const docData of querySnapshot.docs) {
        const postData = docData.data();

        const userId = postData.id; // Assuming userId is a field in your post data
        const userDocRef = doc(db, "users", userId);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          postData.user = userData;
          allPosts.push(postData);
        } else {
          console.log("User does not exist for post with userId: ", userId);
        }
      }
      if (totalPoset <= allPosts.length) {
        setPosts((prevPosts) => [...prevPosts, ...allPosts]);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

        setIsLoading(false); // Change this to false
        setCurrentPage((prevPage) => prevPage + 1);
      } else {
        setPosts(allPosts);
        setIsLoading(false); // This is correct
        setLastVisible(null);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollY + windowHeight >= documentHeight - 200) {
      fetchMoreData();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Fetch initial data when the component mounts
    fetchMoreData();
    totalPost();
  }, []); // This useEffect runs only once when the component mounts.

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <PostContainer>
        {posts.length > 0 ? (
          posts.map((item, index) => (
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
            />
          ))
        ) : (
          <Box>{!isLoading && <Typography>No post found</Typography>}</Box>
        )}

        {/* Show loader while loading data */}
      </PostContainer>
      {isLoading && (
        <Box
          sx={{
            width: "100%",
            height: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            style={{ width: "50px" }}
            src="https://bestanimations.com/media/loading-gears/1575100148loading-gear-6.gif"
          />
        </Box>
      )}
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
    }
  }
`;

// Export the 'Post' component as the default export.
export default Post;
