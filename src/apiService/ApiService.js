import { collection, getDocs, getFirestore, limit } from "firebase/firestore";
import { app } from "../firebase.confige";

export const fetchPosts = async(postsPreload,id)=>{
    const posts = []
    const db = getFirestore(app)
    const querySnapshot = await getDocs(collection(db, "Posts", id),limit(postsPreload));
    const lastVisible =querySnapshot.doc[querySnapshot.length-1]
    querySnapshot.forEach((doc)=>{
        let postData = doc.data()
        postData.postId = doc.id;
        posts.push(postData)
    })
    return {posts,lastVisible}
} 