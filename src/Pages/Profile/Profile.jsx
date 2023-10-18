import { useState, useEffect } from "react";
import styled from "styled-components";
import { FaUserFriends, FaRegThumbsUp } from "react-icons/fa";
import { MdPhotoCamera } from "react-icons/md";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import ListItemText from "@mui/material/ListItemText";

import PostComponent from "../../Components/ProfilePost/ProfilePost";
import { Box, Input, ListItemAvatar, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import StandardImageList from "../../Components/ImageList/ImgaeList";

import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { app } from "../../firebase.confige";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import Following from "../../Components/Following/Following";
import Followers from "../../Components/Followers/Followers";
import Admin from "../../Components/Admin/Admin";
import useOpen from "../../hooks/useOpen";
import { ToastifyFunc } from "../../Utility/TostifyFunc";
import VideoList from "../../Components/Videos/VideoGallery";
import { AiFillVideoCamera } from "react-icons/ai";

const Profile = () => {
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [user, setUser] = useState({});
  const [LoggedInUser, setLoggedInUser] = useState({});
  const [isProfileProgress, setIsProfileProgress] = useState(0);
  const [CoverUploadProgress, setCoverUploadProgress] = useState(0);

  const [totalPost, setTotalPost] = useState(0);
  const [totalPhoto, setTotalPhoto] = useState(0);
  const [totalVideo, setTotalVideo] = useState(0);
  const [value, setValue] = useState("1");
  const { setOpen } = useOpen();
  const { id } = useParams();
  //========================= Simulate loading for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  //============================get current user
  useEffect(() => {
    const auth = getAuth(app);
    if (!auth.currentUser) {
      navigate("/");
      setOpen(true);
      ToastifyFunc("Please Login!", "warning");
    }
    setLoggedInUser(auth?.currentUser);
  }, [navigate, setOpen]);
  //============================handle input change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  //==============================get user with id
  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const fetchData = async () => {
      const unsubscribe = onAuthStateChanged(auth, async () => {
        if (id) {
          const userDocRef = doc(db, "users", id);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            setUser(docSnap.data());
          } else {
            // Handle the case where the user document doesn't exist
          }
        } else {
          // Handle the case where the user is not authenticated
          navigate("/");
        }
      });

      return () => unsubscribe();
    };

    fetchData();
  }, [navigate, id, user]);

  //================================ profile photo upload
  const handleProfile = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const auth = getAuth(app);
      setIsProfileLoading(true);

      try {
        const user = auth?.currentUser;

        if (!user) {
          console.error("User is not authenticated");

          return;
        }
        const storage = getStorage();
        const storageRef = ref(
          storage,
          "profilePhotos/" + user.uid + "/" + file.name
        );

        //============= Upload the file to Firebase Storage
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setIsProfileProgress(progress.toFixed(0));
          },
          (error) => {
            setIsProfileLoading(false);
            console.error("Error uploading file:", error);
          },
          async () => {
            setIsProfileLoading(false);

            const downloadURL = await getDownloadURL(storageRef);
            await updateProfile(auth?.currentUser, {
              photoURL: downloadURL,
            });

            try {
              const db = getFirestore(app);
              const userDb = doc(db, "users", `${user.uid}`);

              await updateDoc(userDb, {
                photoURL: downloadURL,
              });
              setLoggedInUser((prev) => ({
                ...prev,
                photoURL: downloadURL,
              }));
              ToastifyFunc("Profile Photo uploaded!", "success");
              setIsProfileLoading(false);
            } catch (error) {
              console.error("Error updating profile:", error);
            }
          }
        );
      } catch (error) {
        setIsProfileLoading(false);
        console.error("Error:", error);
      }
    }
  };
  //================================ uplaod cover photo
  const handleCover = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const auth = getAuth(app);
      setIsCoverUploading(true);

      try {
        const user = auth?.currentUser;

        if (!user) {
          console.error("User is not authenticated");

          return;
        }

        const storage = getStorage();
        const storageRef = ref(
          storage,
          "profilePhotos/" + user.uid + "/" + file.name
        );

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setCoverUploadProgress(progress.toFixed(0));
          },
          (error) => {
            setIsCoverUploading(false);
            console.error("Error uploading cover photo:", error);
          },
          async () => {
            setIsCoverUploading(false);

            const downloadURL = await getDownloadURL(storageRef);

            try {
              const db = getFirestore(app);
              const userDb = doc(db, "users", `${user.uid}`);

              await updateDoc(userDb, {
                coverPhotoUrl: downloadURL,
              });
              setLoggedInUser((prev) => ({
                ...prev,
                coverPhotoUrl: downloadURL,
              }));
              ToastifyFunc("Cover Photo uploaded!", "success");
            } catch (error) {
              console.error("Error updating user profile:", error);
            }
          }
        );
      } catch (error) {
        setIsCoverUploading(false);
        console.error("Error:", error);
      }
    }
  };

  const auth = getAuth();

  return (
    <Container>
      <Content>
        {isLoading ? (
          <SkeletonContainer>
            <SkeletonCoverPhoto />
            <SkeletonAvatar />
            <SkeletonUserName />
            <SkeletonProfileInfo />
            <SkeletonPost />
          </SkeletonContainer>
        ) : (
          <>
            <Box
              sx={{
                position: "relative",
                width: "100vw",
                display: "flex",
                alignItems: "center",
              }}
            >
              {isCoverUploading ? (
                <CoverLoader component="div" color="text.secondary">
                  <Typography> {`${CoverUploadProgress}%`}</Typography>
                </CoverLoader>
              ) : user?.coverPhotoUrl ? (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <CoverPhoto src={user?.coverPhotoUrl} alt="Cover" />
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      backgroundImage:
                        "linear-gradient(to bottom, transparent, #444444)",
                    }}
                  ></Box>
                </Box>
              ) : (
                <CoverPhoto
                  src="https://2.bp.blogspot.com/-nfvjMm5r4HE/UAEzYD80HII/AAAAAAAAARA/CASgQfzOD3w/s1600/free-facebook-cover-photo-make-your-own.jpg"
                  alt="Cover"
                />
              )}
              {id === LoggedInUser?.uid && (
                <Box
                  sx={{
                    width: "40px",
                    height: "40px",
                    position: "absolute",
                    top: 50,
                    right: 50,
                    bgcolor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "100%",
                    transition: "all 0.5s ease-in-out",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "#71bb42",
                      color: "white",
                    },
                  }}
                >
                  <label htmlFor="coverPhot">
                    <MdPhotoCamera />
                  </label>
                  <Input
                    sx={{ display: "none" }}
                    onChange={handleCover}
                    type="file"
                    id="coverPhot"
                  />
                </Box>
              )}
            </Box>

            <Box
              sx={{
                position: "relative",
                bgcolor: "white",
                width: "100px",
                height: "100px",
                marginLeft: "10px",
                bgColor: "white",
                borderRadius: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isProfileLoading ? (
                <Loader variant="h5" component="div" color="text.secondary">
                  {`${isProfileProgress}%`}
                </Loader>
              ) : user?.photoURL ? (
                <Avatar src={user?.photoURL} alt="Avatar" />
              ) : (
                <Avatar
                  src="https://img.freepik.com/premium-vector/young-smiling-man-avatar-man-with-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-3d-vector-people-character-illustration-cartoon-minimal-style_365941-860.jpg"
                  alt="avatar"
                />
              )}

              {!isProfileLoading && id === LoggedInUser?.uid && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 40,
                    left: 60,
                    width: "35px",
                    height: "35px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "white",
                    padding: "4px",
                    borderRadius: "40px",
                    boxShadow: "0 0 10px gray",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "#5a9600",
                      color: "white",
                    },
                  }}
                >
                  <label htmlFor="profile">
                    <MdPhotoCamera size={"20"} />
                  </label>
                  <Input
                    onChange={handleProfile}
                    sx={{ display: "none" }}
                    type="file"
                    id="profile"
                  />
                </Box>
              )}
            </Box>
            <UserName>{user?.name}</UserName>
            <ProfileInfo>
              <List
                sx={{
                  width: "100%",
                  display: "flex",
                  gap: "12px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ListItem
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ListItemAvatar
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FaUserFriends color="#71bb42" size={"32"} />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Friends"
                    sx={{
                      color: "#71bb42",
                      fontSize: "13",
                      fontWeight: "700",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                    secondary={
                      user?.followers?.length
                        ? user?.followers?.length
                        : 0 + user?.following?.length
                        ? user?.following?.length
                        : 0
                    }
                  />
                </ListItem>
                <ListItem
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ListItemAvatar
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <MdPhotoCamera color="#71bb42" size={"32"} />
                  </ListItemAvatar>
                  <ListItemText
                    sx={{
                      color: "#71bb42",
                      fontSize: "13",
                      fontWeight: "700",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                    primary="Photos"
                    secondary={totalPhoto}
                  />
                </ListItem>
                <ListItem
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ListItemAvatar
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <AiFillVideoCamera color="#71bb42" size={"32"} />
                  </ListItemAvatar>
                  <ListItemText
                    sx={{
                      color: "#71bb42",
                      fontSize: "13",
                      fontWeight: "700",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                    primary="Videos"
                    secondary={totalVideo}
                  />
                </ListItem>
                <ListItem
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ListItemAvatar
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FaRegThumbsUp color="#71bb42" size={"32"} />
                  </ListItemAvatar>
                  <ListItemText
                    sx={{
                      color: "#71bb42",
                      fontSize: "13",
                      fontWeight: "700",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                    primary="Posts"
                    secondary={totalPost}
                  />
                </ListItem>
              </List>
            </ProfileInfo>

            <TabContext value={value}>
              <Box
                sx={{
                  width: "100vw",
                  borderBottom: 1,
                  padding: "0px",
                  borderColor: "divider",
                  overflow: "auto",
                }}
              >
                <TabList
                  sx={{ width: "100%", overflow: "auto" }}
                  onChange={handleChange}
                >
                  <Tab
                    sx={{
                      fontSize: "12px",
                      padding: "0px",
                      minWidth: "50px",
                    }}
                    label="Post"
                    value="1"
                  />
                  <Tab
                    sx={{ fontSize: "12px", padding: "2px", minWidth: "50px" }}
                    label="Photo"
                    value="2"
                  />
                  <Tab
                    sx={{ fontSize: "12px", padding: "2px", minWidth: "50px" }}
                    label="Videos"
                    value="7"
                  />
                  <Tab
                    sx={{ fontSize: "12px", padding: "2px" }}
                    label="Follower"
                    value="4"
                  />
                  <Tab
                    sx={{ fontSize: "12px", padding: "2px" }}
                    label="Following"
                    value="5"
                  />
                  {user.role == "admin" &&
                    user.id === auth?.currentUser?.uid && (
                      <Tab
                        sx={{
                          fontSize: "12px",
                          padding: "2px",
                          minWidth: "50px",
                        }}
                        label="Admin"
                        value="6"
                      />
                    )}
                </TabList>
              </Box>
              <TabPanel
                sx={{
                  width: "100%",
                }}
                value="1"
              >
                <Box
                  sx={{
                    display: "grid",
                    gap: "20px",
                    gridTemplateColumns: "1fr 2fr",
                    "@media (max-width: 768px)": {
                      gridTemplateColumns: "1fr",
                      borderRadius: "5px",
                      width: "100%",
                    },
                  }}
                >
                  <Box
                    sx={{
                      border: "1px solid #eee",
                      boxShadow: "0 0 10px #eee",
                    }}
                  >
                    <Box
                      sx={{
                        borderBottom: "1px solid #eee",
                        margin: "0 auto",
                        textAlign: "center",
                        bgcolor: "#71bb42",
                        padding: "12px 0",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        About
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <List>
                        <ListItem button>
                          <Typography>{user?.name}</Typography>
                        </ListItem>
                        <ListItem button>
                          <Typography>{user?.email}</Typography>
                        </ListItem>
                      </List>
                    </Box>
                  </Box>
                  <Post>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "50px",
                        boxShadow: "0 0 10px #ddd",
                      }}
                    >
                      <PostComponent
                        setTotalPost={setTotalPost}
                        user={user}
                        id={id}
                      />
                    </Box>
                  </Post>
                </Box>
              </TabPanel>
              <TabPanel sx={{ width: "100%" }} value="2">
                <StandardImageList setTotalPhoto={setTotalPhoto} />
              </TabPanel>
              <TabPanel sx={{ width: "100%" }} value="7">
                <VideoList setTotalVideo={setTotalVideo} />
              </TabPanel>

              <TabPanel sx={{ width: "100%" }} value="4">
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <Followers user={user} id={id} />
                </Box>
              </TabPanel>
              <TabPanel sx={{ width: "100%" }} value="5">
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <Following user={user} id={id} />
                </Box>
              </TabPanel>
              <TabPanel sx={{ width: "100%" }} value="6">
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <Admin user={user} id={id} />
                </Box>
              </TabPanel>
            </TabContext>
          </>
        )}
      </Content>
    </Container>
  );
};

// Styled components for the skeleton loader
const SkeletonContainer = styled.div`
  padding: 20px;
`;

const SkeletonElement = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
`;

const SkeletonCoverPhoto = styled(SkeletonElement)`
  width: 100%;
  height: 300px;
  margin-bottom: 20px;
`;

const SkeletonAvatar = styled(SkeletonElement)`
  width: 100px;
  height: 100px;
  border-radius: 50%;
`;

const SkeletonUserName = styled(SkeletonElement)`
  width: 150px;
  height: 24px;
  margin-top: 10px;
`;

const SkeletonProfileInfo = styled(SkeletonElement)`
  width: 100%;
  height: 20px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

const SkeletonPost = styled(SkeletonElement)`
  width: 100%;
  height: 200px;
  margin-top: 20px;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  max-width: 1300px; /* Adjust the max width as needed */
  margin: 0 auto;
  padding: 2rem auto;
  width: 99vw;
  overflow: hidden;

  @media (max-width: 767px) {
    flex-direction: column;
    width: 100vw;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    padding: 0 5px;
    overflow: hidden;
    margin-top: 20px;
  }
  @media (min-width: 768px) and (max-width: 1023px) {
    display: flex;
    justify-content: center;
    width: 100vw;
    margin: 0 auto;
    padding: 2rem auto;
    overflow: hidden;
  }
  @media (min-width: 1024px) and (max-width: 1365px) {
    display: flex;
    justify-content: center;
    min-width: 1023px;
    margin: 0 auto;
    padding: 2rem auto;
    overflow: hidden;
    width: 100vw;
  }
`;

const Content = styled.div`
  width: 100%;
  flex: 1;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CoverPhoto = styled.img`
  width: 100%;
  height: 300px;
  min-height: 220px;
  object-fit: cover;
  border-radius: 15px;
  overflow: hidden;
  margin: 0 auto;
  margin-top: 20px;
  @media (max-width: 767px) {
    flex-direction: column;
    width: 100%;
    height: 220px;
    border-radius: 15px;
    overflow: hidden;
    margin: 0 auto;
  }
  @media (max-width: 768px) and (max-width: 1023px) {
    padding: 0 20px;
    border-radius: 15px;
    overflow: hidden;
  }
  @media (max-width: 1024px) and (max-width: 1365px) {
    padding: 0 20px;
    border-radius: 15px;
    overflow: hidden;
  }
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  margin-top: -50px;
  border: 3px solid #fff;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UserName = styled.h1`
  font-size: 24px;
  margin-top: 10px;
  @media (max-width: 1024px) {
    padding: 0 20px;
  }
`;

const ProfileInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  /* padding: 2rem 0; */
  margin: 0 auto;
`;
const Loader = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -50px;
  margin-left: 10px;
  position: relative;
`;
const CoverLoader = styled.div`
  width: 100%;
  height: 320px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Post = styled.div`
  margin-top: 20px;
  width: 100%;

  background-color: #fff;

  border-radius: 5px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  row-gap: 35px;
  box-shadow: "0 0 10px gray";
  margin: 0 auto;
`;

export default Profile;
