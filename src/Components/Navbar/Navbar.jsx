import styled from "styled-components";
import { AiOutlineMenu } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
const Navbar = () => {
  return (
    <Container>
      <div className="left">
        {/* small menu  */}
        <div className="small-menu">
          <button>
            <AiOutlineMenu />
            <span>Menu</span>
          </button>
        </div>
        {/* search field  */}
      </div>
      <div className="middle">
        <div className="search-field">
          <form action="">
            <CiSearch />
            <input type="text" placeholder="Search" />
          </form>
        </div>
        <h1>LOGO</h1>
      </div>
      <div className="right">
        <span>Creator</span>
        <button>Get App</button>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 75px;
  padding: 1rem 2rem;
  background-color: white;
  display: grid;
  grid-template-columns: 5% auto 10%;
  box-shadow: 0px 12px 42px -4px rgba(24, 39, 75, 0.12),
    0px 8px 18px -6px rgba(24, 39, 75, 0.12);
  align-items: center;
  gap: 1rem;
  .left {
    display: flex;
    gap: 1rem;
    width: 100%;
    height: 100%;
    justify-content: start;
    align-items: center;
    .small-menu {
      display: flex;
      justify-content: center;
      align-items: center;
      button {
        color: #000;
        text-align: center;
        font-family: Roboto;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        text-transform: capitalize;
        display: flex;
        align-items: center;
        gap: 0.3rem;
        border: none;
        cursor: pointer;
        background-color: transparent;
        svg {
          font-size: 24px;
        }
        span {
          font-size: 0.8rem;
        }
      }
    }
    .search-field {
      display: flex;
      align-items: center;
      justify-content: start;
      form {
        display: flex;
        gap: 0.5rem;
        svg {
          font-size: 24px;
        }
        input {
          border: none;
          &:focus {
            outline: none;
          }
        }
      }
    }
  }
  .middle {
    width: 100%;
    height: 30px;
    display: grid;
    padding: 0 10px;
    align-items: center;
    justify-content: center;
    grid-template-columns: 50% 50%;
    border-right: 0.2px solid gray;
    border-left: 0.2px solid gray;
    color: var(--main-text-color);
    .search-field {
      display: flex;
      align-items: center;
      justify-content: start;
      form {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        svg {
          font-size: 1.4rem;
          color: #000000;
        }
        input {
          border: none;
          &:focus {
            outline: none;
          }
        }
      }
    }
    h1 {
      font-size: 1.5rem;
    }
  }
  .right {
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 0.5rem;
    span {
      font-size: 0.8rem;
      text-transform: capitalize;
      font-weight: bold;
    }
    button {
      width: 93px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      border: none;
      background-image: var(--bg-gradient);
      padding: 0.5rem 0.5rem;
      border-radius: 1rem;
      font-size: 0.9rem;
      flex-shrink: 0;
      color: white;
    }
  }
`;
export default Navbar;
