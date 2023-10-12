import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";
import { app } from "../firebase.confige";

import { toast } from "react-toastify";
import { useState } from "react";

const useAddDoc =async ({collectionName,setOpen,setPreview,setId,initialSate}) => {
    const[input,setInput] = useState(initialSate)
    const handleInput = (e)=>{
setInput((prev)=>({
    ...prev,
    [e.target.name]:e.target.value
}))
    }
      const db = getFirestore(app);
      await addDoc(collection(db, collectionName), {
       ...input,
        timestamp: serverTimestamp(),
      }).then(() => {
        toast(`${collectionName} Created!`, {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setOpen(false);
        setInput({
          title: "",
          desc: "",
        });
        setId(null);
        setPreview(null);
      });
    return{handleInput,setInput}
};

export default useAddDoc;
