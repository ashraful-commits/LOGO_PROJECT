// Import necessary dependencies and components
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
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
import { doc, getFirestore, setDoc } from "firebase/firestore";
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

// Import Firebase Authentication functions and configuration
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
  FacebookAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "../../firebase.confige"; // Ensure that your Firebase configuration is correctly set up
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { GoogleAuthProvider } from "firebase/auth";

// Import additional icons
import { BsFacebook } from "react-icons/bs";

// Define the Navbar component
const Navbar = () => {
  // State to manage menu visibility
  const [showMenu, setShowMenu] = useState(false);

  // Function to toggle the menu
  const toggleDrawer = () => {
    setShowMenu(!showMenu);
  };

  // State to manage loading state
  const [loading, setLoading] = useState(true);

  // State to manage user authentication status

  // Effect to retrieve user data from local storage

  // Simulate loading delay (replace with actual data fetching)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the delay as needed
    return () => clearTimeout(timer);
  }, []);

  // State and functions for login and registration forms
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // State for login and registration form data
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

  // Handle changes in the registration form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpForm({ ...signUpForm, [name]: value });
  };

  // Handle changes in the login form
  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  // Handle login form submission
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth(app);
    const email = loginForm.email;
    const password = loginForm.password;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Display a success message using a toast notification
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

      // Close the login modal, clear the form, and store user data
      setOpen(false);
      setLoginForm({
        email: "",
        password: "",
      });
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (error) {
      // Handle login errors
      if (error.code === "auth/invalid-login-credentials") {
        toast("Email and password do not match", {
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
    }
  };

  // Handle registration form submission
  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    const auth = getAuth(app);
    const email = signUpForm.email;
    const password = signUpForm.password;

    // Check if password and confirm password match
    if (signUpForm.password !== signUpForm.confirmPassword) {
      toast("Password and confirm password do not match!", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        const db = getFirestore(app);

        updateProfile(user, {
          displayName: signUpForm.name,
        })
          .then(() => {
            console.log(user);
          })
          .catch((error) => {
            console.log(error.message);
          });
        await setDoc(doc(db, "users", `${user.uid}`), {
          id: user.uid,
          name: signUpForm.name,
          email: signUpForm.email,
          photoURL: "",
          coverPhotoUrl: "",
          followers: [],
          following: [],
          posts: [],
        });
        setOpen(false);
        // Display a success message using a toast notification
        toast.success("Registration successful!", {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } catch (error) {
        // Handle registration errors
        if (error.code === "auth/email-already-in-use") {
          toast.success("Email already exists.", {
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
      }
    }
  };

  // State for the currently active tab in the login/registration form
  const [value, setValue] = useState("login");

  // Handle tab changes in the login/registration form
  const handleChangeForm = (event, newValue) => {
    setValue(newValue);
  };

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

  // Handle Google sign-in
  const handleGoogleSignin = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setOpen(false);
      // Display a success message using a toast notification
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

      // Store user data
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      // Handle Google sign-in errors
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
    }
  };

  // Handle Facebook sign-in
  const handleFacebookSignin = async () => {
    const auth = getAuth(app); // Get the Firebase Authentication instance.
    const provider = new FacebookAuthProvider(); // Create a FacebookAuthProvider instance.

    try {
      const result = await signInWithPopup(auth, provider); // Sign in with a popup.
      const user = result.user; // Get the signed-in user info.

      // Display a success message using a toast notification.
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

      // This gives you a Facebook Access Token, which can be used to access the Facebook API.
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;

      // You can access additional user information using getAdditionalUserInfo(result).
      // ...
    } catch (error) {
      // Handle errors that occur during the login process.
      const errorCode = error.code; // Get the error code.
      const errorMessage = error.message; // Get the error message.
      const email = error.customData.email; // Get the email of the user's account (if available).
      console.log(errorMessage); // Log the error message.

      // Get the AuthCredential type that was used.
      const credential = FacebookAuthProvider.credentialFromError(error);

      // Handle the error appropriately.
      // ...
    }
  };
  const [user, setUser] = useState(null);
  const auth = getAuth(app);
  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        setUser(user);
      } else {
        // No user is signed in.
        setUser(null);
      }
    });

    // Unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, [auth]);
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
                    top: "1%",
                    right: "2%",
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
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          color: "white",
                          width: "100%",
                          backgroundColor: "red",
                          "&:hover": {
                            backgroundColor: "#71bb42",
                            color: "white",
                          },

                          marginBottom: "6px",
                        }}
                      >
                        <AiFillGoogleCircle fill="white" size={"24"} />
                        Sign in with Google
                      </Button>
                      <Button
                        onClick={handleFacebookSignin}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          color: "white",
                          width: "100%",
                          backgroundColor: "#0059fd",
                          "&:hover": {
                            backgroundColor: "#71bb42",
                            color: "white",
                          },

                          marginBottom: "6px",
                        }}
                      >
                        <BsFacebook fill="white" size={"24"} />
                        Sign in with facebook
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
              {user && (
                <div className="loginavater">
                  <Link to={`/${user?.displayName}`}>
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
      .loginavater {
        overflow: hidden;
        width: "100%";
        height: "100%";
        margin-top: 10px;
        border: 2px solid white;
        background-color: white;
        a {
          width: 70%;
          border-radius: 100%;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
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
