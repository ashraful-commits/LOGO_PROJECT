import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
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
import { ArrowCircleLeft } from "@mui/icons-material";

const SearchPage = () => {
  const [searchItem, setSearchItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Current page
  const [itemsPerPage] = useState(10); // Number of items per page
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

  const handleBack = () => {
    window.history.back();
  };

  // Calculate the index of the first and last item on the current page
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchItem.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setPage(pageNumber);
  };

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
          <Box>
            <Button onClick={handleBack}>
              <ArrowCircleLeft />
            </Button>
            {currentItems.map((item, index) => (
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
            ))}
            <PaginationContainer>
              {Array.from({
                length: Math.ceil(searchItem.length / itemsPerPage),
              }).map((_, index) => (
                <PaginationButton
                  key={index}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </PaginationButton>
              ))}
            </PaginationContainer>
          </Box>
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
  display: flex;
  flex-direction: column;
`;

const LoadingSkeleton = styled.div`
  height: 100px;
  width: 100%;
  background-color: #f0f0f0;
  margin-bottom: 10px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
`;

export default SearchPage;
