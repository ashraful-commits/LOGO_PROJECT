import { collection, getFirestore, onSnapshot, query } from "firebase/firestore";

const getAllDataWithSnapshot = (collectionName, callback) => {
  const db = getFirestore();
  const q = query(collection(db, collectionName));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const allData = [];
    querySnapshot.forEach((doc) => {
      allData.push({ dataId: doc.id, ...doc.data() });
    });
    callback(allData);
  });

  return unsubscribe;
};

export default getAllDataWithSnapshot;
