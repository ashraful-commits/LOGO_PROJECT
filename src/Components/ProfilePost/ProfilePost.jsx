import { useEffect, useRef, useState } from "react";
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
import {
  Box,
  CircularProgress,
  Input,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Modal,
  TextField,
} from "@mui/material";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
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
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Delete, Edit } from "@mui/icons-material";
import useOpen from "../../hooks/useOpen";
import { ToastifyFunc } from "../../Utility/TostifyFunc";
import getDocumentById from "../../Utility/getSingleData";
import setDocumentWithId from "../../Utility/SetDocWithId";
import updateDocumentWithSnapshot from "../../Utility/UpdateDoc";
import FileDeleteFunc from "../../Utility/FileDeleteFunc";
// Define the PostComponent functional component
const PostComponent = ({ user, id, setTotalPost }) => {
  //==================all states
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);
  const [loader, setLoader] = useState(true);
  const { open, setOpen } = useOpen();
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(false);
  const [dropDown, setDropDrown] = useState(false);
  const [LoggedInUser, setLoggedInUser] = useState({});
  const [Id, setId] = useState(null);
  const [posts, setPost] = useState([]);

  const [input, setInput] = useState({
    title: "",
    desc: "",
  });
  //=====================get auth
  const auth = getAuth(app);
  //=====================handle input
  const handleInput = (e) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  //======================handle toggle button for video
  const togglePlay = () => {
    setPlaying(!playing);
  };
  //==================== handle profile upload
  const handleProfile = async (e) => {
    const file = e.target.files[0];

    if (file) {
      //============== Initialize Firebase Authentication
      const auth = getAuth(app);
      setLoading(true);

      try {
        //=========== Get the currently signed-in user
        const user = auth?.currentUser;

        if (!user) {
          console.error("User is not authenticated");
          //================ Handle the case where the user is not authenticated
          return;
        }

        //================= Create a reference to the Firebase Storage bucket
        const storage = getStorage();
        const storageRef = ref(
          storage,
          "postVideo/" + user?.uid + "/" + file.name
        );

        //=========== Upload the file to Firebase Storage
        const uploadTask = uploadBytesResumable(storageRef, file);

        //============== Attach a 'state_changed' event listener to track progress
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress.toFixed(0)); //=============== Update the progress state
          },
          (error) => {
            setLoading(false); //============= Upload failed, set isUploading to false
            console.error("Error uploading file:", error);
          },
          async () => {
            //====================Upload complete, set isUploading to false
            setLoading(false);
            //===================== Get the download URL of the uploaded file
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
  //========================= handle video play
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
  //=====================handle loading time
  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 2000);
  }, []);
  //======================handle post modal
  const handlePostModel = () => {
    setOpen(true);
  };
  //================== handle modal close
  const handleClose = () => {
    setOpen(false);
  };
  //=========================handle post create and update
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (Id) {
      const db = getFirestore();
      const postRef = doc(db, "Posts", Id);
      const updatedData = {
        title: input.title,
        desc: input.desc,
        video: preview,
        pending: true,
        suspended: {
          status: false,
          startTime: serverTimestamp(),
          msg: "",
          endTime: "",
        },
        decline: false,
      };
      try {
        await updateDoc(postRef, updatedData);
        // Optionally, update the local state with the updated data
        setPost((prevPosts) =>
          prevPosts.map((post) =>
            post.postId === Id ? { ...post, ...updatedData } : post
          )
        );
        setId(null);
        setOpen(false);
        toast.success("Post updated", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } catch (error) {
        console.error("Error updating post: ", error);
      }
    } else {
      if (user?.status?.user === "suspend") {
        toast.warning(`${user?.status?.msg}`, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        const db = getFirestore(app);
        const auth = getAuth(app);

        await addDoc(collection(db, "Posts"), {
          id: auth?.currentUser?.uid,
          title: input.title,
          desc: input.desc,
          video: preview,
          status: false,
          timestamp: serverTimestamp(),
          pending: true,
          suspended: {
            status: false,
            startTime: serverTimestamp(),
            msg: "",
            endTime: "",
          },
          decline: false,
        }).then(() => {
          toast("Post Created!", {
            position: "bottom-center",
            autoClose: 3000,
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
      }
    }
  };
  //==========================find user all post
  useEffect(() => {
    const db = getFirestore();
    const postsRef = collection(db, "Posts");
    const q = query(
      postsRef,
      where("id", "==", id), // Change the filter operation to "=="
      orderBy("timestamp", "desc")
    );

    try {
      setLoader(true);
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const allPosts = [];
        querySnapshot.forEach((doc) => {
          allPosts.push({ postId: doc.id, ...doc.data() });
        });

        setPost(allPosts);
        setTotalPost(allPosts.length);
        setLoader(false); // Set to false when data is fetched
      });
    } catch (error) {
      console.error("Error fetching data from Firestore: ", error);
      setLoader(false); // Set loader to false in case of an error
    }
  }, [id, setTotalPost]);
  //===========================handle edit post
  const handleEdit = (id) => {
    setId(id);
    setOpen(true);
    const singlePost = posts.find((item) => item.postId === id);
    setInput({
      title: singlePost.title,
      desc: singlePost.desc,
    });
    setPreview(singlePost.video);
  };
  //=========================handle delete post
  const handleDelete = async (id, url) => {
    const db = getFirestore();
    const postRef = doc(db, "Posts", id);

    try {
      await deleteDoc(postRef);
      FileDeleteFunc(url);
      //====================== Optionally, update the local state to remove the deleted post
      setPost((prevPosts) => prevPosts.filter((post) => post.postId !== id));
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };
  //=======================handle clear preview
  const handleClear = () => {
    setPreview(null);
  };
  const handleFollow = async (id) => {
    const auth = getAuth(app);

    if (auth?.currentUser) {
      try {
        await updateDocumentWithSnapshot("users", id, {
          followers: arrayUnion(auth?.currentUser?.uid),
        }).then(() => {
          ToastifyFunc("Following!", "success");
        });
        await updateDocumentWithSnapshot("users", auth?.currentUser?.uid, {
          following: arrayUnion(id),
        });

        //======================= At this point, the documents are updated instantly
      } catch (error) {
        console.error("Error updating follower and following arrays:", error);
      }
    } else {
      setOpen(true);
    }
  };
  //===========================handle unfollow
  const handleUnfollow = async (id) => {
    const auth = getAuth(app);
    if (auth.currentUser) {
      try {
        //=============== Fetch the current data from Firestore
        const followingDoc = await getDocumentById(
          "users",
          auth?.currentUser?.uid
        );
        const followerDoc = await getDocumentById("users", id);
        //=============== Modify the arrays in memory
        const updatedFollowerArray = followerDoc.followers.filter(
          (item) => item !== id
        );
        const updatedFollowingArray = followingDoc.following.filter(
          (item) => item !== id
        );
        //================ Update Firestore documents with the modified arrays
        await setDocumentWithId(
          "users",
          id,
          { followers: updatedFollowerArray },
          { merge: true }
        );
        await setDocumentWithId(
          "users",
          auth?.currentUser?.uid,
          { following: updatedFollowingArray },
          { merge: true }
        ).then(() => {
          ToastifyFunc("Unfollow!", "success");
        });

        // At this point, the documents are updated instantly
      } catch (error) {
        console.error("Error updating follower and following arrays:", error);
      }
    } else {
      setOpen(true);
    }
  };
  //===========================fetch all user
  useEffect(() => {
    const fetchData = async () => {
      await getDocumentById("users", auth?.currentUser?.uid, (data) => {
        setLoggedInUser(data);
        console.log(data);
      });
      getDocumentById("users", id, (getData) => {
        if (getData) {
          const userData = getData.data();

          if (userData?.status?.user == "suspend") {
            const currentTime = new Date();
            const suspendDate = new Date(userData?.status?.time);

            if (currentTime >= suspendDate) {
              updateDocumentWithSnapshot("users", id, {
                status: { user: "verified" },
              }).then(() => {
                ToastifyFunc("Suspension removed", "success");
              });
            }
          }
        }
      });
    };
    fetchData();
  }, [id, auth?.currentUser?.uid]);

  return (
    <Card
      sx={{
        width: "100%",
        boxShadow: "none",
        "@media (max-width: 768px)": {
          paddingTop: "10px",
          // Adjust the aspect ratio for screens <= 768px width
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
              <form onSubmit={handlePostSubmit}>
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
                    {Id ? "Edit Post" : "Add new Post"}
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
                        <Box>
                          <CircularProgress
                            variant="determinate"
                            sx={{ color: "#71b112" }}
                            value={progress}
                          />
                        </Box>
                      ) : preview ? (
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
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
                          <button
                            onClick={handleClear}
                            style={{
                              backgroundColor: "white",
                              position: "absolute",
                              top: 10,
                              right: 20,
                              zIndex: 99999,
                              border: "none",
                              padding: "5px",
                              borderRadius: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            className="previewClear"
                          >
                            <AiOutlineClose />
                          </button>
                        </Box>
                      ) : (
                        <label
                          style={{
                            overflow: "hidden",
                            width: "100%",
                            height: "100%",
                          }}
                          htmlFor="postVide0"
                        >
                          <img
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            src="https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg"
                            alt="preview"
                          />
                        </label>
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

                  <Input
                    sx={{ display: "none" }}
                    type="file"
                    id="postVide0"
                    onChange={handleProfile}
                  />

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
                    {Id ? "Save" : "Post"}
                  </Button>
                </Box>
              </form>
            </Box>
          </Modal>
          <Box>
            {auth?.currentUser?.uid === id && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  bgcolor: "#71bb42",
                  padding: "5px 10px",
                  marginBottom: "20px",
                }}
              >
                <Avatar alt="Remy Sharp" src={user?.photoURL} />
                <Button
                  onClick={handlePostModel}
                  variant="normal"
                  sx={{ width: "100%", color: "white", fontSize: "16px" }}
                >
                  Add New Post
                </Button>
              </Box>
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {posts.length > 0 ? (
                posts.map((item, index) => {
                  return (
                    <div
                      style={{
                        marginBottom: "20px",
                        borderBottom: "1px solid #eee",
                        border: "1px solid #eee",
                      }}
                      key={index}
                    >
                      <Box
                        sx={{
                          position: "relative",
                        }}
                      >
                        <CardHeader
                          sx={{
                            width: "100%",
                            borderBottom: "1px solid #eeeeee",
                            bgcolor:
                              item?.suspended?.status === true
                                ? "#fa8b8b"
                                : "#93ff8f",
                            position: "relative",
                          }}
                          variant="primary"
                          avatar={
                            <Avatar alt="User Avatar" src={user?.photoURL} />
                          }
                          title={user?.name}
                          subheader={user?.email}
                          action={
                            auth?.currentUser?.uid === id ? (
                              <Button onClick={() => setDropDrown(!dropDown)}>
                                <AiOutlineMenu size={"24"} />
                              </Button>
                            ) : (
                              LoggedInUser?.following?.some((item) =>
                                item.id === user?.id ? (
                                  <Button
                                    onClick={() => handleUnfollow(user?.id)}
                                  >
                                    Unfollow
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={() => handleFollow(user?.id)}
                                  >
                                    follow
                                  </Button>
                                )
                              )
                            )
                          }
                        />
                        {dropDown && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 40,
                              right: 40,
                              boxShadow: "0 0 10px gray",
                              zIndex: "1",
                              border: "20px",
                              borderRadius: "10px",
                              overflow: "hidden",
                            }}
                          >
                            <button
                              onClick={() => setDropDrown(false)}
                              style={{
                                position: "absolute",
                                zIndex: 99999,
                                right: 10,
                                top: 10,
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              <AiOutlineClose />
                            </button>
                            <List
                              sx={{
                                width: "100%",
                                maxWidth: 360,
                                bgcolor: "white",
                                border: "10px",
                                borderRadius: "10px",
                              }}
                              component="nav"
                              aria-labelledby="nested-list-subheader"
                              subheader={
                                <ListSubheader
                                  component="div"
                                  id="nested-list-subheader"
                                >
                                  Options
                                </ListSubheader>
                              }
                            >
                              <ListItemButton
                                onClick={() => handleEdit(item.postId)}
                              >
                                <ListItemIcon>
                                  <Edit />
                                </ListItemIcon>
                                <ListItemText primary="Edit" />
                              </ListItemButton>
                              <ListItemButton
                                onClick={() =>
                                  handleDelete(item.postId, item.video)
                                }
                              >
                                <ListItemIcon>
                                  <Delete />
                                </ListItemIcon>
                                <ListItemText primary="Delete" />
                              </ListItemButton>
                            </List>
                          </Box>
                        )}
                      </Box>
                      <Box
                        sx={{
                          display: "grid",
                          width: "100%",
                        }}
                      >
                        <Box sx={{ minHeight: "100%", width: "100%" }}>
                          <CardContent sx={{ width: "100%" }}>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="p"
                            >
                              {item.title}
                            </Typography>
                          </CardContent>
                          <Box
                            sx={{
                              display: "grid",
                              height: "500px",
                              gridTemplateColumns: "auto 80px",
                              "@media (max-width: 767px)": {
                                height: "300px",
                                gridTemplateColumns: "1fr",
                                gridTemplateRows: "220px 80px",
                              },
                              "@media (min-width: 768px) and (max-width: 1023px)":
                                {
                                  height: "300px",
                                  gridTemplateColumns: "auto 80px",
                                },
                              "@media (min-width: 1024px) and (max-width: 1365px)":
                                {
                                  height: "300px",
                                  gridTemplateColumns: "auto 80px",
                                },
                            }}
                          >
                            <CardMedia
                              ref={videoRef}
                              component="div"
                              sx={{
                                width: "100%",
                                height: "100%",
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
                                  top: "44%",
                                  left: "44%",
                                  color: "#71bb42",
                                  opacity: 0,
                                  borderRadius: "100%",
                                  width: "50px",
                                  height: "60px",
                                  "&:hover": {
                                    opacity: 1,
                                    bgcolor: "#fff",
                                  },
                                  zIndex: 9999,
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
                                controls={false}
                                playing={playing}
                              />
                            </CardMedia>
                            <CardActions
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "end",
                                alignItems: "center",
                                "@media (max-width: 767px)": {
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                },
                              }}
                            >
                              <Button
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "end",
                                  alignItems: "center",

                                  "@media (max-width: 1023px) and (min-width: 768px)":
                                    {
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "end",
                                      alignItems: "center",
                                    },
                                  "@media (min-width: 1024px) and (max-width: 1365px)":
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
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "end",
                                  alignItems: "center",
                                  "@media (max-width: 1023px) and (min-width: 768px)":
                                    {
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "end",
                                      alignItems: "center",
                                    },
                                  "@media (min-width: 1024px) and (max-width: 1365px)":
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
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "end",
                                  alignItems: "center",
                                  "@media (max-width: 1023px) and (min-width: 768px)":
                                    {
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "end",
                                      alignItems: "center",
                                    },
                                  "@media (min-width: 1024px) and (max-width: 1365px)":
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
                        </Box>
                      </Box>
                    </div>
                  );
                })
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    height: "10vh",
                  }}
                >
                  <Typography>No result found</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </>
      )}
    </Card>
  );
};

export default PostComponent;
