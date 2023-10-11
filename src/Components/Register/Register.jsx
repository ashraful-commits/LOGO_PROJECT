import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import styled from "styled-components";
import { app } from "../../firebase.confige";

const Register = ({ setOpen, setRedirect }) => {
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  //=====================handle onchage
  const handleRegisterForm = (e) => {
    setSignUpForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  // Handle registration form submission
  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    const auth = getAuth(app);
    const email = signUpForm.email;
    const password = signUpForm.password;

    // Check if password and confirm password match
    if (!signUpForm.name || !signUpForm.email || !signUpForm.password) {
      toast.error("All Files are required!", {
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
            setRedirect("Login");
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

  return (
    <LoginContainer className="container">
      <div className="login_container">
        <button className="close_btn" onClick={() => setOpen(false)}>
          <AiOutlineClose />
        </button>
        <div className="login">
          <h4>Sign up to KwiKs</h4>
          <p>
            Inter your valid email address and password register your account
          </p>
          <form onSubmit={handleSubmitRegister}>
            <input
              name="name"
              value={signUpForm.name}
              onChange={handleRegisterForm}
              autoComplete="off"
              placeholder="Full name"
              type="text"
            />
            <input
              autoComplete="off"
              placeholder="Email"
              name="email"
              value={signUpForm.email}
              onChange={handleRegisterForm}
              type="email"
              id=""
            />
            <input
              autoComplete="off"
              placeholder="Create Password"
              type="password"
              id=""
              name="password"
              value={signUpForm.password}
              onChange={handleRegisterForm}
            />
            <button>Create Account</button>
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
              <p>Already have an account? </p>
              <a
                onClick={(e) => {
                  e.preventDefault(), setRedirect("Login");
                }}
              >
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </LoginContainer>
  );
};
const LoginContainer = styled.div`
  width: 320px;
  height: auto;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 80px 30px 50px 30px;
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
    gap: 20px;
    h4 {
      color: #4f4f4f;
      text-align: center;
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
      gap: 15px;
      input {
        width: 100%;
        height: 35px;
        border-radius: 50px;
        padding: 0 15px;
        border: none;
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
        margin-top: 50px;
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
`;
export default Register;
