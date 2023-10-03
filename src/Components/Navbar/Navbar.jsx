import styled from "styled-components";
import { AiOutlineMenu, AiOutlineMinus } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import logo from "../../../public/LOGO.png";
import { useState } from "react";
const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <Container>
      <div className="container">
        {showMenu && (
          <div className="dropdown-menu">
            <ul>
              <li className="active">About us</li>
              <li>Partnership</li>
              <li>Help</li>
              <li>Safety</li>
              <li>Community Guidelines</li>
            </ul>
          </div>
        )}
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
  .dropdown-menu {
    position: absolute;
    padding: 20px;
    border-radius: 20px;
    border-top-left-radius: 0;
    left: 50px;
    top: 90%;
    background-color: white;
    box-shadow: 0 0 10px #e4e4e4;
    ul {
      display: flex;
      flex-direction: column;
      gap: 23px;
      li {
        padding: 5px 0;
      }
      .active {
        border-bottom: 1px solid gray;
      }
    }
  }
`;
export default Navbar;
