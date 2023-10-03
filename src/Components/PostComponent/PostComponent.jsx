import styled from "styled-components";
import avatar1 from "../../../public/avatar1.png";
import postImg1 from "../../../public/postImg1.png";
import ReactPlayer from "react-player";
import { BsChat, BsHeart, BsPause, BsPlay, BsShare } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
const PostComponent = ({ desc, thumbnailUrl, videoUrl, title }) => {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef();
  const togglePlay = () => {
    setPlaying(!playing);
  };
  useEffect(() => {
    const options = {
      root: null, // use the viewport as the root
      rootMargin: "0px", // no margin
      threshold: 0.5, // 50% of the video element must be visible
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Video is in view, play it
          setPlaying(true);
        } else {
          // Video is out of view, pause it
          setPlaying(false);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);
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
        <p>{title}</p>
      </div>
      <div className="img-status">
        <div ref={videoRef} className="img">
          <ReactPlayer
            url={videoUrl}
            width="100%"
            height="100%"
            controls={true}
            playing={playing}
          />
          <div className="play-button" onClick={togglePlay}>
            {playing ? <BsPause /> : <BsPlay />}
          </div>
          <div className="desc">
            <p>{desc}</p>
            <span>On the way - (alan walker) - music hip hop...</span>
          </div>
        </div>
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
  gap: 10px;
  .post-user-details {
    width: 545.112px;
    height: 50px;
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    .user-details {
      display: flex;
      gap: 5.4px;
      .avatar {
        width: 52px;
        height: 52px;
        flex-shrink: 0;
        display: flex;
        justify-content: start;
        align-items: center;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
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
    width: 80%;
    text-align: left;
    display: flex;
    justify-content: start;
    margin-left: 5px;
    margin-top: 2px;
    p {
      color: #000;
      font-family: Poppins;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      white-space: nowrap; /* Prevent text from wrapping to the next line */
      overflow: hidden; /* Hide any content that overflows its container */
      text-overflow: ellipsis; /* Display an ellipsis (...) when text overflows */
      max-width: 150px;
    }
  }
  .img-status {
    height: 570px;
    flex-shrink: 0;
    display: grid;
    margin-top: 9px;
    grid-template-columns: 320px auto;
    gap: 10px;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    .img {
      width: 100%;
      position: relative;
      height: 100%;
      overflow: hidden;
      background-color: gray;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #000;
      border-radius: 24.731px;
      margin-left: 62px;
      z-index: 1;
      .play-button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;
        font-size: 24px;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        padding: 10px;
        z-index: 100;
        transition: background-color 0.2s;
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .play-button:hover {
        background-color: rgba(0, 0, 0, 0.7);
      }
      .desc {
        position: absolute;
        overflow: hidden;
        bottom: 0;
        width: 320px;
        height: 498px;
        flex-shrink: 0;
        border-radius: 24.731px;
        opacity: 0.8;
        display: flex;
        flex-direction: column;
        justify-content: end;
        align-items: center;
        /* align-items: center; */
        z-index: 5;
        padding: 10px;
        padding-bottom: 35px;
        background: linear-gradient(
          0deg,
          #1c1c1c 7.3%,
          rgba(45, 45, 45, 0.35) 35.03%,
          rgba(48, 48, 48, 0) 45.12%
        );
        mix-blend-mode: normal;
        p {
          color: #bcbcbc;
          font-family: Roboto;
          font-size: 10.234px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          z-index: 2;
        }
        span {
          color: #bcbcbc;
          font-family: Roboto;
          font-size: 8.528px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }
    }
    .status {
      height: 100%;
      width: 115px;
      display: flex;
      flex-direction: column;
      justify-content: end;
      align-items: end;
      gap: 21px;

      .status-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 6px;

        button {
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: none;

          border-radius: 100%;

          svg {
            font-size: 22px;
          }
        }
        span {
          font-size: 0.6rem;
        }
      }
    }
  }
  @media (max-width: 768px) {
    width: 100%;
    height: 671.334px;
    .post-user-details {
      width: 380.112px;
    }
    .title {
      width: 50%;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 100%;
    .post-user-details {
      width: 450.112px;
    }
    .title {
      width: 70%;
    }
  }
`;
export default PostComponent;
