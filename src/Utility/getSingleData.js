import { collection, getFirestore, onSnapshot, query, where } from "firebase/firestore";


const getSingleData = async (collectionName, id) => {
    return new Promise((resolve, reject) => {
      const db = getFirestore();
      const q = query(collection(db, collectionName, where("id", "===", id)));
  
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let allData = [];
        querySnapshot.forEach((doc) => {
          allData.push({ dataId: doc.id, ...doc.data() });
        });
        resolve(allData);
      }, (error) => {
        console.error("Error in onSnapshot:", error);
        reject(error); 
      });
  
      return unsubscribe;
    });
  };
  
  export default getSingleData