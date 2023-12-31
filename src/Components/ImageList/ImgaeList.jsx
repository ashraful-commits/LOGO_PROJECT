import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { getStorage, ref, list, getDownloadURL } from "firebase/storage";
import { app } from "../../firebase.confige";
import { useEffect } from "react";

import { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";

import FileDeleteFunc from "../../Utility/FileDeleteFunc";

export default function StandardImageList({ setTotalPhoto }) {
  //=============== State to store the list of images
  const [imageList, setImagesList] = useState([]);
  //============ Get user ID from route parameters
  const { id } = useParams();
  useEffect(() => {
    async function pageTokenExample() {
      //============== Create a reference under which you want to list
      const storage = getStorage(app);

      const listRef = ref(storage, "profilePhotos/" + id);
      let totalPhoto = 0;
      let totalImg = [];
      //============== List the images with pagination
      const firstPage = await list(listRef, { maxResults: 10 });
      //============ Get the download URL of each image
      firstPage.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          if (imageList.length < 10) {
            totalImg.push(url);
            totalPhoto++;
          }
          setImagesList(totalImg);
          setTotalPhoto(totalPhoto);
        });
      });
    }
    pageTokenExample();
  }, [id]);

  const handleDeletePhoto = (url) => {
    FileDeleteFunc(url);
    const filterData = imageList.filter((item) => item !== url);
    setImagesList(filterData);
  };

  return (
    <>
      {imageList.length > 0 ? (
        <ImageList
          sx={{ position: "relative" }}
          variant="masonry"
          cols={3}
          gap={8}
        >
          {imageList.map((item) => (
            <ImageListItem key={item}>
              <img
                srcSet={`${item}?w=248&fit=crop&auto=format&dpr=2 2x`}
                src={`${item}?w=248&fit=crop&auto=format`}
                alt={item.title}
                loading="lazy"
              />
              <button
                onClick={() => handleDeletePhoto(item)}
                style={{
                  position: "absolute",
                  zIndex: 999,
                  top: 4,
                  right: 4,
                  border: "none",
                  padding: "2px 4px",
                  borderRadius: "100%",
                  backgroundColor: "transparent",
                }}
              >
                <AiOutlineClose color="white" fontSize={23} />
              </button>
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
