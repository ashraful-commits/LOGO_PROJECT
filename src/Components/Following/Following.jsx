import {
  Avatar,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { app } from "../../firebase.confige";

import { Link } from "react-router-dom";
import getDocumentById from "../../Utility/getSingleData";

const Following = ({ user, id }) => {
  const [friend, setFriends] = useState({});

  useEffect(() => {
    const fetchUserDataById = async () => {
      //======================== Get the user document by ID

      const docSnap = await getDocumentById("users", id);
      setFriends(docSnap);

      if (docSnap) {
        let userFollowingData = [];

        const userdata = docSnap;
        //=============== Fetch and set the followers' data
        userdata?.following?.forEach(async (item) => {
          const followSnp = await getDocumentById("users", item);

          userFollowingData.push(followSnp);
        });

        setFriends((prev) => ({ ...prev, following: userFollowingData }));
      } else {
        //=================== Return null if the user document does not exist
        return null;
      }
    };
    fetchUserDataById();
  }, [id]);
  return (
    <div>
      {friend?.following?.length > 0 ? (
        friend?.following?.map((item, index) => {
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
        <Box>
          <Typography>No Following</Typography>
        </Box>
      )}
    </div>
  );
};

export default Following;
