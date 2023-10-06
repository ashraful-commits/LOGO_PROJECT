import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaUserFriends, FaImage, FaThumbsUp, FaComment } from "react-icons/fa";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { AiOutlineMenu } from "react-icons/ai";
import PostComponent from "../../Components/PostComponent/PostComponent";

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
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);

  // Simulate loading for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <Container>
      {/* Left sidebar for desktop and tablet */}
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
              <InfoItem>
                <FaUserFriends /> {dummyData.friends} Friends
              </InfoItem>
              <InfoItem>
                <FaImage /> {dummyData.photos} Photos
              </InfoItem>
              <InfoItem>
                <FaThumbsUp /> {dummyData.posts} Posts
              </InfoItem>
            </ProfileInfo>
            <Post>
              <PostComponent />
              <PostComponent />
              <PostComponent />
              <PostComponent />
              <PostComponent />
              <PostComponent />
            </Post>
          </>
        )}

        {/* Mobile sidebar button */}
        <MobileSidebarButton onClick={toggleMobileSidebar}>
          <AiOutlineMenu size={"20"} />
        </MobileSidebarButton>

        {/* Mobile sidebar */}
        <Drawer
          anchor="right"
          open={isMobileSidebarOpen}
          onClose={toggleMobileSidebar}
        >
          <SidebarContent>
            <List>
              <ListItem button>
                <ListItemIcon>
                  <FaUserFriends />
                </ListItemIcon>
                <ListItemText primary="Friends" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <FaImage />
                </ListItemIcon>
                <ListItemText primary="Photos" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <FaThumbsUp />
                </ListItemIcon>
                <ListItemText primary="Posts" />
              </ListItem>
            </List>
          </SidebarContent>
        </Drawer>
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
  width: 100%; /* Make the container responsive */

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
  width: 250px;
  background-color: #f0f0f0;
  overflow-y: auto;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Content = styled.div`
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

const ProfileInfo = styled.ul`
  list-style: none;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 0;
`;

const InfoItem = styled.li`
  margin: 0 20px;
  font-size: 18px;
  display: flex;
  align-items: center;
`;

const Post = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MobileSidebarButton = styled.button`
  position: absolute;
  top: 8%;
  right: 0px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  z-index: 100;
  background-color: #fff;
  padding: 5px 10px;
`;

const SidebarContent = styled.div`
  padding: 20px;
`;

export default Profile;
