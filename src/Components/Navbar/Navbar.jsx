// Import necessary dependencies and components
import { useEffect, useState } from "react";

import styled from "styled-components";
import { AiOutlineClose, AiOutlineLogout, AiOutlineMenu } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import logo from "../../../public/LOGO.png";
import trending from "../../../public/trendingIcn.png";
import group from "../../../public/groupIcon.png";
import play from "../../../public/playIcon.png";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
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
  Avatar,
} from "@mui/material";

//======================== Import Firebase Authentication functions and configuration
import { getAuth, signOut } from "firebase/auth";
//================== Ensure that your Firebase configuration is correctly set up
import { app } from "../../firebase.confige";
import { Link, useNavigate } from "react-router-dom";

import Login from "../Login/Login";
import Register from "../Register/Register";
import useOpen from "../../hooks/useOpen";
import { ToastifyFunc } from "../../Utility/TostifyFunc";
import getAllDataWithSnapshot from "../../Utility/GetAllData";

//================= Define the Navbar component
const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [redirect, setRedirect] = useState("Login");
  const [seeMore, setSeMore] = useState(false);
  const navigate = useNavigate();
  //======================= use hook
  const { open, setOpen } = useOpen();
  //====================get auth
  const auth = getAuth(app);
  useEffect(() => {
    setLoading(true);

    const querySnapshot = getAllDataWithSnapshot("users", (allData) => {
      setLoading(false);
      setUsers(allData);
    });

    return querySnapshot;
  }, []);
  //=============== Function to toggle the menu
  const toggleDrawer = () => {
    setShowMenu(!showMenu);
  };
  //================ loading time out

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    //===================== Adjust the delay as needed
    return () => clearTimeout(timer);
  }, []);

  //============= handle modal close
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  //=============== Handle user logout
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        localStorage.clear();
        setUser(null);
        ToastifyFunc("Logout successful!", "success");
        setUser(null);
        navigate("/");
      })
      .catch((error) => {
        const message = error.message;
        ToastifyFunc(message, "success");
      });
  };
  useEffect(() => {
    const user = auth.currentUser;
    setUser(user);
  }, [auth.currentUser]);
  const handleSearchForm = (e) => {
    e.preventDefault();
    if (search) {
      const capitalizedSearch =
        search.charAt(0).toUpperCase() + search.slice(1);
      navigate(`/search/${capitalizedSearch}`);
    }
  };
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
                  marginTop: "10rem",
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
                width: "18.75rem",
                padding: "1.875rem .625rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "start",
                gap: ".625rem",
              }}
            >
              <IconButton
                sx={{ position: "absolute", top: "2%", right: "10%" }}
                onClick={() => toggleDrawer(false)}
              >
                <AiOutlineClose />
              </IconButton>
              <List sx={{ padding: "3.125rem 0" }}>
                <Link to={`/trending`}>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <img src={trending} alt="" />
                      </ListItemIcon>
                      <ListItemText primary="Trending" />
                    </ListItemButton>
                  </ListItem>
                </Link>
                <Link to={`/${auth?.currentUser?.uid}`}>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <img src={group} />
                      </ListItemIcon>
                      <ListItemText primary="Following" />
                    </ListItemButton>
                  </ListItem>
                </Link>
                <Link to="/explore">
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <img src={play} />
                      </ListItemIcon>
                      <ListItemText primary="Explore" />
                    </ListItemButton>
                  </ListItem>
                </Link>
              </List>
              <Typography fontSize={18} fontWeight={600}>
                Popular Creators
              </Typography>
              <List sx={{ height: "21.875rem", overflow: "auto" }}>
                {users.length > 0 ? (
                  users
                    ?.slice(0, seeMore ? users.length : 5)
                    .map((item, index) => {
                      return (
                        <Link
                          style={{ width: "16.875rem" }}
                          key={index}
                          to={`/${item.id}`}
                        >
                          <ListItem onClick={() => toggleDrawer(false)}>
                            <ListItemButton>
                              <ListItemIcon>
                                <Avatar>
                                  {item.photoURL ? (
                                    <img
                                      style={{ width: "100%" }}
                                      src={item?.photoURL}
                                      alt=""
                                    />
                                  ) : (
                                    <img
                                      style={{ width: "100%" }}
                                      src="https://img.freepik.com/premium-vector/young-smiling-man-avatar-man-with-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-3d-vector-people-character-illustration-cartoon-minimal-style_365941-860.jpg"
                                      alt=""
                                    />
                                  )}
                                </Avatar>
                              </ListItemIcon>
                              <ListItemText
                                sx={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: "100%",
                                }}
                                primary={item?.name}
                                secondary={item?.email}
                              />
                            </ListItemButton>
                          </ListItem>
                        </Link>
                      );
                    })
                ) : (
                  <p>No user</p>
                )}
              </List>
              <Typography onClick={() => setSeMore(!seeMore)}>
                {seeMore ? "See Less" : "See More"}{" "}
              </Typography>
            </Box>
          </Drawer>

          <div className="container">
            <div className="left">
              <div className="small-menu">
                <button onClick={() => setShowMenu(!showMenu)}>
                  <AiOutlineMenu />
                  <span>Menu</span>
                </button>

                <Link to={"/"}>
                  <img src={logo} alt="" />
                </Link>
              </div>
            </div>

            <div className="right">
              <div className="search-field">
                <form onSubmit={handleSearchForm}>
                  <button className="searchButton" type="submit">
                    <CiSearch />
                  </button>
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
              <div className="loginAvatar">
                {user && (
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
                )}
              </div>

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
  width: 90.125rem;
  height: 4.6875rem;
  flex-shrink: 0;
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
    width: 90rem;
    display: grid;
    margin: 0 auto;
    grid-template-columns: 7.875rem auto;
    align-items: center;

    .left {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      border-right: 0.0625rem solid gray;
      height: 2.5rem;
      .small-menu {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 0.4375rem;
        gap: 0.625rem;

        button {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          align-items: center;
          border: none;
          background-color: transparent;
          padding: 0.625rem;
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
            font-size: 1.375rem;
            transition: all 0.2s ease-in-out 0.1s;
          }
          span {
            transition: all 0.2s ease-in-out 0.1s;
            color: #000;
            text-align: center;
            font-family: Roboto;
            font-size: 0.875rem;
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
      grid-template-columns: 1fr 48.75rem 1fr 1fr 1fr;
      button {
        width: 5.8125rem;
        height: 2.5rem;
        flex-shrink: 0;
        color: #fff;
        font-family: Poppins;
        font-size: 1rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.875rem;
        border: none;
        border-radius: 3.125rem;
        background-image: linear-gradient(#8fdd5d, #71bb42);
        transition: all 0.5s ease-in-out;
        position: relative;
        &:hover {
          background-image: linear-gradient(#71bb42, #8fdd5d);
        }
      }
      .logout {
        width: 2.5rem;
        height: 2.5rem;
        flex-shrink: 0;
        color: #fff;
        font-family: Poppins;
        font-size: 1rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.875rem;
        border: none;
        border-radius: 3.125rem;
        background-image: linear-gradient(#8fdd5d, #71bb42);
        transition: all 0.5s ease-in-out;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        svg {
          font-size: 1.25rem;
        }
        &:hover {
          background-image: linear-gradient(#71bb42, #8fdd5d);
        }
      }
      .search-field {
        margin-left: 1.5625rem;
        display: flex;
        align-items: center;

        form {
          display: flex;
          justify-content: start;
          align-items: center;
          gap: 0.4375rem;
          .searchButton {
            background-image: none !important;
            width: 1.875rem !important;
            height: 1.875rem !important;
            color: #45b201;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          svg {
            font-size: 1.5625rem;
            cursor: pointer;
            &:hover {
              color: #71bb42;
            }
          }
          input {
            border: none;
            font-family: Poppins;
            font-size: 0.875rem;
            font-weight: 400;
            line-height: 1.3125rem;
            letter-spacing: 0em;
            text-align: left;
            padding: 0.3125rem 0.3125rem;
            border-left: 0.0625rem solid white;

            &:focus {
              outline: none;
              border-left: 0.0625rem solid #71bb42;
            }
          }
        }
      }
      .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 3.5rem;
          height: 1.875rem;
          object-fit: contain;
          margin-right: 8.25rem;
        }
      }
      .loginAvatar {
        width: 3.125rem;
        height: 3.125rem;
        overflow: hidden;
        margin-top: 0.625rem;
        border: 0.125rem solid white;
        background-color: white;
        a {
          width: 100%;
          height: 100%;

          overflow: hidden;
          overflow: hidden;
          img {
            width: 2.5rem;
            border-radius: 100%;
            height: 2.5rem;

            object-fit: cover;
          }
        }
      }
      .creator {
        border-left: 0.0625rem solid gray;
        padding-left: 0.9375rem;
        margin-left: 0.625rem;
        display: flex;
        justify-content: start;
        align-items: center;
        gap: 1rem;
        position: relative;
        a {
          color: #3c3c3c;
          font-family: Poppins;
          font-size: 0.875rem;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
        }
        button {
          width: 5.8125rem;
          height: 2.5rem;
          flex-shrink: 0;
          color: #fff;
          font-family: Poppins;
          font-size: 1rem;
          font-style: normal;
          font-weight: 400;
          line-height: 1.875rem;
          border: none;
          border-radius: 3.125rem;
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
  @media (max-width: 47.9375rem) {
    width: 100vw;
    padding: 0 0.3125rem;
    .container {
      width: 100%;
      min-width: 20rem;
      grid-template-columns: 1fr 2fr;
      justify-content: space-between;
      .left {
        border-right: 0rem solid gray;
        display: flex;
        justify-content: start;
        .small-menu {
          display: flex;
          justify-content: start;
          align-items: center;

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
          width: 4.0625rem;
          height: 2.1875rem;
          flex-shrink: 0;
          color: #fff;
          font-family: Poppins;
          font-size: 0.75rem;
          font-style: normal;
          font-weight: 400;
          line-height: 1.875rem;
          border: none;
          border-radius: 3.125rem;
          justify-self: flex-end;
          background-image: linear-gradient(#8fdd5d, #71bb42);
          transition: all 0.5s ease-in-out;
          position: relative;
          &:hover {
            background-image: linear-gradient(#71bb42, #8fdd5d);
          }
        }
        .logout {
          width: 2.0625rem;
          height: 2.0625rem;
          flex-shrink: 0;
          color: #fff;
          font-family: Poppins;
          font-size: 0.75rem;
          font-style: normal;
          font-weight: 400;
          line-height: 1.875rem;
          border: none;
          border-radius: 3.125rem;
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
            max-width: 12.5rem; /* Adjust the max-width value as needed */
            opacity: 1;
          }
          form {
            transition: all 0.5s ease-in-out 0.1s;
            &:hover {
              input {
                display: block;
              }
            }
            .searchButton {
              /* background-color: #fff !important; */
            }
            input {
              position: absolute; /* Position the input absolutely */
              display: block;
              max-width: 0;
              opacity: 0;
              transition: max-width 0.5s ease-in-out, opacity 0.5s ease-in-out;
            }
            svg {
              font-size: 1.5625rem;
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
        .loginAvatar {
          width: 3.125rem;
          height: 3.125rem;
          overflow: hidden;
          margin-top: 0.625rem;
          border: 0.125rem solid white;
          background-color: white;
          margin-left: 1.875rem;
          a {
            width: 100%;
            height: 100%;

            overflow: hidden;
            overflow: hidden;
            img {
              width: 2.5rem;
              border-radius: 100%;
              height: 2.5rem;

              object-fit: cover;
            }
          }
        }
        .creator {
          border-left: 0rem solid gray;
          display: flex;
          margin-right: 0.625rem;

          a {
            display: none;
            color: #3c3c3c;
            font-family: Poppins;
            font-size: 0.875rem;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
          }
          button {
            width: 4.375rem;
            height: 2.1875rem;
            flex-shrink: 0;
            color: #fff;
            font-family: Poppins;
            font-size: 0.75rem;
            font-style: normal;
            font-weight: 400;
            line-height: 1.875rem;
            border: none;
            border-radius: 3.125rem;
            background-image: linear-gradient(#8fdd5d, #71bb42);
          }
        }
      }
    }
  }

  @media (min-width: 48rem) and (max-width: 63.9375rem) {
    width: 100%;
    .container {
      width: 100%;
      grid-template-columns: 1fr 4fr;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.3125rem;
      .left {
        border-right: 0rem solid gray;
        display: flex;
        justify-content: start;
        .small-menu {
          display: flex;
          justify-content: start;
          align-items: center;
          padding-left: 0.75rem;
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
          width: 4.375rem;
          height: 2.1875rem;
          margin-right: 0.625rem;
          flex-shrink: 0;
          color: #fff;
          font-family: Poppins;
          font-size: 0.75rem;
          font-style: normal;
          font-weight: 400;
          line-height: 1.875rem;
          border: none;
          border-radius: 3.125rem;
          justify-self: flex-end;
          background-image: linear-gradient(#8fdd5d, #71bb42);
          transition: all 0.5s ease-in-out;
          position: relative;
          &:hover {
            background-image: linear-gradient(#71bb42, #8fdd5d);
          }
        }
        grid-template-columns: 7fr 1fr 1fr 1fr;
        .search-field {
          display: flex;
          justify-content: end;
          align-items: center;
          form {
            svg {
              font-size: 1.5625rem;
            }
            .searchButton {
              background-color: #fff !important;
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
          border-left: 0.0625rem solid gray;
          display: flex;
          a {
            color: #3c3c3c;
            font-family: Poppins;
            font-size: 0.875rem;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
          }
          button {
            width: 4.6875rem;
            height: 2.3125rem;
            flex-shrink: 0;
            color: #fff;
            font-family: Poppins;
            font-size: 0.875rem;
            font-style: normal;
            font-weight: 400;
            line-height: 1.875rem;
            border: none;
            border-radius: 3.125rem;
            background-image: linear-gradient(#8fdd5d, #71bb42);
          }
        }
      }
    }
  }
  @media (min-width: 64rem) and (max-width: 85.3125rem) {
    width: 100vw;
    margin: 0 auto;
    padding: 0.625rem;
    .container {
      width: 85.3125rem;
      min-width: 64rem;
      max-width: 85.3125rem;
      grid-template-columns: 1fr 10fr;
      justify-content: space-between;
      padding: 0 1.875rem;
      .left {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: 0.0625rem solid gray;
        height: 2.5rem;
        .small-menu {
          display: flex;
          justify-content: center;
          align-items: center;
          padding-left: 0rem;
          gap: 0.625rem;

          button {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            align-items: center;
            border: none;
            background-color: transparent;
            padding: 0.625rem;
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
              font-size: 1.375rem;
              transition: all 0.2s ease-in-out 0.1s;
            }
            span {
              transition: all 0.2s ease-in-out 0.1s;
              color: #000;
              text-align: center;
              font-family: Roboto;
              font-size: 0.875rem;
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
        grid-template-columns: 1fr 6fr 1fr 1fr 1fr;
        button {
          width: 5.8125rem;
          height: 2.5rem;
          flex-shrink: 0;
          color: #fff;
          font-family: Poppins;
          font-size: 1rem;
          font-style: normal;
          font-weight: 400;
          line-height: 1.875rem;
          border: none;
          border-radius: 3.125rem;
          background-image: linear-gradient(#8fdd5d, #71bb42);
          transition: all 0.5s ease-in-out;
          position: relative;
          &:hover {
            background-image: linear-gradient(#71bb42, #8fdd5d);
          }
        }
        .logout {
          width: 2.5rem;
          height: 2.5rem;
          flex-shrink: 0;
          color: #fff;
          font-family: Poppins;
          font-size: 1rem;
          font-style: normal;
          font-weight: 400;
          line-height: 1.875rem;
          border: none;
          border-radius: 3.125rem;
          background-image: linear-gradient(#8fdd5d, #71bb42);
          transition: all 0.5s ease-in-out;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          svg {
            font-size: 1.25rem;
          }
          &:hover {
            background-image: linear-gradient(#71bb42, #8fdd5d);
          }
        }
        .search-field {
          margin-left: 1.5625rem;
          display: flex;
          align-items: center;
          form {
            display: flex;
            justify-content: start;
            align-items: center;
            gap: 0.4375rem;
            .searchButton {
              background-color: #fff !important;
            }
            svg {
              font-size: 1.5625rem;
              cursor: pointer;
              &:hover {
                color: #71bb42;
              }
            }
            input {
              border: none;
              font-family: Poppins;
              font-size: 0.875rem;
              font-weight: 400;
              line-height: 1.3125rem;
              letter-spacing: 0em;
              text-align: left;
              padding: 0.3125rem 0.3125rem;
              border-left: 0.0625rem solid white;

              &:focus {
                outline: none;
                border-left: 0.0625rem solid #71bb42;
              }
            }
          }
        }
        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 3.5rem;
            height: 1.875rem;
            object-fit: contain;
            margin-right: 8.25rem;
          }
        }
        .loginAvatar {
          width: 3.125rem;
          height: 3.125rem;
          overflow: hidden;
          margin-top: 0.625rem;
          border: 0.125rem solid white;
          background-color: white;
          a {
            width: 100%;
            height: 100%;

            overflow: hidden;
            overflow: hidden;
            img {
              width: 2.5rem;
              border-radius: 100%;
              height: 2.5rem;

              object-fit: cover;
            }
          }
        }
        .creator {
          border-left: 0.0625rem solid gray;
          padding-left: 0.9375rem;
          margin-left: 0.625rem;
          display: flex;
          justify-content: start;
          align-items: center;
          gap: 1rem;
          position: relative;
          a {
            color: #3c3c3c;
            font-family: Poppins;
            font-size: 0.875rem;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
          }
          button {
            width: 5.8125rem;
            height: 2.5rem;
            flex-shrink: 0;
            color: #fff;
            font-family: Poppins;
            font-size: 1rem;
            font-style: normal;
            font-weight: 400;
            line-height: 1.875rem;
            border: none;
            border-radius: 3.125rem;
            background-image: linear-gradient(#8fdd5d, #71bb42);
            transition: all 0.5s ease-in-out;
            position: relative;
            &:hover {
              background-image: linear-gradient(#71bb42, #8fdd5d);
            }
          }
        }
      }
    }
  }
`;
/* Your skeleton content styles */
const SkeletonContent = styled.div`
  width: 90.125rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0rem;
  .left,
  .right {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  margin-left: 1.5625rem;
  @media (max-width: 48rem) {
    width: 100%;
  }
`;
/* Your small menu button styles */
const SmallMenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  background-color: transparent;
  padding: 0.625rem;
  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: none;
    background-color: #eee;
    padding: 0.9375rem;
  }
`;
/* Your search field styles */
const SearchField = styled.div`
  margin-left: 1.5625rem;
  @media (max-width: 48rem) {
    display: none;
  }
`;
/* Your logo styles */
const Logo = styled.div`
  margin-left: 1.5625rem;
`;
/* Your creator styles */
const Creator = styled.div`
  margin-left: 1.5625rem;
`;
/* Your skeleton logo styles */
const SkeletonLogo = styled.div`
  width: 3.5rem;
  height: 1.875rem;
  background-color: #ddd; /* Placeholder background color */
`;
/* Your skeleton search styles */
const SkeletonSearch = styled.div`
  width: 12.5rem;
  height: 2.5rem;
  background-color: #ddd; /* Placeholder background color */
`;
/* Your skeleton creator button styles */
const SkeletonCreatorButton = styled.div`
  width: 3.125rem;
  height: 2.5rem;
  background-color: #ddd; /* Placeholder background color */
`;
export default Navbar;
