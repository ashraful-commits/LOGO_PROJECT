import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaUserFriends, FaImage, FaRegThumbsUp } from "react-icons/fa";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import ListItemText from "@mui/material/ListItemText";

import PostComponent from "../../Components/ProfilePost/ProfilePost";
import { Box, Input, ListItemAvatar, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import StandardImageList from "../../Components/ImageList/ImgaeList";
import Friends from "../../Components/Friends/Friends";
import { AiFillFileImage } from "react-icons/ai";
import { getAuth, updateProfile } from "firebase/auth";
import { app } from "../../firebase.confige";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
const Profile = () => {
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  // Simulate loading for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  }, [user]);
  //================================
  const handleProfile = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Initialize Firebase Authentication
      const auth = getAuth(app);

      // Get the currently signed-in user
      const user = auth?.currentUser;
      console.log(user);
      // Create a reference to the Firebase Storage bucket
      const storage = getStorage();
      const storageRef = ref(
        storage,
        "profilePhotos/" + user?.uid + "/" + file.name
      );

      // Upload the file to Firebase Storage
      uploadBytes(storageRef, file)
        .then((snapshot) => {
          console.log("Uploaded a blob or file!");

          // Get the download URL of the uploaded file
          getDownloadURL(storageRef)
            .then((downloadURL) => {
              // Update the user's profile photoURL with the download URL
              const user = JSON.parse(localStorage.getItem("user"));
              user.photoURL = downloadURL;
              localStorage.setItem("user", JSON.parse(user));

              updateProfile(user, {
                photoURL: downloadURL,
              })
                .then(() => {
                  console.log("Profile photo updated!");
                  console.log(auth.currentUser);
                })
                .catch((error) => {
                  console.error("Error updating profile:", error);
                });
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
            });
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  };
  return (
    <Container>
      {/* Left sidebar for desktop and tablet */}

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
            {user?.coverImage ? (
              <CoverPhoto src={user?.coverImage} alt="Cover" />
            ) : (
              <CoverPhoto
                src="https://2.bp.blogspot.com/-nfvjMm5r4HE/UAEzYD80HII/AAAAAAAAARA/CASgQfzOD3w/s1600/free-facebook-cover-photo-make-your-own.jpg"
                alt="Cover"
              />
            )}
            <Box sx={{ position: "relative" }}>
              {user?.photoURL ? (
                <Avatar src={user?.photoURL} alt="Avatar" />
              ) : (
                <Avatar
                  src="https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png"
                  alt="Avatar"
                />
              )}
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  left: 50,
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
                  <FaImage size={"20"} />
                </label>
                <Input
                  onChange={handleProfile}
                  sx={{ display: "none" }}
                  type="file"
                  id="profile"
                />
              </Box>
            </Box>

            <UserName>{user?.displayName}</UserName>
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
                    secondary={`${user?.friends}`}
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
                    <FaImage color="#71bb42" size={"32"} />
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
                    secondary={`${user?.photos}`}
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
                    secondary={`${user?.posts}`}
                  />
                </ListItem>
              </List>
            </ProfileInfo>

            <TabContext value={value}>
              <Box
                sx={{
                  width: "100%",
                  borderBottom: 1,
                  padding: "0px",
                  borderColor: "divider",
                }}
              >
                <TabList
                  sx={{ width: "100%" }}
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Post" value="1" />
                  <Tab label="Photo" value="2" />
                  <Tab label="Friends" value="3" />
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

                      width: "100%",
                    },
                  }}
                >
                  <LeftSidebar>
                    {/* Add your left sidebar content here */}
                    <List>
                      <ListItem button>
                        <ListItemText primary="Left Sidebar Item 1" />
                      </ListItem>
                      <ListItem button>
                        <ListItemText primary="Left Sidebar Item 2" />
                      </ListItem>
                    </List>
                  </LeftSidebar>
                  <Post>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "50px",
                      }}
                    >
                      <PostComponent />
                      <PostComponent />
                      <PostComponent />
                      <PostComponent />
                      <PostComponent />
                    </Box>
                  </Post>
                </Box>
              </TabPanel>
              <TabPanel sx={{ width: "100%" }} value="2">
                <StandardImageList />
              </TabPanel>
              <TabPanel sx={{ width: "100%" }} value="3">
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <Friends />
                  <Friends />
                  <Friends />
                  <Friends />
                  <Friends />
                  <Friends />
                  <Friends />
                  <Friends />
                  <Friends />
                  <Friends />
                  <Friends />
                  <Friends />
                  <Friends />
                  <Friends />
                  <Friends />
                  <Friends />
                  <Friends />
                  <Friends />
                  <Friends />
                  <Friends />
                  <Friends />
                  <Friends />
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
  max-width: 1440px; /* Adjust the max width as needed */
  margin: 0 auto;
  padding: 2rem auto;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    padding: 0 1rem;
  }
  @media (max-width: 1024px) {
    flex-direction: row;
    width: 100%;
  }
`;

const LeftSidebar = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  border: 1px solid #eee;

  border-radius: 10px;
  @media (max-width: 768px) {
    display: none;
  }
`;

const Content = styled.div`
  width: 100%;
  flex: 1;
  margin: 0 auto;
`;

const CoverPhoto = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
  margin-top: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    height: 220px;
    border-radius: 40px;
  }
  @media (max-width: 1024px) {
    padding: 0 20px;
    border-radius: 50px;
  }
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  margin-top: -50px;
  border: 3px solid #fff;
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
  align-items: center;
  margin: 0 auto;
`;

export default Profile;
