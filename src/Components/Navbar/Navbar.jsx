// Import necessary dependencies and components
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Header from "../Header/Header";
import styled from "styled-components";
import {
  AiFillFacebook,
  AiFillGoogleCircle,
  AiOutlineClose,
  AiOutlineLogout,
  AiOutlineMenu,
} from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import logo from "../../../public/LOGO.png";
import avtar1 from "../../../public/avatar1.png";
import avtar2 from "../../../public/avatar2.png";
import avtar3 from "../../../public/avatar3.png";
import avtar4 from "../../../public/avatar4.png";
import avtar5 from "../../../public/avatar5.png";
import trending from "../../../public/trendingIcn.png";
import group from "../../../public/groupIcon.png";
import play from "../../../public/playIcon.png";
import {} from "firebase/firestore";
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
  Modal,
  Grid,
  TextField,
  Button,
  Tab,
} from "@mui/material";

// Import Firebase Authentication functions and configuration
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "../../firebase.confige"; // Ensure that your Firebase configuration is correctly set up
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { GoogleAuthProvider } from "firebase/auth";

import Login from "../Login/Login";
import Register from "../Register/Register";
import useOpen from "../../hooks/useOpen";

// Define the Navbar component
const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  // Function to toggle the menu
  const toggleDrawer = () => {
    setShowMenu(!showMenu);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the delay as needed
    return () => clearTimeout(timer);
  }, []);

  const { open, setOpen } = useOpen();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle user logout
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        localStorage.clear();
        setUser(null);
        toast("Logout successful!", {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setUser(null);
      })
      .catch((error) => {
        const message = error.message;
        toast(message, {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  const [user, setUser] = useState(null);
  const auth = getAuth(app);

  const navigate = useNavigate();
  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        setUser(user);
      } else {
        // No user is signed in.
        setUser(null);
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [auth, user, navigate]);
  const [search, setSearch] = useState("");
  const [redirect, setRedirect] = useState("Login");
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
          <div className="nav-container">
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "160px",
                  width: "100%",
                }}
              >
                {redirect === "Login" ? (
                  <Login
                    setUser={setUser}
                    setOpen={setOpen}
                    setRedirect={setRedirect}
                  />
                ) : (
                  <Register setOpen={setOpen} setRedirect={setRedirect} />
                )}
              </Box>
            </Modal>
          </div>
          <Drawer open={showMenu} onClose={() => toggleDrawer(false)}>
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
              <IconButton
                sx={{ position: "absolute", top: "2%", right: "10%" }}
                onClick={() => toggleDrawer(false)}
              >
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

          <div className="container">
            <div className="left">
              {/* small menu  */}
              <div className="small-menu">
                <button onClick={() => setShowMenu(!showMenu)}>
                  <AiOutlineMenu />
                  <span>Menu</span>
                </button>

                <Link to={"/"}>
                  <img src={logo} alt="" />
                </Link>
              </div>
              {/* search field  */}
            </div>

            <div className="right">
              <div className="search-field">
                <form>
                  <Link to={`/search/${search}`}>
                    <CiSearch />
                  </Link>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    placeholder="Search"
                  />
                </form>
              </div>
              <div className="logo">
                <Link to="/">
                  <img src={logo} alt="" />
                </Link>
              </div>
              {user && (
                <div className="loginAvatar">
                  <Link to={`/${user?.uid}`}>
                    {user?.photoURL ? (
                      <img src={user?.photoURL} alt="avatar" />
                    ) : (
                      <img
                        src={`https://img.freepik.com/premium-vector/young-smiling-man-avatar-man-with-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-3d-vector-people-character-illustration-cartoon-minimal-style_365941-860.jpg`}
                        alt="avatar"
                      />
                    )}
                  </Link>
                </div>
              )}

              {user ? (
                <button className="logout" onClick={handleLogout}>
                  <AiOutlineLogout />
                </button>
              ) : (
                <button onClick={handleOpen}>Login</button>
              )}
              <div className="creator">
                <Link>Creator</Link>
                <button>Get App</button>
              </div>
            </div>
          </div>
        </Container>
      )}
    </>
  );
};
/* Your container styles */
const Container = styled.div`
  width: 100%;
  height: 75px;
  flex-shrink: 0;
  background: #fff;
  display: flex;
  justify-content: center;
  position: relative;
  .nav-container {
    display: flex;
    justify-content: center;
    align-items: center;
    .login_container {
      display: flex;
      flex-direction: column;
    }
  }
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
        gap: 10px;

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
        a {
          display: none;
          cursor: pointer;
        }
      }
    }
    .right {
      display: grid;
      align-items: center;
      justify-content: center;
      grid-template-columns: 1fr 780px 1fr 1fr 1fr;
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
      .logout {
        width: 40px;
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
        display: flex;
        justify-content: center;
        align-items: center;
        svg {
          font-size: 20px;
        }
        &:hover {
          background-image: linear-gradient(#71bb42, #8fdd5d);
        }
      }
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
            padding: 5px 5px;
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
      .loginAvatar {
        width: 50px;
        height: 50px;
        overflow: hidden;
        margin-top: 10px;
        border: 2px solid white;
        background-color: white;
        a {
          width: 100%;
          height: 100%;

          overflow: hidden;
          overflow: hidden;
          img {
            width: 40px;
            border-radius: 100%;
            height: 40px;

            object-fit: cover;
          }
        }
      }
      .creator {
        border-left: 1px solid gray;
        padding-left: 15px;
        margin-left: 10px;
        display: flex;
        justify-content: start;
        align-items: center;
        gap: 16px;
        position: relative;
        a {
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
    width: 100vw;
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
          }
          a {
            display: block;
            img {
            }
          }
        }
      }
      .right {
        display: grid;
        justify-content: space-between;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        align-items: center;
        button {
          width: 65px;
          height: 35px;
          flex-shrink: 0;
          color: #fff;
          font-family: Poppins;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 30px;
          border: none;
          border-radius: 50px;
          justify-self: flex-end;
          background-image: linear-gradient(#8fdd5d, #71bb42);
          transition: all 0.5s ease-in-out;
          position: relative;
          &:hover {
            background-image: linear-gradient(#71bb42, #8fdd5d);
          }
        }
        .logout {
          width: 33px;
          height: 33px;
          flex-shrink: 0;
          color: #fff;
          font-family: Poppins;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 30px;
          border: none;
          border-radius: 50px;
          justify-self: flex-end;
          background-image: linear-gradient(#8fdd5d, #71bb42);
          transition: all 0.5s ease-in-out;
          position: relative;
          &:hover {
            background-image: linear-gradient(#71bb42, #8fdd5d);
          }
        }
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

          a {
            display: none;
            color: #3c3c3c;
            font-family: Poppins;
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
          }
          button {
            width: 70px;
            height: 35px;
            flex-shrink: 0;
            color: #fff;
            font-family: Poppins;
            font-size: 12px;
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
      align-items: center;
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
          }
          a {
            display: block;
            img {
            }
          }
        }
      }
      .right {
        display: grid;
        align-items: center;
        button {
          width: 70px;
          height: 35px;
          margin-right: 10px;
          flex-shrink: 0;
          color: #fff;
          font-family: Poppins;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 30px;
          border: none;
          border-radius: 50px;
          justify-self: flex-end;
          background-image: linear-gradient(#8fdd5d, #71bb42);
          transition: all 0.5s ease-in-out;
          position: relative;
          &:hover {
            background-image: linear-gradient(#71bb42, #8fdd5d);
          }
        }
        grid-template-columns: 3fr 1fr 1fr 1fr;
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
          border-left: 1px solid gray;
          display: flex;
          a {
            color: #3c3c3c;
            font-family: Poppins;
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
          }
          button {
            width: 75px;
            height: 37px;
            flex-shrink: 0;
            color: #fff;
            font-family: Poppins;
            font-size: 14px;
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
/* Your skeleton content styles */
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
/* Your small menu button styles */
const SmallMenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  background-color: transparent;
  padding: 10px;
`;
/* Your search field styles */
const SearchField = styled.div`
  margin-left: 25px;
  @media (max-width: 768px) {
    display: none;
  }
`;
/* Your logo styles */
const Logo = styled.div`
  margin-left: 25px;
`;
/* Your creator styles */
const Creator = styled.div`
  margin-left: 25px;
`;
/* Your skeleton logo styles */
const SkeletonLogo = styled.div`
  width: 56px;
  height: 30px;
  background-color: #ddd; /* Placeholder background color */
`;
/* Your skeleton search styles */
const SkeletonSearch = styled.div`
  width: 200px;
  height: 40px;
  background-color: #ddd; /* Placeholder background color */
`;
/* Your skeleton creator button styles */
const SkeletonCreatorButton = styled.div`
  width: 50px;
  height: 40px;
  background-color: #ddd; /* Placeholder background color */
`;
export default Navbar;
