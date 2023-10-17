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
import FileDeleteFunc from "../../Utility/FileDeleteFunc";

export default function VideoList({ setTotalVideo }) {
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
          setTotalVideo(totalPhoto);
        });
      });
    }
    pageTokenExample();
  }, [id]);

  const handleDeletePhoto = (url) => {
    FileDeleteFunc(url);
    const updatedImageList = imageList.filter((imageUrl) => imageUrl !== url);
    setImagesList(updatedImageList);
  };

  return (
    <>
      {imageList.length > 0 ? (
        <Box>
          <Card
            sx={{
              display: "grid",
              gap: "10px",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              "@media (max-width: 767px)": {
                gridTemplateColumns: "1fr",
              },
              "@media (min-width: 768px) and (max-width: 1023px)": {
                gridTemplateColumns: "1fr 1fr 1fr",
              },
              "@media (min-width: 1024px) and (max-width: 1365px)": {
                gridTemplateColumns: "1fr 1fr 1fr",
              },
            }}
          >
            {imageList.map((item, index) => (
              <>
                <Box
                  sx={{
                    position: "relative",

                    overflow: "hidden",
                  }}
                  key={index}
                >
                  <video style={{ width: "100%" }} autoPlay loop muted>
                    <source src={item} />
                  </video>
                  <button
                    onClick={() => handleDeletePhoto(item)}
                    style={{
                      position: "absolute",
                      zIndex: 999999,
                      top: 10,
                      right: 10,
                      backgroundColor: "transparent",
                      border: "none",
                    }}
                  >
                    <AiOutlineClose color="white" fontSize={22} />
                  </button>
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
          <Typography>No Gallery Video found</Typography>
        </Box>
      )}
    </>
  );
}
