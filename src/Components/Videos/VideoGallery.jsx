import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import {
  getStorage,
  ref,
  list,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { app } from "../../firebase.confige";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import { ToastifyFunc } from "../../Utility/TostifyFunc";

export default function VideoList({ setTotalPhoto }) {
  //=============== State to store the list of images
  const [imageList, setImagesList] = useState([]);
  //============ Get user ID from route parameters
  const { id } = useParams();
  useEffect(() => {
    async function pageTokenExample() {
      //============== Create a reference under which you want to list
      const storage = getStorage(app);

      const listRef = ref(storage, "postVideo/" + id);
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
    const storage = getStorage();
    const imageRef = ref(storage, url);

    deleteObject(imageRef)
      .then(() => {
        // Remove the deleted image URL from imageList
        const updatedImageList = imageList.filter(
          (imageUrl) => imageUrl !== url
        );
        setImagesList(updatedImageList);
        ToastifyFunc("Image deleted!", "success");
      })
      .catch((error) => {
        ToastifyFunc("Something wrong!", "error");
      });
  };

  return (
    <>
      {imageList.length > 0 ? (
        <Box sx={{ position: "relative" }}>
          <Card>
            {imageList.map((item, index) => (
              <>
                <Box key={index}>
                  <video autoPlay loop muted>
                    <source src={item} />
                  </video>
                </Box>
              </>
            ))}
          </Card>
        </Box>
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
