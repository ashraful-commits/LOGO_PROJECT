import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

import { app } from "../firebase.confige";
import { useNavigate } from "react-router-dom";

const useSingleDoc =async ({collectionName,id,setUser}) => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    const navigate = useNavigate()
      const unsubscribe = onAuthStateChanged(auth, async () => {
        if (id) {
          const userDocRef = doc(db, collectionName, id);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            setUser(docSnap.data());
          } else {
            // Handle the case where the user document doesn't exist
          }
        } else {
          // Handle the case where the user is not authenticated
          navigate("/");
        }
      });

      return () => unsubscribe();
 

};

export default useSingleDoc;
