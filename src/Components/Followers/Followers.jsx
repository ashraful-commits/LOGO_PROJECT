import {
  Avatar,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";

import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import getDocumentById from "../../Utility/getSingleData";

const Followers = ({ user, id }) => {
  //================= State to store the user and their followers
  const [friend, setFriends] = useState({});

  useEffect(() => {
    const fetchUserDataById = async () => {
      //===================== Get the user document by ID

      const docSnap = await getDocumentById("users", id);
      setFriends(docSnap);
      if (docSnap) {
        let userFollowersData = [];
        const userData = docSnap;

        //===================== Fetch and set the followers user' data
        userData?.followers?.forEach(async (item) => {
          const followSnp = await getDocumentById("users", item);

          userFollowersData.push(followSnp);
        });
        //====================== Set the user's data
        setFriends((prev) => ({ ...prev, followers: userFollowersData }));
      } else {
        //======================= Return null if the user document does not exist
        return null;
      }
    };
    fetchUserDataById();
  }, [id]);
  return (
    <Box
      sx={{
        width: "100%",
        boxShadow: "0 0 10px #eee",
        padding: "10px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "10px",
        "@media (max-width:767px)": {
          gridTemplateColumns: "1fr",
        },
        "@media (min-width:768px) and (max-width:1023px)": {
          gridTemplateColumns: "1fr 1fr",
        },
      }}
    >
      {friend?.followers?.length > 0 ? (
        friend?.followers?.map((item, index) => {
          return (
            <ListItem
              key={index}
              sx={{
                width: "350px",
                border: "1px solid #eee",
                "@media (max-width: 768px)": {
                  width: "100%",
                },
                "@media (max-width: 1024px) and (min-width: 769px)": {
                  width: "430px",
                },
                "@media (min-width: 1025px) and (min-width: 1442px)": {
                  width: "430px",
                },
              }}
              alignItems="flex-start"
            >
              <ListItemAvatar>
                <Avatar alt="Travis Howard" src={item?.photoURL} />
              </ListItemAvatar>
              <Link to={`/${item?.id}`}>
                <ListItemText
                  primary={item?.name}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {item?.email}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </Link>
            </ListItem>
          );
        })
      ) : (
        //================== no data no followers
        <Box>
          <Typography>No Followers</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Followers;
