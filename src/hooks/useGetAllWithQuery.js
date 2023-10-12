import { collection, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, startAfter } from "firebase/firestore";
import  { useState } from "react";

const useGetAllWithQuery =async ({collectionName}) => {
    const [isLoading,setIsLoading]= useState(false)
    const [lastVisible,setLastVisible]= useState(null)
    const [currentPage,setCurrentPage]= useState(1)
    const [data,setData]= useState([])
    if (isLoading) {
        return;
      }
  
      try {
        setIsLoading(true);
  
        const db = getFirestore();
        const postsRef = collection(db, collectionName);
        let queryPosts;
  
        if (lastVisible) {
          queryPosts = query(
            postsRef,
            orderBy("timestamp", "desc"),
            startAfter(lastVisible),
            limit(3 * currentPage)
          );
        } else {
          queryPosts = query(postsRef, orderBy("timestamp", "desc"), limit(3));
        }
  
        const querySnapshot = await getDocs(queryPosts);
  
        const allPosts = [];
  
        for (const docData of querySnapshot.docs) {
          const postData = { postId: docData.id, ...docData.data() };
          const userId = postData.id;
          const userDocRef = doc(db, "users", userId);
  
          const userSnapshot = await getDoc(userDocRef);
  
          console.log(userSnapshot);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            postData.user = userData;
            allPosts.push(postData);
          } else {
            console.log("User does not exist for post with userId: ", userId);
          }
        }
  
        if (allPosts.length > 0) {
          setData((prevPosts) => [...prevPosts, ...allPosts]);
          setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
  
          setIsLoading(false); // Change this to false
          setCurrentPage((prevPage) => prevPage + 1);
        } else {
          setIsLoading(false); // This is correct
          setLastVisible(null);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
      return {data,isLoading,}
};

export default useGetAllWithQuery;


