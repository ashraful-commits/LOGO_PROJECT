import { deleteDoc, doc, getFirestore } from "firebase/firestore";


const useDeleteDoc = async({collectionName,id,setPost}) => {
    const db = getFirestore();
    const DocRef = doc(db,collectionName, id);

    try {
      await deleteDoc(DocRef);
      // Optionally, update the local state to remove the deleted post
      setPost((prevPosts) => prevPosts.filter((post) => post.postId !== id));
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
};

export default useDeleteDoc;
