import { doc, getFirestore, getDoc } from "firebase/firestore";

const getDocumentById = async (collectionName, documentId) => {
  const db = getFirestore();
  const docRef = doc(db, collectionName, documentId);

  try {
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.log("Document not found.");
      return null;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
};

export default getDocumentById;
