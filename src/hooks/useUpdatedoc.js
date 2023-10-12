import { doc, getFirestore, updateDoc } from "firebase/firestore";

import { app } from "../firebase.confige";
import { toast } from "react-toastify";
import { useState } from "react";

const useUpdateDoc = async({collectionName,initialState,setOpen}) => {
  
    const [input,setInput] = useState(initialState)
    const [post,setPost] = useState([])
    const [Id,setId] = useState([])
  
      try {
        const db = getFirestore(app);
        const postRef = doc(db, collectionName, Id);
        await updateDoc(postRef, input);
        // Optionally, update the local state with the updated data
        setPost((prevPosts) =>
          prevPosts.map((post) =>
            post.postId === Id ? { ...post, ...input } : post
          )
        );
        setId(null);
        setOpen(false);
        toast.success("Post updated", {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } catch (error) {
        console.error("Error updating post: ", error);
      }
  return {setInput,post,setId}
};

export default useUpdateDoc;
