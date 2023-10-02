import styled from "styled-components";
import avatar1 from "../../../public/avatar1.png";
import postImg1 from "../../../public/postImg1.png";

import { BsChat, BsHeart, BsShare } from "react-icons/bs";
const PostComponent = () => {
  return (
    <PostContainer>
      <div className="post-user-details">
        <div className="user-details">
          <div className="avatar">
            <img src={avatar1} alt="" />
          </div>
          <div className="details">
            <p>Makenna Rosser</p>
            <span>@rosser_makenna</span>
          </div>
        </div>
        <div className="follow">
          <button>Follow</button>
        </div>
      </div>
      <div className="title">
        <p>Good Morning! Here is my latest magic video.</p>
      </div>
      <div className="img-status">
        <img src={postImg1} alt="" />
        <div className="status">
          <div className="status-item">
            <button>
              <BsHeart />
            </button>
            <span>22 M</span>
          </div>
          <div className="status-item">
            <button>
              <BsChat />
            </button>
            <span>15.5 k</span>
          </div>
          <div className="status-item">
            <button>
              <BsShare />
            </button>
            <span>3.5 k</span>
          </div>
        </div>
      </div>
    </PostContainer>
  );
};
const PostContainer = styled.div`
  width: 545.112px;
  height: 671.334px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  .post-user-details {
    width: 545.112px;
    height: 81px;
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    .user-details {
      display: flex;
      align-items: center;
      .avatar {
        width: 50px;
        height: 50px;
        flex-shrink: 0;
      }
      .details {
        p {
          color: #000;
          font-family: Poppins;
          font-size: 15.35px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
        }
        span {
          color: #4f4f4f;
          font-family: Poppins;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }
    }
    .follow {
      display: flex;
      justify-content: end;
      align-items: center;
      button {
        width: 75px;
        height: 32px;
        flex-shrink: 0;
        background-image: var(--bg-gradient);
        border-radius: 8px;
        border: none;
        color: #fff;
        text-align: center;
        font-family: Segoe UI;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }
    }
  }
  .title {
    width: 70%;
    text-align: left;
    display: flex;
    justify-content: start;
    p {
      color: #000;
      font-family: Poppins;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }
  .img-status {
    height: 570px;
    flex-shrink: 0;
    display: grid;
    gap: 0.5rem;
    grid-template-columns: 320px auto;
    align-items: center;
    justify-content: end;
    img {
      width: 100%;
      height: 100%;
    }
    .status {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: end;
      gap: 1rem;

      .status-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.2rem;
        button {
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: none;
          border-radius: 100%;
          padding: 0.1rem;
          svg {
            font-size: 1.2rem;
          }
        }
        span {
          font-size: 0.6rem;
        }
      }
    }
  }
`;
export default PostComponent;
