import { doc, getFirestore, deleteDoc, getDoc } from "firebase/firestore";

const deleteDocument = async (collectionName, documentId) => {
  const db = getFirestore();
  const docRef = doc(db, collectionName, documentId);

  try {
    const deletedDoc = await getDoc(docRef);
    await deleteDoc(docRef);
    return deletedDoc.exists ? deletedDoc.data() : null;
  } catch (error) {
    console.error("Error deleting document: ", error);
    return null;
  }
};

export default deleteDocument;
