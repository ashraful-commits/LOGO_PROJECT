import { collection, getFirestore, onSnapshot, query } from "firebase/firestore";

const getAllData = async (collectionName) => {
  return new Promise((resolve, reject) => {
    const db = getFirestore(); // Create a Firestore instance
    
    // Create a query for the collection
    const q = query(collection(db, collectionName));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let allData = [];
      querySnapshot.forEach((doc) => {
        allData.push({ dataId: doc.id, ...doc.data() });
      });
      resolve(allData);
    });

    return unsubscribe;
  });
};

export default getAllData;
