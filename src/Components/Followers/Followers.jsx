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

const Followers = ({ user, id }) => {
  const [friend, setFriends] = useState({});

  useEffect(() => {
    const db = getFirestore(app);
    const fetchUserDataById = async () => {
      const docRef = doc(db, "users", id); // Assuming "users" is the collection name
      const docSnap = await getDoc(docRef);
      setFriends(docSnap.data());
      if (docSnap.exists()) {
        let user = [];
        const userdata = docSnap.data();
        userdata.followers.forEach(async (item) => {
          const followersRef = doc(db, "users", item);
          const followSnp = await getDoc(followersRef);
          user.push(followSnp.data());
        });
        setFriends((prev) => ({ ...prev, followers: user }));
      } else {
        // Return null if the user document does not exist
        return null;
      }
    };
    fetchUserDataById();
  }, [id]);
  return (
    <div>
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
        <Box>
          <Typography>No Followers</Typography>
        </Box>
      )}
    </div>
  );
};

export default Followers;
