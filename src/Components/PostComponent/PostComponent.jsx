import styled, { keyframes } from "styled-components";

import ReactPlayer from "react-player";
import {
  BsChat,
  BsHeart,
  BsHeartFill,
  BsPause,
  BsPlay,
  BsSend,
  BsShare,
} from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  arrayUnion,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { app } from "../../firebase.confige";
import { getAuth } from "firebase/auth";

import {
  Avatar,
  Box,
  Input,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Typography,
} from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import useOpen from "../../hooks/useOpen";
import { ToastifyFunc } from "../../Utility/TostifyFunc";
import Register from "../Register/Register";
import Login from "../Login/Login";
import updateDocumentWithSnapshot from "../../Utility/UpdateDoc";
import getDocumentById from "../../Utility/getSingleData";
import setDocumentWithId from "../../Utility/SetDocWithId";
import { FacebookShareButton } from "react-share";

// Define the 'PostComponent' functional component.
const PostComponent = ({
  desc,
  thumbnailUrl,
  videoUrl,
  title,
  id,
  avatar,
  email,
  name,
  postId,
  Like,
  messages,
}) => {
  //=========================all states

  const [playing, setPlaying] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({});
  const [chat, setChat] = useState(false);
  const { open, setOpen } = useOpen();
  const auth = getAuth(app);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [postUid, setPostUid] = useState(null);
  const [redirect, setRedirect] = useState("Login");
  const [likeCount, setLikeCount] = useState(Like ? Like?.length : 0);
  const [msgCount, setMsgCount] = useState(messages ? messages?.length : 0);
  const [totalChat, setTotalChat] = useState(messages ? messages : []);

  const [isLiked, setIsLiked] = useState(false);
  const [url, setUrl] = useState("");
  //===========================firestore
  const db = getFirestore(app);

  const [unsubscribe, setUnsubscribe] = useState(null);
  //======================= fetch user data
  useEffect(() => {
    const fetchUserDataById = async () => {
      const docRef = doc(db, "users", auth?.currentUser?.uid);

      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        //=================== Return null if the user document does not exist
        return;
      }
      const userdata = docSnap.data();
      const user = [];

      //==================== Subscribe to real-time updates for the following list
      const unsubscribeFollowing = onSnapshot(docRef, (doc) => {
        const newUserData = doc.data();
        setLoggedInUser((prev) => ({
          ...prev,
          ...newUserData,
          id: auth?.currentUser?.uid,
        }));
      });

      //================= Subscribe to real-time updates for the user's followers
      userdata.following.forEach((item) => {
        const followersRef = doc(db, "users", item);

        const unsubscribeFollower = onSnapshot(followersRef, (followerDoc) => {
          user.push({ id: item, ...followerDoc.data() });
          setLoggedInUser((prev) => ({ ...prev, following: user }));
        });

        //===================== Store the unsubscribe functions for each follower
        setUnsubscribe((prev) => ({
          ...prev,
          [item]: unsubscribeFollower,
        }));
      });

      //======================== Store the main unsubscribe function
      setUnsubscribe((prev) => ({
        ...prev,
        main: unsubscribeFollowing,
      }));
    };

    fetchUserDataById();

    return () => {
      if (unsubscribe) {
        //===================== Call each unsubscribe function for followers
        Object.values(unsubscribe).forEach((unSub) => unSub());

        //=================== Call the main unSubscribe function
        if (unsubscribe.main) {
          unsubscribe.main();
        }
      }
    };
  }, [id, auth?.currentUser?.uid, db, unsubscribe]);

  const videoRef = useRef();
  //============================= video toggle paly
  const togglePlay = () => {
    setPlaying(!playing);
  };
  //=============================== video playing function
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px", // Or "0%"
      threshold: 0.5,
    };

    //=========================== Callback function for IntersectionObserver.
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

    //======================== Create an IntersectionObserver instance.
    const observer = new IntersectionObserver(handleIntersection, options);

    //========================= Observe the video element when it's available.
    if (videoRef?.current) {
      observer.observe(videoRef?.current);
    }

    //============================ Cleanup function to unobserve the video element.
    return () => {
      if (videoRef?.current) {
        observer.unobserve(videoRef?.current);
      }
    };
  }, []);
  //===============================loading time out
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  //==============================handle follow
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
          { ...followerDoc, followers: updatedFollowerArray },
          { merge: true }
        );
        await setDocumentWithId(
          "users",
          auth?.currentUser?.uid,
          { ...followingDoc, following: updatedFollowingArray },
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
  //============================handle update like instent
  useEffect(() => {
    setIsLiked(Like?.some((item) => item === loggedInUser?.id) ? true : false);
  }, [loggedInUser?.id, Like]);
  //============================handle post like
  const handleLike = async (postId) => {
    if (loggedInUser?.id) {
      try {
        const postDataSnapshot = await getDocumentById("Posts", postId);
        if (postDataSnapshot) {
          const existingData = postDataSnapshot;
          const updatedLikeArray = existingData.Like || [];

          const likeIndex = updatedLikeArray.indexOf(loggedInUser?.id);

          if (likeIndex !== -1) {
            //====================== If the user's ID exists in the Like array, remove it
            updatedLikeArray.splice(likeIndex, 1);
            if (likeCount > 0) {
              setLikeCount((prev) => prev - 1);
            } else {
              setLikeCount(0);
            }
            setIsLiked(false);
          } else {
            //======================= If the user's ID doesn't exist in the Like array, add it
            updatedLikeArray.push(loggedInUser?.id);
            setLikeCount((prev) => prev + 1);
            setIsLiked(true);
          }

          //============================ Update the document with the modified Like array
          await updateDocumentWithSnapshot("Posts", postId, {
            Like: updatedLikeArray,
          });

          console.log("Like array updated successfully!");
        } else {
          console.log("Document does not exist");
        }
      } catch (error) {
        console.error("Error updating Like array:", error);
      }
    } else {
      setOpen(true);
    }
  };
  //============================handle chats
  const handleChat = (postId) => {
    setPostUid(postId ? postId : null);
    setChat(!chat);
  };
  //============================handle message
  const handleMessage = (e) => {
    e.preventDefault();

    const addMessageToPost = async (postUid, userId, message) => {
      const postRef = doc(db, "Posts", postUid);
      if (userId) {
        try {
          //===================== Update
          await updateDoc(postRef, {
            messages: arrayUnion({ id: userId, text: message }),
          }).then(() => {
            if (totalChat.length > 0) {
              setTotalChat((prev) => [...prev, { id: userId, text: message }]);
              setMsgCount((prev) => prev + 1);
              setMessage("");
            } else {
              setTotalChat([{ id: userId, text: message }]);
              setMsgCount((prev) => prev + 1);
              setMessage("");
            }
          });
        } catch (error) {
          console.error("Error adding message to post:", error);
        }
      } else {
        setOpen(true);
      }
    };
    addMessageToPost(postUid, loggedInUser.id, message);
  };
  //===================================== handle share

  //==========================handle close
  const handleClose = () => setOpen(false);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10rem",
            width: "100%",
          }}
        >
          {redirect === "Login" ? (
            <Login setOpen={setOpen} setRedirect={setRedirect} />
          ) : (
            <Register setOpen={setOpen} setRedirect={setRedirect} />
          )}
        </Box>
      </Modal>
      {loading ? (
        <SkeletonPost>
          {loading && (
            <div className="skeleton-loading">
              {/* ================You can customize the loading animation */}
              Loading...
            </div>
          )}
          {!loading && (
            <div className="post-user-details">
              <div className="user-details">
                <div className="avatar">
                  {/*=============== Add an empty avatar */}
                  <div className="skeleton-content"></div>
                </div>
                <div className="details">
                  <p>
                    {/* ===============Add skeleton content for name */}
                    <span className="skeleton-content"></span>
                  </p>
                  <span>
                    {/* Add skeleton content for email */}
                    <span className="skeleton-content"></span>
                  </span>
                </div>
              </div>

              <div className="follow">
                {/* ===================Add skeleton content for the follow button */}
                <button className="skeleton-content"></button>
              </div>
            </div>
          )}
          {!loading && (
            <div className="title">
              <p>
                {/* ===================Add skeleton content for title */}
                <span className="skeleton-content"></span>
              </p>
            </div>
          )}
          {!loading && (
            <div className="img-status">
              <div className="img">
                {/* =================Add skeleton content for the image */}
                <div className="skeleton-content"></div>
                <div className="play-button"></div>
                <div className="desc">
                  <p>
                    {/* ================Add skeleton content for description */}
                    <span className="skeleton-content"></span>
                  </p>
                </div>
              </div>
              <div className="status">
                <div className="status-item">
                  <button>
                    {/* ============Add skeleton content for like button */}
                    <span className="skeleton-content"></span>
                  </button>
                  <span>
                    {/* A================dd skeleton content for like count */}
                    <span className="skeleton-content"></span>
                  </span>
                </div>
                <div className="status-item">
                  <button>
                    {/*================Add skeleton content for chat button */}
                    <span className="skeleton-content"></span>
                  </button>
                  <span>
                    {/* =================Add skeleton content for message count */}
                    <span className="skeleton-content"></span>
                  </span>
                </div>
                <div className="status-item">
                  <button>
                    {/*============== Add skeleton content for share button */}
                    <span className="skeleton-content"></span>
                  </button>
                  <span>
                    {/* ==============Add skeleton content for share count */}
                    <span className="skeleton-content"></span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </SkeletonPost>
      ) : (
        <PostContainer>
          <div className="post-user-details">
            <div className="user-details">
              <div className="avatar">
                <Link to={`/${id}`}>
                  {avatar ? (
                    <img src={avatar} alt="" />
                  ) : (
                    <img
                      src={`https://img.freepik.com/premium-vector/young-smiling-man-avatar-man-with-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-3d-vector-people-character-illustration-cartoon-minimal-style_365941-860.jpg`}
                      alt=""
                    />
                  )}
                </Link>
              </div>
              <div className="details">
                <p>{name}</p>
                <span>@{email}</span>
              </div>
            </div>
            <div className="follow">
              {loggedInUser?.following?.some((item) => item.id === id)
                ? loggedInUser.id !== id && (
                    <button onClick={() => handleUnfollow(id)}>Unfollow</button>
                  )
                : loggedInUser.id !== id && (
                    <button onClick={() => handleFollow(id)}>follow</button>
                  )}
            </div>
          </div>
          <div className="title">
            <p>{title}</p>
          </div>
          <div className="img-status">
            <div ref={videoRef} className="img">
              {!playing && thumbnailUrl && <img src={thumbnailUrl} alt="" />}
              <ReactPlayer
                url={videoUrl}
                width="100%"
                height="100%"
                controls={false}
                playing={playing}
              />
              <div className="play-button" onClick={togglePlay}>
                {playing ? <BsPause /> : <BsPlay />}
              </div>
              <div className="desc">
                <p>{desc}</p>
              </div>
            </div>
            {chat && (
              <Box
                sx={{
                  position: "fixed",
                  bottom: "30%",
                  right: "10%",
                  zIndex: 999,
                  width: "20.9375rem",
                  height: "18.75rem",
                  boxShadow: "0 0 .625rem #ccffc9 inset",
                  bgcolor: "#eee",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: ".625rem",
                  borderRadius: ".625rem",
                }}
              >
                <button
                  onClick={() => setChat(false)}
                  style={{
                    position: "absolute",
                    top: 10,
                    width: "1.25rem",
                    height: "1.25rem",
                    display: "flex",
                    right: 10,
                    background: "transparent",
                    cursor: "pointer",
                    zIndex: 999999,
                    border: ".0625rem solid gray",
                    borderRadius: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AiOutlineClose fontSize={"13"} />
                </button>
                <List
                  sx={{
                    height: "100%",
                    overflowY: "auto", // Enable vertical scrollbar
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "#fff",
                    alignItems: "start",
                    padding: ".3125rem .3125rem 0 .3125rem",
                    margin: "1.5625rem 0 .25rem 0",
                    gap: ".0625rem",
                    "&::-webkit-scrollbar": {
                      width: ".0625rem",
                      opacity: 0,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#fefefe",
                      borderRadius: ".25rem",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      backgroundColor: "#555",
                    },
                  }}
                >
                  {totalChat?.map((item, index) => {
                    return (
                      <ListItem
                        sx={{
                          display: "flex",
                          marginBottom: ".625rem",
                          gap: ".625rem",
                          flexDirection:
                            loggedInUser?.id === item?.id
                              ? "row-reverse"
                              : "row",
                          alignItems: "center",

                          bgcolor:
                            loggedInUser?.id === item?.id
                              ? "#fae4e4"
                              : "#c6f7c9",
                          width: "auto",
                          alignSelf:
                            loggedInUser?.id === item?.id
                              ? "flex-end"
                              : "flex-start",
                          borderRadius: ".625rem",
                        }}
                        key={index}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{ width: "1.25rem", height: "1.25rem" }}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={item.username} // Assuming you have a 'username' property
                            secondary={
                              <Typography
                                component="span"
                                variant="body2"
                                color="textSecondary"
                              >
                                {item.text}
                              </Typography>
                            }
                          />
                        </Box>
                      </ListItem>
                    );
                  })}
                </List>
                <form onSubmit={handleMessage}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Input
                      sx={{
                        width: "100%",
                        backgroundColor: "#71b22a",
                        padding: "0 .4375rem",
                        color: "white",
                      }}
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Comment please!"
                    />
                    <button
                      className="send_btn"
                      style={{
                        width: "1.875rem",
                        height: "2rem",
                        backgroundColor: "#71b22a",
                        border: "none",
                      }}
                      type="submit"
                    >
                      <BsSend color="white" />
                    </button>
                  </Box>
                </form>
              </Box>
            )}
            <div className="status">
              <div className="status-item">
                <button onClick={() => handleLike(postId)}>
                  {isLiked ? <BsHeartFill fill="#71bb42" /> : <BsHeart />}
                </button>
                <span>{likeCount}</span>
              </div>
              <div className="status-item">
                <button onClick={() => handleChat(postId)}>
                  <BsChat fill={chat ? "#71bb42" : ""} />
                </button>
                <span>{msgCount}</span>
              </div>
              <div className="status-item">
                <FacebookShareButton
                  url={`https://logo-project-assignment.vercel.app/${id}`}
                >
                  <BsShare />
                </FacebookShareButton>

                <span>3.5 k</span>
              </div>
            </div>
          </div>
        </PostContainer>
      )}
    </>
  );
};
/* ............... (Styles for the main container) */
const PostContainer = styled.div`
  width: 34.0695rem;
  height: 41.9584rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.0625rem;
  .send_btn {
    width: "100%";
    :hover {
      background-color: #8fdd5d;
    }
  }
  .post-user-details {
    width: 34.0695rem;
    height: 4.375rem;
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    .user-details {
      height: 100%;
      display: flex;
      gap: 0.3375rem;
      .avatar {
        width: 3.125rem;
        height: 3.125rem;
        flex-shrink: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-radius: 100%;
        overflow: hidden;

        a {
          border-radius: 100%;
          width: 100%;
          height: 100%;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
      .details {
        display: flex;
        flex-direction: column;
        justify-content: start;
        margin-left: 0.25rem;
        p {
          color: #000;
          font-family: Poppins;
          font-size: 0.9594rem;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          cursor: pointer;
        }
        span {
          color: #4f4f4f;
          font-family: Poppins;
          font-size: 0.875rem;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          cursor: pointer;
          width: 3.75rem !important; /* Adjust the width as needed */
          white-space: nowrap; /* Prevent text from wrapping to the next line */
          overflow: hidden; /* Hide any overflowing text */
          text-overflow: ellipsis; /* Add ellipsis (...) for truncated text */
        }
      }
    }
    .follow {
      display: flex;
      justify-content: end;

      button {
        width: 4.6875rem;
        height: 2rem;
        flex-shrink: 0;
        background-image: var(--bg-gradient);
        border-radius: 0.5rem;
        border: none;
        color: #fff;
        text-align: center;
        font-family: Segoe UI;
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        position: relative;
        transition: all 0.5s ease-in-out;
        &:hover {
          background-image: linear-gradient(#71bb42, #8fdd5d);
        }
      }
    }
  }
  .title {
    width: 80%;
    text-align: left;
    display: flex;
    justify-content: start;
    margin-left: 0.3125rem;
    margin-top: 0.125rem;
    p {
      color: #000;
      font-family: Poppins;
      font-size: 0.875rem;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      white-space: nowrap; /* Prevent text from wrapping to the next line */
      overflow: hidden; /* Hide any content that overflows its container */
      text-overflow: ellipsis; /* Display an ellipsis (...) when text overflows */
      max-width: 9.375rem;
    }
  }
  .img-status {
    position: "relative";
    width: 100%;
    height: 35.625rem;
    flex-shrink: 0;
    display: grid;
    margin-top: 0.5625rem;
    grid-template-columns: 20rem auto;
    gap: 0.625rem;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding-bottom: 1.875rem;
    overflow: hidden;
    border-bottom: 0.0625rem solid #eeeeee;
    .loading {
      background-color: #bcbcbc !important;
      .play-button {
        display: none;
      }
      .desc {
        display: none;
      }
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .img {
      width: 100%;
      position: relative;
      height: 100%;
      overflow: hidden;
      background-color: gray;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #080808;
      border-radius: 1.5457rem;
      margin-left: 3.875rem;
      z-index: 1;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .play-button {
        opacity: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;
        font-size: 1.5rem;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        padding: 0.625rem;
        z-index: 100;
        transition: background-color 0.2s;
        width: 3.125rem;
        height: 3.125rem;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.5s ease-in-out;
      }
      .play-button:hover {
        background-color: rgba(0, 0, 0, 0.7);
      }
      &:hover {
        .play-button {
          opacity: 1;
        }
      }
      .desc {
        position: absolute;
        overflow: hidden;
        bottom: 0;
        width: 100%;
        height: 31.125rem;
        flex-shrink: 0;
        border-radius: 1.5457rem;
        opacity: 0.8;
        display: flex;
        flex-direction: column;
        justify-content: end;
        align-items: start;
        white-space: nowrap; /* Prevent text from wrapping to the next line */
        overflow: hidden; /* Hide overflowing text */
        text-overflow: ellipsis; /* Display an ellipsis (...) when text overflows */
        max-width: 100%;
        z-index: 5;
        padding: 1.25rem;
        padding-bottom: 2.1875rem;
        background: linear-gradient(
          0deg,
          #1c1c1c 7.3%,
          rgba(45, 45, 45, 0.35) 35.03%,
          rgba(48, 48, 48, 0) 45.12%
        );
        mix-blend-mode: normal;
        p {
          color: #bcbcbc;
          font-family: Roboto;
          font-size: 0.6396rem;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          z-index: 2;
          white-space: nowrap; /* Prevent text from wrapping */
          overflow: hidden; /* Hide overflowing text */
          text-overflow: ellipsis; /* Display an ellipsis (...) when text is truncated */
          width: 100%;
        }
        span {
          color: #bcbcbc;
          font-family: Roboto;
          font-size: 0.533rem;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }
    }
    .status {
      height: 100%;
      width: 7.1875rem;
      display: flex;
      flex-direction: column;
      justify-content: end;
      align-items: end;
      gap: 1.3125rem;

      .status-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.375rem;

        button {
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          border: none;
          transition: all 0.5s ease-in-out;

          &:hover {
            background-color: #71bb42;
            svg {
              color: white;
            }
          }

          border-radius: 100%;

          svg {
            font-size: 1.375rem;
          }
        }
        span {
          font-size: 9.6px;
        }
      }
    }
  }
  @media (max-width: 47.9375rem) {
    width: 99vw;
    margin: 0 auto;
    padding: 0 1.875rem;
    height: 41.9584rem;
    .post-user-details {
      width: 100%;
    }
    .details {
      span {
        width: 9.375rem; /* Adjust the width as needed */
        white-space: nowrap; /* Prevent text from wrapping to the next line */
        overflow: hidden; /* Hide any overflowing text */
        text-overflow: ellipsis;
      }
    }
    .img-status {
      position: "relative";
      width: 100%;
      grid-template-columns: 95%;
      grid-template-rows: 29.375rem auto;
      gap: 1.3125rem;

      .status {
        width: 100%;
        justify-content: space-around;
        align-items: center;
        flex-direction: row;
      }
      .img {
        margin-left: 0rem;
        .desc {
          p {
            color: #bcbcbc;
            font-family: Roboto;
            font-size: 0.6396rem;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            z-index: 2;
            white-space: nowrap; /* Prevent text from wrapping */
            overflow: hidden; /* Hide overflowing text */
            text-overflow: ellipsis; /* Display an ellipsis (...) when text is truncated */
            width: 100%;
          }
        }
      }
    }
    .title {
      width: 75%;
    }
  }

  @media (min-width: 48rem) and (max-width: 63.9375rem) {
    width: 100%;
    top: 5%;
    .post-user-details {
      width: 34.382rem;
    }
    .img-status {
      position: "relative";
      grid-template-columns: 26.25rem auto;
      padding-bottom: 1.875rem;
      .img {
        width: 100%;
        .loading {
          width: 100%;
        }
        .desc {
          p {
            color: #bcbcbc;
            font-family: Roboto;
            font-size: 0.6396rem;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            z-index: 2;
            white-space: nowrap; /* Prevent text from wrapping */
            overflow: hidden; /* Hide overflowing text */
            text-overflow: ellipsis; /* Display an ellipsis (...) when text is truncated */
            width: 100%;
          }
        }
      }
    }
    .title {
      width: 70%;
    }
  }
  @media (min-width: 64rem) and (max-width: 85.3125rem) {
    width: 100%;
    top: 15%;
    .post-user-details {
      width: 34.382rem;
    }
    .img-status {
      position: "relative";
      grid-template-columns: 26.25rem auto;
      padding-bottom: 1.875rem;
      .img {
        width: 100%;
        .loading {
          width: 100%;
        }
        .desc {
          p {
            color: #bcbcbc;
            font-family: Roboto;
            font-size: 0.6396rem;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            z-index: 2;
            white-space: nowrap; /* Prevent text from wrapping */
            overflow: hidden; /* Hide overflowing text */
            text-overflow: ellipsis; /* Display an ellipsis (...) when text is truncated */
            width: 100%;
          }
        }
      }
    }
    .title {
      width: 70%;
    }
  }
`;
//=======================loader animation
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
//====================== Create a separate styled component for the skeleton
const SkeletonPost = styled.div`
  width: 34.0695rem;
  height: 41.9584rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.0625rem;
  background-color: #f0f0f0;
  animation: ${fadeIn} 0.5s ease-in-out;

  /* Add skeleton styles for the user details */
  .post-user-details {
    width: 34.0695rem;
    height: 4.375rem;
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    background-color: #e0e0e0;

    /* Add skeleton styles for user details */
    .user-details {
      height: 100%;
      display: flex;
      gap: 0.3375rem;
      align-items: center;

      /* Add skeleton styles for avatar */
      .avatar {
        width: 3.125rem;
        height: 3.125rem;
        flex-shrink: 0;
        background-color: #ccc;
        border-radius: 50%;
        overflow: hidden;
      }

      /* Add skeleton styles for user name */
      .details {
        p {
          background-color: #e0e0e0;
          height: 1.25rem;
          width: 6.25rem;
          border-radius: 0.3125rem;
        }
        span {
          background-color: #e0e0e0;
          height: 0.625rem;
          width: 3.75rem;
          border-radius: 0.3125rem;
        }
      }
    }
  }

  /* Add skeleton styles for title */
  .title {
    width: 80%;
    text-align: left;
    display: flex;
    justify-content: start;
    margin-left: 0.3125rem;
    margin-top: 0.125rem;
    p {
      background-color: #e0e0e0;
      height: 0.9375rem;
      width: 80%;
      border-radius: 0.3125rem;
    }
  }

  /* Add skeleton styles for image and status */
  .img-status {
    position: "relative";
    width: 100%;
    height: 35.625rem;
    flex-shrink: 0;
    display: grid;
    gap: 0.625rem;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding-bottom: 1.875rem;
    overflow: hidden;
    border-bottom: 0.0625rem solid #eeeeee;

    /* Add skeleton styles for image */
    .img {
      width: 100%;
      position: relative;
      height: 100%;
      background-color: #ccc;
      border-radius: 0.625rem;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    /* Add skeleton styles for status */
    .status {
      height: 100%;
      width: 7.1875rem;
      display: flex;
      flex-direction: column;
      justify-content: end;
      align-items: end;
      gap: 1.3125rem;

      .status-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.375rem;

        /* Add skeleton styles for buttons */
        button {
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #e0e0e0;
          border-radius: 50%;
        }
        span {
          background-color: #e0e0e0;
          height: 0.625rem;
          width: 1.875rem;
          border-radius: 0.3125rem;
        }
      }
    }
  }

  /* Add media queries for responsiveness */
  @media (max-width: 20rem) {
    /* Small mobile */
    width: 100vw;
    height: 41.9584rem;
    .post-user-details {
      width: 100%;
    }
    .details span {
      width: 9.375rem;
    }
    .img-status .img {
      margin-left: 0;
    }
    .title {
      width: 95%;
    }
  }

  @media (min-width: 20.0625rem) and (max-width: 48rem) {
    /* Large mobile */
    width: 100vw;
    height: 41.9584rem;
    .post-user-details {
      width: 100%;
    }
    .details span {
      width: 9.375rem;
    }
    .img-status .img {
      margin-left: 0;
    }
    .title {
      width: 95%;
    }
  }

  @media (min-width: 48.0625rem) and (max-width: 64rem) {
    /* Tablet */
    width: 100%;
    .post-user-details {
      width: 34.382rem;
    }
  }

  @media (min-width: 64.0625rem) {
    /* Desktop */
    /* Reset any specific styles for desktop, as it will use the default styles. */
  }
`;

export default PostComponent;
