import { collection, getFirestore, onSnapshot, query, where } from "firebase/firestore";

import { app } from "../firebase.confige";
import { useState } from "react";


const useSingleQuery = ({collectionName,id}) => {
  const [post ,setPost]= useState([])
  const [loader ,setLoader]= useState([])
  const db = getFirestore(app);
    
    const postsRef = collection(db,collectionName);
    const q = query(postsRef, where("id", "==", id));
    try {
        setLoader(true);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const allPosts = [];
          querySnapshot.forEach((doc) => {
            const postData = doc.data();
            const postId = doc.id; // Get the document ID as postId
            const postWithId = { ...postData, postId }; // Add postId to the data
            allPosts.push(postWithId);
          });
  
          setPost(allPosts);
          setLoader(false); // Set to false when data is fetched
        });
  
        return () => {
          // Unsubscribe from the snapshot listener when the component unmounts
          unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoader(false); // Set loader to false in case of an error
      }
      return {post,loader}
      
};


export default useSingleQuery;
