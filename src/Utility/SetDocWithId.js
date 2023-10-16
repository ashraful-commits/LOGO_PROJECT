import { doc, getFirestore, setDoc } from "firebase/firestore";

const setDocumentWithId = async (collectionName, documentId, data) => {
  const db = getFirestore();
  const docRef = doc(db, collectionName, documentId);

  try {
    await setDoc(docRef, data);
    console.log("Document with ID set successfully.");
  } catch (error) {
    console.error("Error setting document: ", error);
  }
};

export default setDocumentWithId;
