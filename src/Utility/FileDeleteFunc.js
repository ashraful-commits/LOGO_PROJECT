import { deleteObject, getStorage, ref } from "firebase/storage";

import { ToastifyFunc } from "./TostifyFunc";

const FileDeleteFunc = (url) => {
    const storage = getStorage();
    const imageRef = ref(storage, url);

    deleteObject(imageRef)
      .then(() => {
      
        ToastifyFunc("File deleted!", "success");
      })
      .catch((error) => {
        ToastifyFunc("Something wrong!", "error");
      });
};

export default FileDeleteFunc;
