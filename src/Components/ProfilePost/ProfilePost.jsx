import React, { useEffect, useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";

import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseCircleOutlineSharpIcon from "@mui/icons-material/PauseCircleOutlineSharp";
import ChatIcon from "@mui/icons-material/Chat";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import Skeleton from "@mui/material/Skeleton";
import ReactPlayer from "react-player";
import avatar1 from "../../../public/avatar1.png";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { Box, Input, Modal, TextField } from "@mui/material";

import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { app } from "../../firebase.confige";
import { getAuth } from "firebase/auth";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { toast } from "react-toastify";
const PostComponent = ({ LoggedInUser }) => {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);
  const [loader, setLoader] = useState(true);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(false);
  const [input, setInput] = useState({
    title: "",
    desc: "",
  });
  const handleInput = (e) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const togglePlay = () => {
    setPlaying(!playing);
  };
  const handleProfile = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Initialize Firebase Authentication
      const auth = getAuth(app);
      setLoading(true);

      try {
        // Get the currently signed-in user
        const user = auth?.currentUser;

        if (!user) {
          console.error("User is not authenticated");
          // Handle the case where the user is not authenticated
          return;
        }

        // Create a reference to the Firebase Storage bucket
        const storage = getStorage();
        const storageRef = ref(
          storage,
          "postVideo/" + user.uid + "/" + file.name
        );

        // Upload the file to Firebase Storage
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Attach a 'state_changed' event listener to track progress
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress.toFixed(0)); // Update the progress state
          },
          (error) => {
            setLoading(false); // Upload failed, set isUploading to false
            console.error("Error uploading file:", error);
          },
          async () => {
            // Upload complete, set isUploading to false
            setLoading(false);
            // Get the download URL of the uploaded file
            const downloadURL = await getDownloadURL(storageRef);
            setPreview(downloadURL);
          }
        );
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    }
  };
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setPlaying(true);
          videoRef?.current?.seekTo(0);
        } else {
          setPlaying(false);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    if (videoRef?.current) {
      observer.observe(videoRef?.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef?.current);
      }
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 2000);
  }, []);
  const handlePostModel = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getFirestore(app);
    const auth = getAuth(app);
    // Add a new document in collection "cities"
    await addDoc(collection(db, "Posts"), {
      id: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      name: auth?.currentUser?.displayName,
      avatar: auth?.currentUser?.photoURL,
      title: input.title,
      desc: input.desc,
      video: preview,
    }).then(() => {
      toast("Post Created!", {
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
    });
  };
  // State to hold the post data fetched from an API.
  const [posts, setPost] = useState([]);

  // Use the useEffect hook to fetch data when the component mounts.
  useEffect(() => {
    const getAllPost = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "Posts"));
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        setPost((prev) => [...prev, doc.data()]);
      });
    };
    getAllPost();
  }, []); // The empty dependency array ensures this effect runs only once.

  return (
    <Card
      sx={{
        width: "100%",
        "@media (max-width: 768px)": {
          paddingTop: "10px", // Adjust the aspect ratio for screens <= 768px width
        },
      }}
    >
      {loader ? (
        <Skeleton variant="rectangular" width={"100%"} height={671.334} />
      ) : (
        <>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{
              width: "100vw",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "400px",

                bgcolor: "white",
              }}
            >
              <form onSubmit={handleSubmit}>
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    padding: "15px",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      bgcolor: "#71bb42",
                      width: "100%",
                      textAlign: "center",
                      padding: "5px 0",
                      color: "white",
                      marginBottom: "10px",
                    }}
                  >
                    Add New Post
                  </Typography>

                  <label htmlFor="postVide">
                    <Box
                      sx={{
                        width: "380px",
                        height: "200px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      {loading ? (
                        <Typography sx={{ fontSize: "24px" }}>
                          {progress}
                        </Typography>
                      ) : preview ? (
                        <Box sx={{ width: "100%", height: "100%" }}>
                          <ReactPlayer
                            style={{
                              width: "100%",
                              bgcolor: "black",
                              height: "100%",
                            }}
                            url={preview}
                            width="100%"
                            height="100%"
                            controls={true}
                            playing={true}
                          />
                        </Box>
                      ) : (
                        <img
                          style={{ width: "100%", objectFit: "cover" }}
                          src="https://i.ytimg.com/vi/AYjOyQhZiK0/maxresdefault.jpg"
                          alt="preview"
                        />
                      )}
                    </Box>
                  </label>
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Title"
                    multiline
                    maxRows={4}
                    name="title"
                    value={input.title}
                    onChange={handleInput}
                    sx={{ width: "100%", marginBottom: "10px" }}
                  />
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Description"
                    multiline
                    maxRows={4}
                    sx={{ width: "100%" }}
                    name="desc"
                    value={input.desc}
                    onChange={handleInput}
                  />
                  <Button
                    sx={{
                      width: "100%",
                      bgcolor: "#71bb42",
                      marginTop: "10px",
                      color: "white",
                      "&:hover": {
                        color: "#068a02",
                      },
                    }}
                    component="label"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload file
                    <Input
                      sx={{ display: "none" }}
                      type="file"
                      id="postVide0"
                      onChange={handleProfile}
                    />
                  </Button>
                  <Button
                    type="submit"
                    sx={{
                      bgcolor: "#71bb42",
                      width: "100%",
                      textAlign: "center",
                      padding: "5px 0",
                      color: "white",
                      marginTop: "10px",
                      "&:hover": {
                        color: "#068a02",
                      },
                    }}
                  >
                    Post
                  </Button>
                </Box>
              </form>
            </Box>
          </Modal>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                bgcolor: "#71bb42",
                padding: "5px 10px",
                marginBottom: "20px",
              }}
            >
              <Avatar alt="Remy Sharp" src={LoggedInUser?.photoURL} />
              <Button
                onClick={handlePostModel}
                variant="normal"
                sx={{ width: "100%", color: "white", fontSize: "16px" }}
              >
                Add New Post
              </Button>
            </Box>

            {posts.map((item, index) => {
              return (
                <div key={index}>
                  <CardHeader
                    sx={{
                      width: "100%",
                      borderBottom: "1px solid #eeeeee",
                    }}
                    avatar={<Avatar alt="User Avatar" src={item.avatar} />}
                    title={item.name}
                    subheader={item.email}
                    action={
                      <Button
                        sx={{
                          backgroundColor: "#71bb42",
                          color: "white",
                          borderRadius: "50px",
                          fontSize: "12px",

                          padding: "8px 15px",
                          "&:hover": {
                            bgcolor: "#5a9600",
                          },
                        }}
                      >
                        Follow
                      </Button>
                    }
                  />
                  <Box
                    sx={{
                      "@media (max-width: 768px)": {
                        display: "grid",
                        width: "100%",
                        gridTemplateColumns: "1fr",
                      },
                      "@media (max-width: 1024px) and (min-width: 769px)": {
                        display: "grid",
                        gridTemplateColumns: "auto 80px",
                        gridTemplateRows: "1fr",
                      },
                      "@media (min-width: 1025px) and (min-width: 1442px)": {
                        display: "grid",
                        gridTemplateColumns: "auto 60px",
                        gridTemplateRows: "3fr",
                      },
                    }}
                  >
                    <Box>
                      <CardContent sx={{ width: "100%" }}>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          {item.title}
                        </Typography>
                      </CardContent>
                      <CardMedia
                        ref={videoRef}
                        component="div"
                        sx={{
                          width: "100%",
                          height: "500px",
                          position: "relative",
                        }}
                        // 16:9 aspect ratio
                      >
                        {!playing && item.thumbnailUrl ? (
                          <img
                            src={item.thumbnailUrl}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : null}
                        <Button
                          sx={{
                            position: "absolute",
                            top: "40%",
                            left: "44%",
                            color: "#71bb42",
                            opacity: 0,
                            "&:hover": {
                              opacity: 1,
                            },
                          }}
                          onClick={togglePlay}
                        >
                          {playing ? (
                            <PauseCircleOutlineSharpIcon
                              sx={{ fontSize: "2.4rem" }}
                            />
                          ) : (
                            <PlayArrowIcon sx={{ fontSize: "2.4rem" }} />
                          )}
                        </Button>
                        <ReactPlayer
                          url={item.video}
                          width="100%"
                          height="100%"
                          controls={true}
                          playing={playing}
                        />
                      </CardMedia>
                    </Box>
                    <CardActions
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        borderTop: "1px solid #ece9e9",
                        "@media (max-width: 1024px) and (min-width: 769px)": {
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "end",
                          alignItems: "end",
                        },
                        "@media (min-width: 1025px) and (min-width: 1442px)": {
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "end",
                          alignItems: "end",
                        },
                      }}
                    >
                      <Button
                        sx={{
                          "@media (max-width: 1024px) and (min-width: 769px)": {
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "end",
                            alignItems: "center",
                          },
                          "@media (min-width: 1025px) and (min-width: 1442px)":
                            {
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "end",
                              alignItems: "center",
                            },
                        }}
                      >
                        <IconButton>
                          <FavoriteIcon />
                        </IconButton>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="span"
                        >
                          22 M
                        </Typography>
                      </Button>
                      <Button
                        sx={{
                          "@media (max-width: 1024px) and (min-width: 769px)": {
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "end",
                            alignItems: "center",
                          },
                          "@media (min-width: 1025px) and (min-width: 1442px)":
                            {
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "end",
                              alignItems: "center",
                            },
                        }}
                      >
                        <IconButton>
                          <ChatIcon />
                        </IconButton>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="span"
                        >
                          15.5 k
                        </Typography>
                      </Button>
                      <Button
                        sx={{
                          "@media (max-width: 1024px) and (min-width: 769px)": {
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "end",
                            alignItems: "center",
                          },
                          "@media (min-width: 1025px) and (min-width: 1442px)":
                            {
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "end",
                              alignItems: "center",
                            },
                        }}
                      >
                        <IconButton>
                          <ShareIcon />
                        </IconButton>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="span"
                        >
                          3.5 k
                        </Typography>
                      </Button>
                    </CardActions>
                  </Box>
                </div>
              );
            })}
          </Box>
        </>
      )}
    </Card>
  );
};

export default PostComponent;
