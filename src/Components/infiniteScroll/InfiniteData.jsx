import React, { useState, useEffect } from "react";
import {
  getFirestore,
  query,
  collection,
  getDocs,
  doc,
  getDoc,
  startAfter,
} from "firebase/firestore";
import InfiniteScroll from "react-infinite-scroll-component";
import { AiOutlineLoading } from "react-icons/ai";

const InfiniteData = () => {
  const [dataSource, setDataSource] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(2);
  const [lastPost, setLastPost] = useState(null);

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
          setDataSource([...dataSource, ...newPosts]);
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
          setDataSource(allPosts);
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
    <div className="App">
      <InfiniteScroll
        dataLength={dataSource.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<p>...loading</p>}
        endMessage="No more Post"
      >
        {dataSource.map((post) => (
          <div
            style={{
              height: "500px",
              textAlign: "center",
              border: "1px solid gray",
              width: "100vw",
              padding: "30px",
            }}
            key={post.postId}
          >
            <p>{post.title}</p>
            <video src={post.video} controls></video>
            <p>User: {post.user ? post.user.name : "Unknown User"}</p>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default InfiniteData;
