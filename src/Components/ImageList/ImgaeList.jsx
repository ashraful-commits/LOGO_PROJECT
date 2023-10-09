import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { getStorage, ref, list, getDownloadURL } from "firebase/storage";
import { app } from "../../firebase.confige";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

export default function StandardImageList() {
  const [imageList, setImagesList] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    async function pageTokenExample() {
      // Create a reference under which you want to list
      const storage = getStorage(app);
      const auth = getAuth(app);
      const listRef = ref(storage, "profilePhotos/" + id);

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
    <>
      {imageList.length > 0 ? (
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
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography>No Gallery photo found</Typography>
        </Box>
      )}
    </>
  );
}
