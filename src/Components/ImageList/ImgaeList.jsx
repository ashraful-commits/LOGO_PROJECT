import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { getStorage, ref, list, getDownloadURL } from "firebase/storage";
import { app } from "../../firebase.confige";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useState } from "react";

export default function StandardImageList() {
  const [imageList, setImagesList] = useState([]);

  useEffect(() => {
    async function pageTokenExample() {
      // Create a reference under which you want to list
      const storage = getStorage(app);
      const auth = getAuth(app);
      const listRef = ref(storage, "profilePhotos/" + auth?.currentUser?.uid);

      // Fetch the first page of 100.
      const firstPage = await list(listRef, { maxResults: 10 });
      firstPage.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          console.log(url);
          if (imageList.length < 10) {
            setImagesList((prev) => [...prev, url]);
          }
        });
      });
      console.log(firstPage.items);
    }
    pageTokenExample();
  }, []);
  return (
    <ImageList variant="masonry" cols={3} gap={8}>
      {imageList.map((item) => (
        <ImageListItem key={item}>
          <img
            srcSet={`${item}?w=248&fit=crop&auto=format&dpr=2 2x`}
            src={`${item}?w=248&fit=crop&auto=format`}
            alt={item.title}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
