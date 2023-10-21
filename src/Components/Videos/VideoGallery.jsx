import { getStorage, ref, list, getDownloadURL } from "firebase/storage";
import { app } from "../../firebase.confige";
import { useEffect } from "react";

import { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Card, Typography } from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";

import FileDeleteFunc from "../../Utility/FileDeleteFunc";
import styled from "styled-components";

export default function VideoList({ setTotalVideo }) {
  //=============== State to store the list of images
  const [videoList, setVideoList] = useState([]);
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
          if (videoList.length < 10) {
            totalImg.push(url);
            totalPhoto++;
          }
          setVideoList(totalImg);
          setTotalVideo(totalPhoto);
        });
      });
    }
    pageTokenExample();
  }, [id]);

  const handleDeleteVideo = (videoUrl) => {
    FileDeleteFunc(videoUrl);

    const updatedImageList = videoList.filter((item) => item !== videoUrl);
    setVideoList([...updatedImageList]);
  };

  return (
    <VideoContainer>
      {videoList.length > 0 ? (
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
            {videoList.map((item, index) => (
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
                  onClick={() => handleDeleteVideo(item)}
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
    </VideoContainer>
  );
}

const VideoContainer = styled.div`
  .video {
    &:hover {
      .button {
        display: block;
      }
    }
  }
  .button {
    display: none;
  }
`;
