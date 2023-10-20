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
                padding: "30px 10px",
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
              <List sx={{ height: "350px", overflow: "auto" }}>
                {users.length > 0 ? (
                  users
                    ?.slice(0, seeMore ? users.length : 5)
                    .map((item, index) => {
                      return (
                        <Link
                          style={{ width: "270px" }}
                          key={index}
                          to={`/${item.id}`}
                        >
                          <ListItem>
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
  width: 1442px;
  height: 75px;
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
          .searchButton {
            background-image: none !important;
            width: 30px !important;
            height: 30px !important;
            color: #45b201;
            display: flex;
            align-items: center;
            justify-content: center;
          }
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
  @media (max-width: 767px) {
    width: 100vw;
    padding: 0 5px;
    .container {
      width: 100%;
      min-width: 320px;
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
        .loginAvatar {
          width: 50px;
          height: 50px;
          overflow: hidden;
          margin-top: 10px;
          border: 2px solid white;
          background-color: white;
          margin-left: 30px;
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
          border-left: 0px solid gray;
          display: flex;
          margin-right: 10px;

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

  @media (min-width: 768px) and (max-width: 1023px) {
    width: 100%;
    .container {
      width: 100%;
      grid-template-columns: 1fr 4fr;
      justify-content: space-between;
      align-items: center;
      padding: 0 5px;
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
        grid-template-columns: 7fr 1fr 1fr 1fr;
        .search-field {
          display: flex;
          justify-content: end;
          align-items: center;
          form {
            svg {
              font-size: 25px;
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
  @media (min-width: 1024px) and (max-width: 1365px) {
    width: 100vw;
    margin: 0 auto;
    padding: 10px;
    .container {
      width: 1365px;
      min-width: 1024px;
      max-width: 1365px;
      grid-template-columns: 1fr 10fr;
      justify-content: space-between;
      padding: 0 30px;
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
          padding-left: 0px;
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
        grid-template-columns: 1fr 6fr 1fr 1fr 1fr;
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
            .searchButton {
              background-color: #fff !important;
            }
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
