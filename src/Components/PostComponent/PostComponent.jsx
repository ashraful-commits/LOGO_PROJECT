import styled from "styled-components";

import ReactPlayer from "react-player";
import { BsChat, BsHeart, BsPause, BsPlay, BsShare } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  arrayUnion,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { app } from "../../firebase.confige";
import { getAuth } from "firebase/auth";

// Define the 'PostComponent' functional component.
const PostComponent = ({
  desc,
  thumbnailUrl,
  videoUrl,
  title,
  id,
  avatar,
  email,
  name,
}) => {
  const [playing, setPlaying] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({});
  console.log(loggedInUser);
  const auth = getAuth(app);
  useEffect(() => {
    const db = getFirestore(app);
    const fetchUserDataById = async () => {
      const docRef = doc(db, "users", auth?.currentUser?.uid); // Assuming "users" is the collection name
      const docSnap = await getDoc(docRef);

      setLoggedInUser(docSnap.data());
      if (docSnap.exists()) {
        let user = [];
        const userdata = docSnap.data();
        userdata.following.forEach(async (item) => {
          const followersRef = doc(db, "users", item);
          const followSnp = await getDoc(followersRef);
          user.push(followSnp.data());
        });
        setLoggedInUser((prev) => ({ ...prev, following: user }));
      } else {
        // Return null if the user document does not exist
        return null;
      }
    };
    fetchUserDataById();
  }, [id]);
  // Reference to the video element for IntersectionObserver.
  const videoRef = useRef();

  // Function to toggle video playback.
  const togglePlay = () => {
    setPlaying(!playing);
  };

  // Effect to set up IntersectionObserver for video.
  useEffect(() => {
    const options = {
      root: null, // Use the viewport as the root.
      rootMargin: "0px", // No margin.
      threshold: 0.5, // 50% of the video element must be visible.
    };

    // Callback function for IntersectionObserver.
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Video is in view, play it.
          setPlaying(true);
          videoRef.current?.seekTo(0); // Reset video to the beginning.
        } else {
          // Video is out of view, pause it.
          setPlaying(false);
        }
      });
    };

    // Create an IntersectionObserver instance.
    const observer = new IntersectionObserver(handleIntersection, options);

    // Observe the video element when it's available.
    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    // Cleanup function to unobserve the video element.
    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  // State to manage loading state.
  const [loading, setLoading] = useState(true);

  // Simulate loading data with a delay (replace with your actual data loading logic).
  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Set loading to false when data is ready.
    }, 2000); // Adjust the delay as needed.
  }, []);

  const handleFollow = async (id) => {
    const db = getFirestore(app);
    const auth = getAuth();

    try {
      const followingRef = doc(db, "users", auth?.currentUser?.uid);
      const followerRef = doc(db, "users", id);

      await updateDoc(followerRef, {
        followers: arrayUnion(auth?.currentUser?.uid),
      });
      await updateDoc(followingRef, {
        following: arrayUnion(id),
      });

      // At this point, the documents are updated instantly
    } catch (error) {
      console.error("Error updating follower and following arrays:", error);
    }
  };

  const handleUnfollow = async (id) => {
    const db = getFirestore(app);
    const auth = getAuth();

    try {
      const followingRef = doc(db, "users", auth?.currentUser?.uid);
      const followerRef = doc(db, "users", id);

      // Fetch the current data from Firestore
      const followingDoc = await getDoc(followingRef);
      const followerDoc = await getDoc(followerRef);

      // Modify the arrays in memory
      const updatedFollowerArray = followerDoc
        .data()
        .followers.filter((item) => item !== id);
      const updatedFollowingArray = followingDoc
        .data()
        .following.filter((item) => item !== id);

      // Update Firestore documents with the modified arrays
      await setDoc(
        followerRef,
        { followers: updatedFollowerArray },
        { merge: true }
      );
      await setDoc(
        followingRef,
        { following: updatedFollowingArray },
        { merge: true }
      );

      // At this point, the documents are updated instantly
    } catch (error) {
      console.error("Error updating follower and following arrays:", error);
    }
  };

  return (
    <>
      {loading ? (
        <SkeletonLoader>
          <div className="skeleton-loader">
            <div className="post-user-details">
              <div className="user-details">
                <div className="avatar"></div>
                <div className="details">
                  <div className="skeleton-item"></div>
                  <div className="skeleton-item"></div>
                </div>
              </div>
              <div className="follow">
                <div className="skeleton-button"></div>
              </div>
            </div>
            <div className="title">
              <div className="skeleton-item"></div>
            </div>
            <div className="img-status">
              <div className={`img ${loading ? "loading" : ""}`}>
                <div className="skeleton-item"></div>
                <div className="play-button"></div>
                <div className="desc">
                  <div className="skeleton-item"></div>
                  <div className="skeleton-item"></div>
                </div>
              </div>
              <div className="status">
                <div className="status-item">
                  <div className="skeleton-button"></div>
                  <div className="skeleton-item"></div>
                </div>
                <div className="status-item">
                  <div className="skeleton-button"></div>
                  <div className="skeleton-item"></div>
                </div>
                <div className="status-item">
                  <div className="skeleton-button"></div>
                  <div className="skeleton-item"></div>
                </div>
              </div>
            </div>
          </div>
        </SkeletonLoader>
      ) : auth?.currentUser?.uid !== id ? (
        <PostContainer>
          <div className="post-user-details">
            <div className="user-details">
              <div className="avatar">
                <Link to={`/${id}`}>
                  {avatar ? (
                    <img src={avatar} alt="" />
                  ) : (
                    <img
                      src={`https://img.freepik.com/premium-vector/young-smiling-man-avatar-man-with-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-3d-vector-people-character-illustration-cartoon-minimal-style_365941-860.jpg`}
                      alt=""
                    />
                  )}
                </Link>
              </div>
              <div className="details">
                <p>{name}</p>
                <span>@{email}</span>
              </div>
            </div>
            <div className="follow">
              {loggedInUser.id !== id &&
              loggedInUser?.following.some((item) => item.id === id) ? (
                <button onClick={() => handleFollow(id)}>unfollow</button>
              ) : (
                <button onClick={() => handleUnfollow(id)}>follow</button>
              )}
            </div>
          </div>
          <div className="title">
            <p>{title}</p>
          </div>
          <div className="img-status">
            <div ref={videoRef} className="img">
              {!playing && thumbnailUrl && <img src={thumbnailUrl} alt="" />}
              <ReactPlayer
                url={videoUrl}
                width="100%"
                height="100%"
                controls={false}
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
      ) : (
        <PostContainer>
          <div className="post-user-details">
            <div className="user-details">
              <div className="avatar">
                <Link to={`/${id}`}>
                  {avatar ? (
                    <img src={avatar} alt="" />
                  ) : (
                    <img
                      src={`https://img.freepik.com/premium-vector/young-smiling-man-avatar-man-with-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-3d-vector-people-character-illustration-cartoon-minimal-style_365941-860.jpg`}
                      alt=""
                    />
                  )}
                </Link>
              </div>
              <div className="details">
                <p>{name}</p>
                <span>@{email}</span>
              </div>
            </div>
            <div className="follow">
              {loggedInUser.following.some((item) => item.id === id) ? (
                <button onClick={() => handleFollow(id)}>Follow</button>
              ) : (
                <button onClick={() => handleUnfollow(id)}>Unfollow</button>
              )}
            </div>
          </div>
          <div className="title">
            <p>{title}</p>
          </div>
          <div className="img-status">
            <div ref={videoRef} className="img">
              {!playing && thumbnailUrl && <img src={thumbnailUrl} alt="" />}
              <ReactPlayer
                url={videoUrl}
                width="100%"
                height="100%"
                controls={false}
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
      )}
    </>
  );
};
/* ... (Styles for the main container) */
const PostContainer = styled.div`
  width: 545.112px;
  height: 671.334px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
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
        cursor: pointer;
        border-radius: 100%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        a {
          border-radius: 100%;
          img {
            width: 100%;
            height: 100%;
          }
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
          cursor: pointer;
        }
        span {
          color: #4f4f4f;
          font-family: Poppins;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          cursor: pointer;
          width: 60px !important; /* Adjust the width as needed */
          white-space: nowrap; /* Prevent text from wrapping to the next line */
          overflow: hidden; /* Hide any overflowing text */
          text-overflow: ellipsis; /* Add ellipsis (...) for truncated text */
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
        position: relative;
        transition: all 0.5s ease-in-out;
        &:hover {
          background-image: linear-gradient(#71bb42, #8fdd5d);
        }
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
    width: 100%;
    height: 570px;
    flex-shrink: 0;
    display: grid;
    margin-top: 9px;
    grid-template-columns: 320px auto;
    gap: 10px;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding-bottom: 30px;
    overflow: hidden;
    border-bottom: 1px solid #eeeeee;
    .loading {
      background-color: #bcbcbc !important;
      .play-button {
        display: none;
      }
      .desc {
        display: none;
      }
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .img {
      width: 100%;
      position: relative;
      height: 100%;
      overflow: hidden;
      background-color: gray;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #080808;
      border-radius: 24.731px;
      margin-left: 62px;
      z-index: 1;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .play-button {
        opacity: 0;
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
        transition: all 0.5s ease-in-out;
      }
      .play-button:hover {
        background-color: rgba(0, 0, 0, 0.7);
      }
      &:hover {
        .play-button {
          opacity: 1;
        }
      }
      .desc {
        position: absolute;
        overflow: hidden;
        bottom: 0;
        width: 100%;
        height: 498px;
        flex-shrink: 0;
        border-radius: 24.731px;
        opacity: 0.8;
        display: flex;
        flex-direction: column;
        justify-content: end;
        align-items: start;
        white-space: nowrap; /* Prevent text from wrapping to the next line */
        overflow: hidden; /* Hide overflowing text */
        text-overflow: ellipsis; /* Display an ellipsis (...) when text overflows */
        max-width: 100%;
        z-index: 5;
        padding: 20px;
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
          white-space: nowrap; /* Prevent text from wrapping */
          overflow: hidden; /* Hide overflowing text */
          text-overflow: ellipsis; /* Display an ellipsis (...) when text is truncated */
          width: 100%;
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
          transition: all 0.5s ease-in-out;
          &:hover {
            background-color: #71bb42;
            svg {
              color: white;
            }
          }

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
    width: 98vw;
    margin: 0 auto;
    padding: 0 10px;
    height: 671.334px;
    .post-user-details {
      width: 100%;
    }
    .details {
      span {
        width: 150px; /* Adjust the width as needed */
        white-space: nowrap; /* Prevent text from wrapping to the next line */
        overflow: hidden; /* Hide any overflowing text */
        text-overflow: ellipsis;
      }
    }
    .img-status {
      width: 100%;
      grid-template-columns: 95%;
      grid-template-rows: 470px auto;
      gap: 21px;

      .status {
        width: 100%;
        justify-content: space-around;
        align-items: center;
        flex-direction: row;
      }
      .img {
        margin-left: 0px;
        .desc {
          p {
            color: #bcbcbc;
            font-family: Roboto;
            font-size: 10.234px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            z-index: 2;
            white-space: nowrap; /* Prevent text from wrapping */
            overflow: hidden; /* Hide overflowing text */
            text-overflow: ellipsis; /* Display an ellipsis (...) when text is truncated */
            width: 100%;
          }
        }
      }
    }
    .title {
      width: 75%;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 100%;
    top: 5%;
    .post-user-details {
      width: 550.112px;
    }
    .img-status {
      grid-template-columns: 420px auto;
      padding-bottom: 30px;
      .img {
        width: 100%;
        .loading {
          width: 100%;
        }
        .desc {
          p {
            color: #bcbcbc;
            font-family: Roboto;
            font-size: 10.234px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            z-index: 2;
            white-space: nowrap; /* Prevent text from wrapping */
            overflow: hidden; /* Hide overflowing text */
            text-overflow: ellipsis; /* Display an ellipsis (...) when text is truncated */
            width: 100%;
          }
        }
      }
    }
    .title {
      width: 70%;
    }
  }
`;
// Create a separate styled component for the skeleton

const SkeletonLoader = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  animation: loading 1s infinite alternate;

  .post-user-details {
    width: 100%;
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
        cursor: pointer;
        border-radius: 100%;
        background-color: #ccc; /* Placeholder color */

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .details {
        p {
          width: 100px; /* Adjust width */
          height: 20px; /* Adjust height */
          background-color: #ccc; /* Placeholder color */
          margin: 0;
        }

        span {
          width: 80px; /* Adjust width */
          height: 14px; /* Adjust height */
          background-color: #ccc; /* Placeholder color */
          margin: 0;
        }
      }
    }

    .follow {
      display: flex;
      justify-content: flex-end;

      button {
        width: 75px;
        height: 32px;
        flex-shrink: 0;
        background-color: #ccc; /* Placeholder color */
        border-radius: 8px;
        border: none;
        color: #fff;
        text-align: center;
        font-family: Segoe UI;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        position: relative;
        transition: all 0.5s ease-in-out;

        &:hover {
          background-color: #71bb42;
        }
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
      width: 150px; /* Adjust width */
      height: 16px; /* Adjust height */
      background-color: #ccc; /* Placeholder color */
      margin: 0;
    }
  }

  .img-status {
    height: 570px;
    width: 100%;
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
      background-color: #ccc8c8; /* Placeholder color */
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      background-color: #e2e2e2;
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
        background-color: #ccc; /* Placeholder color */
      }

      .desc {
        position: absolute;
        overflow: hidden;
        bottom: 0;
        width: 300px;
        height: 498px;
        flex-shrink: 0;
        border-radius: 24.731px;
        opacity: 0.8;
        display: flex;
        flex-direction: column;
        justify-content: end;
        align-items: start;
        background-color: transparent;
        mix-blend-mode: normal;

        p {
          width: 100%; /* Adjust width */
          height: 10px; /* Adjust height */
          background-color: #ccc; /* Placeholder color */
          margin: 0;
        }

        span {
          width: 100%; /* Adjust width */
          height: 8px; /* Adjust height */
          background-color: #ccc; /* Placeholder color */
          margin: 0;
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
          transition: all 0.5s ease-in-out;
          background-color: #ccc; /* Placeholder color */

          &:hover {
            background-color: #71bb42;
            svg {
              color: white;
            }
          }

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

  @keyframes loading {
    0% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    margin: 0 auto;
    height: 671.334px;

    .post-user-details {
      width: 205.112px;
      padding: 0 50px;
    }

    .title {
      width: 65%;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 100%;
    top: 5%;

    .post-user-details {
      width: 100%;
    }

    .img-status {
      grid-template-columns: 420px auto;
      margin-right: 4px;
    }

    .title {
      width: 70%;
    }
  }
`;

export default PostComponent;
