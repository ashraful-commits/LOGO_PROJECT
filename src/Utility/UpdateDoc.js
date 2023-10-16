import { doc, getFirestore, updateDoc, getDoc } from "firebase/firestore";

const updateDocumentWithSnapshot = async (collectionName, documentId, updateData) => {
  const db = getFirestore();
  const docRef = doc(db, collectionName, documentId);

  try {
    await updateDoc(docRef, updateData);
    const updatedDoc = await getDoc(docRef);
    if (updatedDoc.exists()) {
      return updatedDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error updating document: ", error);
    return null;
  }
};

export default updateDocumentWithSnapshot;
