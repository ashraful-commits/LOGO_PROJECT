import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const SearchPage = () => {
  const [searchItem, setSearchItem] = useState([]);
  const { search } = useParams();

  useEffect(() => {
    const handleSubmitSerach = async (e) => {
      e.preventDefault();
      const db = getFirestore();
      const usersCollection = collection(db, "users"); // 'users' is the name of your Firestore collection

      // Create a query that filters users by name
      const queryByName = query(
        usersCollection,
        where("name", ">=", search).where("name", "<", search + "z")
      );
      try {
        const querySnapshot = await getDocs(queryByName);

        if (querySnapshot.empty) {
          console.log("No users found with the name:", name);
          return [];
        }

        const users = [];
        querySnapshot.forEach((userDoc) => {
          // Access the user data
          const userData = userDoc.data();
          console.log(userData);
          users.push(userData);
        });

        setSearchItem(users);
      } catch (error) {
        console.error("Error finding users by name:", error);
        return [];
      }
    };
    handleSubmitSerach();
  }, [search]);
  return (
    <div>
      {searchItem > 0 ? (
        searchItem.map((item, index) => {
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
              <Link to={`/${item.id}`}>
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
        <Typography>No search item</Typography>
      )}
    </div>
  );
};

export default SearchPage;
