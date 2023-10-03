import styled from "styled-components";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import logo from "../../../public/LOGO.png";
import { useState } from "react";
import { Link } from "react-router-dom";

import { MdOutlineKeyboardArrowRight } from "react-icons/md";

import avtar1 from "../../../public/avatar1.png";
import avtar2 from "../../../public/avatar2.png";
import avtar3 from "../../../public/avatar3.png";
import avtar4 from "../../../public/avatar4.png";
import avtar5 from "../../../public/avatar5.png";
import trending from "../../../public/trendingIcn.png";
import group from "../../../public/groupIcon.png";
import play from "../../../public/playIcon.png";
import {
  Drawer,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List,
} from "@mui/material";
const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const toggleDrawer = (anchor) => {
    setShowMenu(anchor);
  };
  return (
    <Container>
      {showMenu && (
        <Drawer
          open={showMenu}
          sx={{
            width: "100px",
            height: "100vh",
            padding: "0 30px",
            transition: ".2s ease",
            transitionDelay: ".3s",
            transitionDuration: ".5s",
          }}
          onClose={() => toggleDrawer(!showMenu)}
          BackdropComponent={false}
        >
          <Toolbar>
            <Box
              sx={{
                width: "300px",
                padding: "0 30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "start",
                gap: "10px",
              }}
            >
              <IconButton onClick={() => toggleDrawer(false)}>
                <AiOutlineClose />
              </IconButton>
              <List>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <img src={trending} alt="" />
                    </ListItemIcon>
                    <ListItemText primary="Trending" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <img src={group} />
                    </ListItemIcon>
                    <ListItemText primary="Following" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <img src={play} />
                    </ListItemIcon>
                    <ListItemText primary="Following" />
                  </ListItemButton>
                </ListItem>
              </List>
              <Typography fontSize={18} fontWeight={600}>
                Popular Creators
              </Typography>
              <List>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <img src={avtar1} alt="" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Makenna Rosser"
                      secondary="@rosser_makenna"
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <img src={avtar2} alt="" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Makenna Rosser"
                      secondary="@rosser_makenna"
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <img src={avtar3} alt="" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Makenna Rosser"
                      secondary="@rosser_makenna"
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <img src={avtar4} alt="" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Makenna Rosser"
                      secondary="@rosser_makenna"
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <img src={avtar5} alt="" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Makenna Rosser"
                      secondary="@rosser_makenna"
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </Toolbar>
        </Drawer>
      )}
      <div className="container">
        <div className="left">
          {/* small menu  */}
          <div className="small-menu">
            <button onClick={() => setShowMenu(!showMenu)}>
              <AiOutlineMenu />
              <span>Menu</span>
              <img src={logo} alt="" />
            </button>
          </div>
          {/* search field  */}
        </div>

        <div className="right">
          <div className="search-field">
            <form action="">
              <CiSearch />
              <input type="text" placeholder="Search" />
            </form>
          </div>
          <div className="logo">
            <img src={logo} alt="" />
          </div>

          <div className="creator">
            <span>Creator</span>
            <button>Get App</button>
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 75px;
  flex-shrink: 0;
  background: #fff;
  display: flex;
  justify-content: center;
  .MuiPaper-root {
    .drawer {
      width: 100%;
      height: 100%;

      background-color: red;
      .trending-following-explore {
        width: 100%;
        height: fit-content;
        display: flex;
        justify-content: start;
        align-items: start;
        ul {
          display: flex;
          flex-direction: column;
          gap: 20px;
          li {
            a {
              color: #000;
              font-family: Poppins;
              font-size: 18px;
              font-style: normal;
              font-weight: 500;
              line-height: normal;
              display: flex;
              gap: 4px;
              color: black;

              &:hover {
                color: var(--secondary-text-color);
              }
            }
          }
        }
      }
      .popular {
        width: 100%;
        height: 380px;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: start;
        margin-top: 42px;
        h4 {
          color: #000;
          font-family: Poppins;
          font-size: 18px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
        }
        .popular-creators {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 16px;
          .popular-creator {
            display: flex;
            gap: 7px;
            .avatar {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 40px;
              height: 40px;
              img {
                flex-shrink: 0;
              }
            }
            .creator-details {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: start;
              p {
                margin-bottom: 0;
                color: #000;
                font-family: Poppins;
                font-size: 14px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
              }
              span {
                color: #4f4f4f;
                font-family: Poppins;
                font-size: 10px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
              }
            }
          }
        }
        a {
          color: #3c3c3c;
          font-family: Poppins;
          font-size: 14px;
          font-style: normal;
          margin-top: 20px;
          font-weight: 400;
          line-height: normal;
          display: flex;
          align-items: center;
          svg {
            font-size: 15px;
            margin-left: 2px;
            margin-top: 2px;
          }
        }
      }
      .close {
        top: 10%;
        right: 10%;
        position: absolute;
        button {
          border: none;
          background-color: transparent;
          svg {
            font-size: 24px;
          }
        }
      }
    }
  }
  .container {
    position: relative;
    width: 1440px;
    display: grid;
    margin: 0 auto;
    grid-template-columns: 126px auto;
    align-items: center;
    .left {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      border-right: 1px solid gray;
      height: 40px;
      .small-menu {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 7px;

        button {
          display: flex;
          justify-content: center;
          gap: 8px;
          align-items: center;
          border: none;
          background-color: transparent;
          svg {
            font-size: 22px;
          }
          span {
            color: #000;
            text-align: center;
            font-family: Roboto;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            text-transform: capitalize;
          }
          img {
            display: none;
          }
        }
      }
    }
    .right {
      display: grid;

      grid-template-columns: 1fr 780px 1fr;
      .search-field {
        margin-left: 25px;
        display: flex;
        align-items: center;
        form {
          display: flex;
          justify-content: start;
          align-items: center;
          gap: 7px;

          svg {
            font-size: 25px;
          }
          input {
            border: none;
            font-family: Poppins;
            font-size: 14px;
            font-weight: 400;
            line-height: 21px;
            letter-spacing: 0em;
            text-align: left;

            &:focus {
              outline: none;
            }
          }
        }
      }
      .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 56px;
          height: 30px;
          object-fit: contain;
          margin-right: 132px;
        }
      }
      .creator {
        border-left: 1px solid gray;
        padding-left: 25px;
        display: flex;
        justify-content: start;
        align-items: center;
        gap: 16px;
        span {
          color: #3c3c3c;
          font-family: Poppins;
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
        }
        button {
          width: 93px;
          height: 40px;
          flex-shrink: 0;
          color: #fff;
          font-family: Poppins;
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: 30px;
          border: none;
          border-radius: 50px;
          background-image: linear-gradient(#8fdd5d, #71bb42);
        }
      }
    }
    /* Styles for mobile devices */
  }
  @media (max-width: 768px) {
    width: 100%;
    .container {
      width: 100%;
      grid-template-columns: 1fr 2fr;
      justify-content: space-between;
      .left {
        border-right: 0px solid gray;
        display: flex;
        justify-content: start;
        .small-menu {
          display: flex;
          justify-content: start;
          align-items: center;
          padding-left: 12px;
          button {
            span {
              display: none;
            }
            img {
              display: block;
            }
          }
        }
      }
      .right {
        display: flex;
        justify-content: space-between;
        .search-field {
          display: flex;
          justify-content: end;
          align-items: center;
          form {
            svg {
              font-size: 25px;
            }
            input {
              display: none;

              &:focus {
                outline: none;
              }
            }
          }
        }
        .logo {
          display: flex;
          display: none;
          align-items: center;
          justify-content: center;
          img {
            display: none;
          }
        }
        .creator {
          border-left: 0px solid gray;
          display: flex;
          padding: 20px;

          span {
            display: none;
            color: #3c3c3c;
            font-family: Poppins;
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
          }
          button {
            width: 93px;
            height: 40px;
            flex-shrink: 0;
            color: #fff;
            font-family: Poppins;
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 30px;
            border: none;
            border-radius: 50px;
            background-image: linear-gradient(#8fdd5d, #71bb42);
          }
        }
      }
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 100%;
    .container {
      width: 100%;
      grid-template-columns: 1fr 2fr;
      justify-content: space-between;
      padding: 0 30px;
      .left {
        border-right: 0px solid gray;
        display: flex;
        justify-content: start;
        .small-menu {
          display: flex;
          justify-content: start;
          align-items: center;
          padding-left: 12px;
          button {
            span {
              display: none;
            }
            img {
              display: block;
            }
          }
        }
      }
      .right {
        display: flex;
        justify-content: space-between;
        .search-field {
          display: flex;
          justify-content: end;
          align-items: center;
          form {
            svg {
              font-size: 25px;
            }
            input {
              &:focus {
                outline: none;
              }
            }
          }
        }
        .logo {
          display: flex;
          display: none;
          align-items: center;
          justify-content: center;
          img {
          }
        }
        .creator {
          border-left: 0px solid gray;
          display: flex;
          padding: 20px;

          span {
            display: none;
            color: #3c3c3c;
            font-family: Poppins;
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
          }
          button {
            width: 93px;
            height: 40px;
            flex-shrink: 0;
            color: #fff;
            font-family: Poppins;
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 30px;
            border: none;
            border-radius: 50px;
            background-image: linear-gradient(#8fdd5d, #71bb42);
          }
        }
      }
    }
  }
  @media (min-width: 1025px) and (max-width: 1441px) {
    width: 100%;
    .container {
      width: 100%;
      grid-template-columns: 1fr 2fr;
      justify-content: space-between;
      padding: 0 50px;
    }
  }
`;
export default Navbar;
