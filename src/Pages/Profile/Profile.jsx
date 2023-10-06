import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaUserFriends, FaImage, FaRegThumbsUp } from "react-icons/fa";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import ListItemText from "@mui/material/ListItemText";

import PostComponent from "../../Components/ProfilePost/ProfilePost";
import { Box, ListItemAvatar, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import StandardImageList from "../../Components/ImageList/ImgaeList";
import Friends from "../../Components/Friends/Friends";

const dummyData = {
  // Replace with your Google Photos image links
  coverImage:
    "https://marketplace.canva.com/EAFMUqABEj8/1/0/1600w/canva-pink-minimalist-motivational-quote-facebook-cover-4i1_4CirhhQ.jpg",
  profileImage:
    "https://media.istockphoto.com/id/1327685828/photo/hand-holding-heart-against-a-sun.jpg?s=612x612&w=0&k=20&c=sByMgbqvtec1-LeOmtscSQXH_SZV1jT0Xbct4E2u1kE=",
  name: "John Doe",
  friends: 500,
  posts: 100,
  photos: 300,
};

const Profile = () => {
  const [isLoading, setLoading] = useState(true);

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
            <CoverPhoto src={dummyData.coverImage} alt="Cover" />
            <Avatar src={dummyData.profileImage} alt="Avatar" />
            <UserName>{dummyData.name}</UserName>
            <ProfileInfo>
              <List sx={{ display: "flex", gap: "10px" }}>
                <ListItem>
                  <ListItemAvatar>
                    <FaUserFriends color="#71bb42" size={"32"} />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Friends"
                    sx={{ color: "#71bb42", fontSize: "13", fontWeight: "700" }}
                    secondary={`${dummyData.friends}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <FaImage color="#71bb42" size={"32"} />
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ color: "#71bb42", fontSize: "13", fontWeight: "700" }}
                    primary="Photos"
                    secondary={`${dummyData.photos}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <FaRegThumbsUp color="#71bb42" size={"32"} />
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ color: "#71bb42", fontSize: "13", fontWeight: "700" }}
                    primary="Posts"
                    secondary={`${dummyData.posts}`}
                  />
                </ListItem>
              </List>
            </ProfileInfo>

            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Post" value="1" />
                  <Tab label="Photo" value="2" />
                  <Tab label="Friends" value="3" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    "@media (max-width: 768px)": {
                      gridTemplateColumns: "1fr",
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
                        gap: "50px",
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
              <TabPanel value="2">
                <StandardImageList />
              </TabPanel>
              <TabPanel value="3">
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
  margin-top: 30px;
  border-radius: 10px;
  @media (max-width: 768px) {
    display: none;
  }
`;

const Content = styled.div`
  width: 100%;
  flex: 1;
  padding: 20px;
`;

const CoverPhoto = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
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
`;

const ProfileInfo = styled.div`
  width: 100%;
  list-style: none;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding: 2rem 0;
`;

const Post = styled.div`
  margin-top: 20px;
  width: 100%;
  padding: 10px 10px;
  background-color: #fff;

  border-radius: 5px;
  display: flex;
  flex-direction: row;
  gap: 35px;
  box-shadow: "0 0 10px gray";
  align-items: center;
`;

export default Profile;
