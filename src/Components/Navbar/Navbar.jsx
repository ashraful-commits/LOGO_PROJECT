import styled from "styled-components";
import {
  AiFillFacebook,
  AiFillGoogleCircle,
  AiFillInstagram,
  AiOutlineClose,
  AiOutlineLogout,
  AiOutlineMenu,
} from "react-icons/ai";
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
  Modal,
  Grid,
  TextField,
  Button,
  Tab,
} from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import { TabContext, TabList } from "@mui/lab";
//================================= firebase auth
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  FacebookAuthProvider,
} from "firebase/auth";
import { app } from "../../firebase.confige";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuthProvider } from "firebase/auth";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const toggleDrawer = () => {
    setShowMenu(!showMenu);
  };
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  }, []);
  useEffect(() => {
    // Simulate loading delay (you can replace this with actual data fetching logic)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, []);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  //================================
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  //===============================handle register form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpForm({ ...signUpForm, [name]: value });
  };
  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };
  //===========================login
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth(app);
    const email = loginForm.email;
    const password = loginForm.password;
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        toast("Login successful!", {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setOpen(false);
        setLoginForm({
          email: "",
          password: "",
        });
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
        const errorMessage = error.message;
        console.log(errorMessage);
        toast(errorMessage, {
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
  //==============================handle register
  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    const auth = getAuth(app);
    const email = signUpForm.email;
    const password = signUpForm.password;
    console.log(email, password);
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const name = signUpForm.name;
        updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: "https://example.com/jane-q-user/profile.jpg",
        })
          .then(() => {
            toast("User profoil successfully!", {
              position: "bottom-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          })
          .catch((error) => {
            toast(error.message, {
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
        toast("User created successfully!", {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      })
      .catch((error) => {
        const errorCode = error.code;

        const errorMessage = error.message;

        if (errorCode == 400) {
          toast(errorMessage, {
            position: "bottom-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }

        // ..
      });
  };
  const [value, setValue] = useState("login");
  //==========================handle login and register form change
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        localStorage.clear();
        toast("Logout successfull!", {
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
  const handleChangeForm = (event, newValue) => {
    setValue(newValue);
  };
  // const navigate = useNavigate();
  const handleGoogleSignin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        const user = result.user;

        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        toast("Login successful!", {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      })
      .catch((error) => {
        // Handle Errors here.
        // const errorCode = error.code;
        const errorMessage = error.message;
        toast(errorMessage, {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  const handleFacebookSignin = async () => {
    const auth = getAuth(app);
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;

        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        toast("Login successful", {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;

        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);

        // ...
      });
  };
  const handleInstagramSignin = async () => {};
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
          <div>
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
                <Button
                  onClick={() => setOpen(false)}
                  sx={{
                    color: "white",
                    position: "absolute",
                    top: "10%",
                    right: "5%",
                    fontSize: "24px",
                  }}
                >
                  <AiOutlineClose />
                </Button>
                <Box
                  sx={{
                    backgroundColor: "white",
                    width: "380px",
                    height: "490px",
                    padding: "20px",
                    borderRadius: "10px",
                  }}
                >
                  <TabContext value={value}>
                    <TabList
                      sx={{
                        width: "85%",
                        display: "flex",
                        margin: "0 auto",
                        justifyContent: "center",
                      }}
                      onChange={handleChangeForm}
                      aria-label="wrapped label tabs example"
                      indicatorColor="secondary"
                    >
                      <Tab
                        sx={{ width: "50%" }}
                        value="login"
                        label="Login"
                        wrapped
                      />
                      <Tab
                        sx={{ width: "50%" }}
                        value="register"
                        label="Register"
                      />
                    </TabList>
                    <TabPanel value="register">
                      <form onSubmit={handleSubmitRegister}>
                        <Grid
                          container
                          spacing={2}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Name"
                              name="name"
                              onChange={handleChange}
                              // Add value and onChange as needed
                              required
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Email"
                              name="email"
                              type="email"
                              onChange={handleChange}
                              // Add value and onChange as needed
                              required
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Password"
                              name="password"
                              type="password"
                              onChange={handleChange}
                              // Add value and onChange as needed
                              required
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Confirm Password"
                              name="confirmPassword"
                              type="password"
                              onChange={handleChange}
                              // Add value and onChange as needed
                              required
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              type="submit"
                              fullWidth
                              sx={{
                                bgcolor: "#71bb42",
                                "&:hover": {
                                  bgcolor: "#8fdd5d",
                                },
                                color: "white",
                              }}
                            >
                              Register
                            </Button>
                          </Grid>
                        </Grid>
                      </form>
                      <Typography sx={{ padding: "10px 0" }}>
                        Already have an account?
                        <Button
                          sx={{ color: "#71bb42", textTransform: "capitalize" }}
                          onClick={(event) => handleChangeForm(event, "login")}
                        >
                          Login
                        </Button>
                      </Typography>
                    </TabPanel>
                    <TabPanel value="login">
                      <form onSubmit={handleSubmitLogin}>
                        <Grid
                          container
                          spacing={2}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Email"
                              name="email"
                              type="email"
                              value={loginForm.email}
                              onChange={handleChangeLogin}
                              required
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Password"
                              name="password"
                              type="password"
                              value={loginForm.password}
                              onChange={handleChangeLogin}
                              required
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              type="submit"
                              fullWidth
                              sx={{
                                bgcolor: "#71bb42",
                                "&:hover": {
                                  bgcolor: "#8fdd5d",
                                },
                                color: "white",
                              }}
                            >
                              Login
                            </Button>
                          </Grid>
                        </Grid>
                      </form>
                      <Typography sx={{ padding: "10px 0" }}>
                        Don&apos;t have an account?
                        <Button
                          sx={{ color: "#71bb42", textTransform: "capitalize" }}
                          onClick={(event) =>
                            handleChangeForm(event, "register")
                          }
                        >
                          Register
                        </Button>
                      </Typography>
                      <Button
                        onClick={handleGoogleSignin}
                        variant="outlined"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          width: "100%",

                          marginBottom: "6px",
                        }}
                      >
                        <AiFillGoogleCircle fill="red" size={"24"} />
                        Sign in with Google
                      </Button>
                      <Button
                        onClick={handleFacebookSignin}
                        variant="outlined"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          width: "100%",

                          marginBottom: "6px",
                        }}
                      >
                        <AiFillFacebook fill="blue" size={"24"} />
                        Sign in with facebook
                      </Button>
                      <Button
                        onClick={handleInstagramSignin}
                        variant="outlined"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          width: "100%",

                          marginBottom: "6px",
                        }}
                      >
                        <AiFillInstagram fill="orange" size={"24"} />
                        Sign in with instagram
                      </Button>
                    </TabPanel>
                  </TabContext>
                </Box>
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
                <form action="">
                  <CiSearch />
                  <input type="text" placeholder="Search" />
                </form>
              </div>
              <div className="logo">
                <Link to="/">
                  <img src={logo} alt="" />
                </Link>
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

      grid-template-columns: 1fr 780px 1fr 1fr;
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
        grid-template-columns: 2fr 1fr 1fr;
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
        grid-template-columns: 3fr 1fr 1fr;
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
