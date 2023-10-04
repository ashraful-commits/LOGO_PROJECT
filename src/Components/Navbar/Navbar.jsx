import styled from "styled-components";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import logo from "../../../public/LOGO.png";
import { useEffect, useState } from "react";
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
  Typography,
  IconButton,
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay (you can replace this with actual data fetching logic)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <Container>
          <SkeletonContent>
            <div className="left">
              <SmallMenuButton>
                <span></span>
                <SkeletonLogo />
              </SmallMenuButton>
            </div>
            <div className="right">
              <SearchField>
                <SkeletonSearch />
              </SearchField>
              <Logo>
                <SkeletonLogo />
              </Logo>
              <Creator>
                <SkeletonCreatorButton />
              </Creator>
            </div>
          </SkeletonContent>
        </Container>
      ) : (
        <Container>
          {showMenu && (
            <Drawer
              anchor="left"
              open={showMenu}
              onClose={() => toggleDrawer(!showMenu)}
              hideBackdrop={true}
            >
              <Box
                sx={{
                  width: "300px",
                  padding: "30px 30px",
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
                <List sx={{ padding: "50px 0" }}>
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
      )}
    </>
  );
};

const Container = styled.div`
  width: 100%;
  height: 75px;
  flex-shrink: 0;
  background: #fff;
  display: flex;
  justify-content: center;
  position: relative;
  .MuiPaper-root {
    transition: all 0.5s ease-in-out !important;
    opacity: 0;
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
          padding: 10px;
          transition: all 0.2s ease-in-out 0.1s;
          &:hover {
            background-color: #8fdd5d;
            svg {
              color: white;
            }
            span {
              color: white;
            }
          }
          svg {
            font-size: 22px;
            transition: all 0.2s ease-in-out 0.1s;
          }
          span {
            transition: all 0.2s ease-in-out 0.1s;
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
            cursor: pointer;
            &:hover {
              color: #71bb42;
            }
          }
          input {
            border: none;
            font-family: Poppins;
            font-size: 14px;
            font-weight: 400;
            line-height: 21px;
            letter-spacing: 0em;
            text-align: left;
            padding: 0 5px;
            border-left: 1px solid white;

            &:focus {
              outline: none;
              border-left: 1px solid #71bb42;
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
        position: relative;
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
          transition: all 0.5s ease-in-out;
          position: relative;
          &:hover {
            background-image: linear-gradient(#71bb42, #8fdd5d);
          }
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
        width: 100%;
        border-right: 0px solid gray;
        display: flex;
        justify-content: start;
        .small-menu {
          display: flex;
          justify-content: start;
          align-items: center;
          padding-left: 50px;
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
        width: 100%;
        display: flex;
        justify-content: space-between;
        .search-field {
          position: relative;
          &:hover input {
            max-width: 200px; /* Adjust the max-width value as needed */
            opacity: 1;
          }
          form {
            transition: all 0.5s ease-in-out 0.1s;
            &:hover {
              input {
                display: block;
              }
            }
            input {
              position: absolute; /* Position the input absolutely */
              display: block;
              max-width: 0;
              opacity: 0;
              transition: max-width 0.5s ease-in-out, opacity 0.5s ease-in-out;
            }
            svg {
              font-size: 25px;
              transition: all 0.5s ease-in-out 0.1s; /* Apply transition to the SVG element */
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
          padding-right: 70px;

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

const SkeletonContent = styled.div`
  width: 1442px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px;
  .left,
  .right {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  margin-left: 25px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SmallMenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  background-color: transparent;
  padding: 10px;
`;

const SearchField = styled.div`
  margin-left: 25px;
  @media (max-width: 768px) {
    display: none;
  }
`;

const Logo = styled.div`
  margin-left: 25px;
`;

const Creator = styled.div`
  margin-left: 25px;
`;

const SkeletonLogo = styled.div`
  width: 56px;
  height: 30px;
  background-color: #ddd; /* Placeholder background color */
`;

const SkeletonSearch = styled.div`
  width: 200px;
  height: 40px;
  background-color: #ddd; /* Placeholder background color */
`;

const SkeletonCreatorButton = styled.div`
  width: 50px;
  height: 40px;
  background-color: #ddd; /* Placeholder background color */
`;
export default Navbar;
