import { Facebook } from "@mui/icons-material";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { AiFillGoogleCircle, AiOutlineClose } from "react-icons/ai";

import styled from "styled-components";
import { app } from "../../firebase.confige";
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ToastifyFunc } from "../../Utility/TostifyFunc";
import setDocumentWithId from "../../Utility/SetDocWithId";
import getDocumentById from "../../Utility/getSingleData";

const Login = ({ setOpen, setRedirect, setUser }) => {
  //======================= State for login and registration form data
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const auth = getAuth(app);
  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  //======================== Handle login form submission
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth(app);
    const email = loginForm.email;
    const password = loginForm.password;
    if (!loginForm.email || !loginForm.password) {
      ToastifyFunc("All Fields are required!", "error");
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential?.user;

        const docSnap = await getDocumentById("users", user?.uid);

        if (docSnap) {
          navigate("/");
        } else {
          await setDocumentWithId("users", `${user?.uid}`, {
            id: user?.uid,
            name: user?.displayName,
            email: user?.email,
            photoURL: user?.photoURL,
            coverPhotoUrl: "",
            followers: [],
            following: [],
            posts: [],
            status: {
              user: "verified",
              msg: "",
            },
            role: "user",
            timestamp: serverTimestamp(),
          }).then(() => {
            console.log(user);
            setUser(user);
            setOpen(false);
            ToastifyFunc("Login successful!", "success");
          });
        }
      } catch (error) {
        //=================== Handle login errors
        if (error.code === "auth/invalid-login-credentials") {
          ToastifyFunc("Email and password do not match", "error");
        }
      }
    }
  };
  //=========================  Handle Google sign-in
  const handleGoogleSignIn = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docSnap = await getDocumentById("users", user.uid);
      console.log(docSnap);
      if (docSnap) {
        navigate("/");
      } else {
        await setDocumentWithId("users", `${user?.uid}`, {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          coverPhotoUrl: "",
          followers: [],
          following: [],
          posts: [],
          status: {
            user: "verified",
            msg: "",
          },
          role: "user",
          timestamp: serverTimestamp(),
        }).then(() => {
          setOpen(false);
          setUser(user);
          ToastifyFunc("Login successful!", "success");
        });
      }
    } catch (error) {
      //============ Handle Google sign-in errors
      const errorMessage = error.message;
      ToastifyFunc(errorMessage, "error");
    }
  };

  //========================== Handle Facebook sign-in
  const handleFacebookSignIn = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const auth = getAuth(app);
      signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user;
          console.log(user);
          ToastifyFunc("facebook login successful!", "success");

          const credential = FacebookAuthProvider.credentialFromResult(result);
          const accessToken = credential.accessToken;
          console.log(accessToken);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
          const email = error.customData.email;
          console.log(email);

          const credential = FacebookAuthProvider.credentialFromError(error);

          console.log(credential);
        });
    } catch (error) {
      const errorMessage = error.message;
      console.log(errorMessage);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        ToastifyFunc("Login successful!", "success");
        setLoginForm({
          email: "",
          password: "",
        });
        setOpen(false);
        setUser(user);
      } else {
        //======================= No user is signed in.
        setUser(null);
        navigate("/profile");
      }
    });

    return () => unsubscribe();
  }, [auth, setUser, setOpen, navigate]);

  return (
    <LoginContainer className="container">
      <div className="login_container">
        <button className="close_btn" onClick={() => setOpen(false)}>
          <AiOutlineClose />
        </button>
        <div className="login">
          <h4>Login to KwiKs</h4>
          <p>
            Inter your valid email address and password login to your account
          </p>

          <form onSubmit={handleSubmitLogin}>
            <input
              autoComplete="off"
              placeholder="email/username/phone"
              type="text"
              onChange={handleChangeLogin}
              name="email"
              value={loginForm.name}
            />
            <input
              autoComplete="off"
              placeholder="Password"
              type="password"
              onChange={handleChangeLogin}
              name="password"
              value={loginForm.password}
            />
            <button type="submit">Login</button>
            <div className="agree">
              <div className="check">
                <input type="checkbox" />
                <label>By clicking here and continuing</label>
              </div>
              <p>
                i agree to the <span>Terms of Service</span> and
                <span>Privecy Policy</span>.
              </p>
            </div>

            <div className="signUp">
              <p>Don&apos;t have and account? </p>
              <a
                onClick={(e) => {
                  e.preventDefault(), setRedirect("Register");
                }}
              >
                Sign Up
              </a>
            </div>
          </form>
          {/*=================== google button  */}
          <div className="google">
            <button onClick={handleGoogleSignIn}>
              <AiFillGoogleCircle />
              <span>Sign in with google</span>
            </button>
          </div>
          {/*=================== facebook button  */}
          <div className="facebook">
            <button onClick={handleFacebookSignIn}>
              <Facebook />
              <span>Sign in with Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </LoginContainer>
  );
};
//=================styled
const LoginContainer = styled.div`
  width: 380px;
  height: auto;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 80px 50px 50px 50px;
  border-radius: 20px;
  .close_btn {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 30px;
    top: 30px;
    border: 1px solid gray;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    transition: all 0.5s ease-in-out;

    &:hover {
      background-color: #3aff3a;
      color: #4f4f4f;
      border: none;
    }
  }
  .login {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    h4 {
      color: #4f4f4f;
      text-align: center;
      margin-bottom: 10px;
    }
    p {
      text-align: center;
      font-size: 12px;
      font-weight: 400;
      width: 94%;
      color: gray;
    }
    form {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      width: 100%;
      gap: 15px;
      input {
        width: 100%;
        height: 35px;
        border-radius: 50px;
        border: none;
        padding: 0 15px;
        background-color: #eee;
        &:focus {
          outline: none;
        }
      }
      button {
        height: 35px;
        border: none;
        border-radius: 50px;
        background-color: #06d806;
        color: white;
        font-weight: bold;
        transition: all 0.5s ease-in-out;
        &:hover {
          background-color: #04ae04;
          color: #fff;
          border: none;
        }
      }
      .agree {
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .check {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        input {
          width: 10px;
        }
        label {
          text-align: center;
          font-size: 10px;
          font-weight: 400;

          color: gray;
        }
        p {
          font-size: 10px;
          width: 100%;
        }
      }
      .signUp {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin-top: 10px;
        a {
          color: #06d806;
          display: block;
          width: 30%;
          font-size: 12px;
          word-break: normal;
        }
      }
    }
  }
  .google {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    width: 100%;

    height: 35px;
    button {
      background-color: #ff4444;
      transition: all 0.5s ease-in-out;
      &:hover {
        background-color: red;
      }
      width: 100%;
      padding: 5px 0;
      border-radius: 50px;
      border: none;
      color: white;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      svg {
        font-size: 24px;
      }
    }
  }
  .facebook {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    width: 100%;

    button {
      background-color: #4d7fff;
      transition: all 0.5s ease-in-out;
      &:hover {
        background-color: blue;
      }
      width: 100%;
      height: 35px;
      border-radius: 50px;
      border: none;
      color: white;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      svg {
        font-size: 24px;
      }
    }
  }
`;
export default Login;
