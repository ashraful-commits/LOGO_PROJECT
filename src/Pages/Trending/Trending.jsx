import { Favorite } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FaShare, FaSms } from "react-icons/fa";
import styled from "styled-components";
import getAllDataWithSnapshot from "../../Utility/GetAllData";
import getDocumentById from "../../Utility/getSingleData";
import { convertDate } from "../../Utility/TimeStapToDate";
import { AiFillMessage } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";

const Trending = () => {
  const [trending, setTrending] = useState([]);
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
    setTrending([...filterData.filter((item) => item?.Like?.length >= 3)]);
    console.log([...filterData.filter((item) => item?.Like?.length >= 3)]);
  }, [filterData]);

  return (
    <TrendingContainer>
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
        {trending.length > 0 ? (
          trending.map((item, index) => {
            return (
              <Card key={index} sx={{ maxWidth: 345 }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "red" }} aria-label="recipe">
                      <img
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        src={item?.user?.photoURL}
                        alt=""
                      />
                    </Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                      <BsThreeDotsVertical />
                    </IconButton>
                  }
                  title={item?.user?.name}
                  subheader={convertDate(item.timestamp)}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {item.title}
                  </Typography>
                </CardContent>
                <CardMedia
                  component="video"
                  height="194"
                  src={item.video}
                  alt="Paella dish"
                  controls
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
                >
                  <Button sx={{ color: "gray" }} startIcon={<Favorite />}>
                    {item?.Like.length ? item?.Like.length : 0}
                  </Button>
                  <Button sx={{ color: "gray" }} startIcon={<AiFillMessage />}>
                    {item?.messages?.length > 0 ? item?.messages?.length : 0}
                  </Button>
                  <Button sx={{ color: "gray" }} startIcon={<FaShare />}>
                    {item?.share?.length > 0 ? item.share.length : 0}
                  </Button>
                </CardActions>
              </Card>
            );
          })
        ) : (
          <Typography sx={{ textAlign: "center" }}>
            No Trending Video
          </Typography>
        )}
      </Box>
    </TrendingContainer>
  );
};
const TrendingContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 30px;
  display: flex;
  justify-content: center;
`;
export default Trending;
