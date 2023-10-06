import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";

const Friends = () => {
  return (
    <div>
      <ListItem
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
          <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary="Summer BBQ"
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                to Scott, Alex, Jennifer
              </Typography>
              {" — Wish I could come, but I'm out of town this…"}
            </React.Fragment>
          }
        />
      </ListItem>
    </div>
  );
};

export default Friends;
