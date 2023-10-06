import React, { useEffect, useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";

import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseCircleOutlineSharpIcon from "@mui/icons-material/PauseCircleOutlineSharp";
import ChatIcon from "@mui/icons-material/Chat";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import Skeleton from "@mui/material/Skeleton";
import ReactPlayer from "react-player";
import avatar1 from "../../../public/avatar1.png";

import { Box } from "@mui/material";
const PostComponent = ({ desc, thumbnailUrl, videoUrl, title }) => {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef();
  const [loading, setLoading] = useState(true);

  const togglePlay = () => {
    setPlaying(!playing);
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setPlaying(true);
          videoRef.current?.seekTo(0);
        } else {
          setPlaying(false);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <Card
      sx={{
        width: "100%",
        "@media (max-width: 768px)": {
          paddingTop: "10px", // Adjust the aspect ratio for screens <= 768px width
        },
      }}
    >
      {loading ? (
        <Skeleton variant="rectangular" width={"100%"} height={671.334} />
      ) : (
        <Box>
          <CardHeader
            sx={{
              width: "100%",
              borderBottom: "1px solid #eeeeee",
            }}
            avatar={<Avatar alt="User Avatar" src={avatar1} />}
            title="Makenna Rosser"
            subheader="@rosser_makenna"
            action={
              <Button
                sx={{
                  backgroundColor: "#71bb42",
                  color: "white",
                  borderRadius: "50px",
                  fontSize: "12px",

                  padding: "8px 15px",
                  "&:hover": {
                    bgcolor: "#5a9600",
                  },
                }}
              >
                Follow
              </Button>
            }
          />
          <Box
            sx={{
              "@media (max-width: 768px)": {
                display: "grid",
                width: "100%",
                gridTemplateColumns: "1fr",
              },
              "@media (max-width: 1024px) and (min-width: 769px)": {
                display: "grid",
                gridTemplateColumns: "auto 60px",
                gridTemplateRows: "1fr",
              },
              "@media (min-width: 1025px) and (min-width: 1442px)": {
                display: "grid",
                gridTemplateColumns: "auto 60px",
                gridTemplateRows: "3fr",
              },
            }}
          >
            <Box>
              <CardContent sx={{ width: "100%" }}>
                <Typography variant="body2" color="textSecondary" component="p">
                  {title}
                </Typography>
              </CardContent>
              <CardMedia
                component="div"
                ref={videoRef}
                sx={{
                  width: "100%",
                  height: "570px",
                  position: "relative",

                  padding: "0px",
                }}
                // 16:9 aspect ratio
              >
                {!playing ? (
                  <img
                    src={thumbnailUrl}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : null}
                <Button
                  sx={{
                    position: "absolute",
                    top: "40%",
                    left: "44%",
                    color: "#71bb42",
                    opacity: 0,
                    "&:hover": {
                      opacity: 1,
                    },
                  }}
                  onClick={togglePlay}
                >
                  {playing ? (
                    <PauseCircleOutlineSharpIcon sx={{ fontSize: "2.4rem" }} />
                  ) : (
                    <PlayArrowIcon sx={{ fontSize: "2.4rem" }} />
                  )}
                </Button>
                <ReactPlayer
                  url={videoUrl}
                  width="100%"
                  height="100%"
                  controls={false}
                  playing={playing}
                />
              </CardMedia>
            </Box>
            <CardActions
              sx={{
                display: "flex",
                justifyContent: "space-around",
                borderTop: "1px solid #ece9e9",
                "@media (max-width: 1024px) and (min-width: 769px)": {
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "end",
                  alignItems: "end",
                },
                "@media (min-width: 1025px) and (min-width: 1442px)": {
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "end",
                  alignItems: "end",
                },
              }}
            >
              <Button
                sx={{
                  "@media (max-width: 1024px) and (min-width: 769px)": {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "end",
                    alignItems: "center",
                  },
                  "@media (min-width: 1025px) and (min-width: 1442px)": {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "end",
                    alignItems: "center",
                  },
                }}
              >
                <IconButton>
                  <FavoriteIcon />
                </IconButton>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="span"
                >
                  22 M
                </Typography>
              </Button>
              <Button
                sx={{
                  "@media (max-width: 1024px) and (min-width: 769px)": {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "end",
                    alignItems: "center",
                  },
                  "@media (min-width: 1025px) and (min-width: 1442px)": {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "end",
                    alignItems: "center",
                  },
                }}
              >
                <IconButton>
                  <ChatIcon />
                </IconButton>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="span"
                >
                  15.5 k
                </Typography>
              </Button>
              <Button
                sx={{
                  "@media (max-width: 1024px) and (min-width: 769px)": {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "end",
                    alignItems: "center",
                  },
                  "@media (min-width: 1025px) and (min-width: 1442px)": {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "end",
                    alignItems: "center",
                  },
                }}
              >
                <IconButton>
                  <ShareIcon />
                </IconButton>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="span"
                >
                  3.5 k
                </Typography>
              </Button>
            </CardActions>
          </Box>
        </Box>
      )}
    </Card>
  );
};

export default PostComponent;
