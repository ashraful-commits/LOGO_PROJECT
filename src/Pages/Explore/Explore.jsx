import { Box, Card, CardMedia, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import styled from "styled-components";
import getAllDataWithSnapshot from "../../Utility/GetAllData";
import getDocumentById from "../../Utility/getSingleData";

import { Link } from "react-router-dom";

const Explore = () => {
  const [Explore, setExplore] = useState([]);
  const [filterData, setFilterData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      getAllDataWithSnapshot("Posts", (data) => {
        let postWithUser = [];

        data.forEach(async (item) => {
          const userData = await getDocumentById(
            "users",
            item.id,
            (userData) => {
              postWithUser.push({ ...item, user: userData });
            }
          );
          setFilterData((prev) => [...prev, { ...item, user: userData }]);
        });
      });
    };
    fetchData();
  }, []);
  useEffect(() => {
    setExplore([...filterData.filter((item) => item?.Like?.length >= 3)]);
    console.log([...filterData.filter((item) => item?.Like?.length >= 3)]);
  }, [filterData]);

  return (
    <ExploreContainer>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "10px",

          alignContent: "center",
          marginTop: "20px",
          "@media (max-width:767px)": {
            gridTemplateColumns: "1fr ",
          },
          "@media (min-width:768px) and (max-width:1023px)": {
            gridTemplateColumns: "1fr 1fr 1fr",
          },
        }}
      >
        {Explore.length > 0 ? (
          Explore.map((item, index) => {
            return (
              <Link to={`/${item?.user?.id}`} key={index}>
                <Card key={index} sx={{ maxWidth: 345 }}>
                  <CardMedia
                    component="video"
                    height="194"
                    src={item.video}
                    alt="Paella dish"
                    controls
                  />
                </Card>
              </Link>
            );
          })
        ) : (
          <Typography sx={{ textAlign: "center" }}>No Explore Video</Typography>
        )}
      </Box>
    </ExploreContainer>
  );
};
const ExploreContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 30px;
  display: flex;
  justify-content: center;
`;
export default Explore;
