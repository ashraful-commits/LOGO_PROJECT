import React, { useEffect, useState } from "react";
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
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";

const SearchPage = () => {
  const [searchItem, setSearchItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const { search } = useParams();

  useEffect(() => {
    const handleSubmitSearch = async () => {
      const db = getFirestore();
      const usersCollection = collection(db, "users");

      const queryByName = query(
        usersCollection,
        where("name", ">=", search),
        where("name", "<", search + "z")
      );

      try {
        const querySnapshot = await getDocs(queryByName);

        if (querySnapshot.empty) {
          console.log("No users found with the name:", search);
          setSearchItem([]);
        } else {
          const users = [];
          querySnapshot.forEach((userDoc) => {
            const userData = userDoc.data();
            users.push(userData);
          });
          setSearchItem(users);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error finding users by name:", error);
        setLoading(false);
      }
    };

    handleSubmitSearch();
  }, [search]);

  return (
    <SearchContainer>
      <div className="container">
        {loading ? (
          <LoadingContainer>
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
            {/* Add as many skeleton components as needed */}
          </LoadingContainer>
        ) : searchItem?.length > 0 ? (
          searchItem.map((item, index) => (
            <ListItem
              sx={{
                border: "1px solid #eee",
                margin: "20px",
                boxShadow: "0 0 10px #eee",
              }}
              key={index}
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
          ))
        ) : (
          <p style={{ textAlign: "center" }}>No search item</p>
        )}
      </div>
    </SearchContainer>
  );
};

const SearchContainer = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: start;
  margin: 0 auto;
  width: 100%;

  .container {
    width: 1442px;
    margin-top: 20px;
  }
`;

const LoadingContainer = styled.div`
  /* Style your loading container here */
  display: flex;
  flex-direction: column;
`;

const LoadingSkeleton = styled.div`
  /* Style your loading skeleton here */
  height: 100px;
  width: 100%;
  background-color: #f0f0f0;
  margin-bottom: 10px;
`;

export default SearchPage;
