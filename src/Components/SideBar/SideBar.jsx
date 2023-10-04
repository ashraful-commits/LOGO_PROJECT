import { Link } from "react-router-dom";
import styled from "styled-components";
import { BsTwitter } from "react-icons/bs";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import {
  BiLogoFacebook,
  BiLogoLinkedin,
  BiLogoInstagram,
} from "react-icons/bi";
import appleStore from "../../../public/appleStore1.png";
import playStore from "../../../public/palystore.png";
import avtar1 from "../../../public/avatar1.png";
import avtar2 from "../../../public/avatar2.png";
import avtar3 from "../../../public/avatar3.png";
import avtar4 from "../../../public/avatar4.png";
import avtar5 from "../../../public/avatar5.png";
import trending from "../../../public/trendingIcn.png";
import group from "../../../public/groupIcon.png";
import play from "../../../public/playIcon.png";
import { useEffect, useState } from "react";

const SideBar = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a delay, e.g., while fetching data
    setTimeout(() => {
      setLoading(false); // Set loading to false when your data is ready
    }, 2000); // Replace with your actual data loading logic
  }, []);
  return (
    <>
      {loading ? (
        <Sidebar>
          <div className="skeleton-loader">
            {/* Trending, Following, Explore */}
            <div className="skeleton-item"></div>
            <div className="skeleton-item"></div>
            <div className="skeleton-item"></div>

            {/* Popular Creators */}
            <div className="skeleton-item avatar"></div>
            <div className="skeleton-item creator-details">
              <div className="creator-name"></div>
              <div className="creator-username"></div>
            </div>

            {/* Download App */}
            <div className="skeleton-item download-app">
              <div className="store">
                <div className="apple-store"></div>
                <div className="play-store"></div>
              </div>
            </div>

            {/* About */}
            <div className="skeleton-item about">
              <div className="menus"></div>
              <div className="social"></div>
            </div>
          </div>
        </Sidebar>
      ) : (
        <Sidebar>
          <div className="trending-following-explore">
            <ul>
              <li>
                <Link>
                  <img src={trending} alt="trending" />
                  <span></span>Trending
                </Link>
              </li>
              <li>
                <Link>
                  <img src={group} alt="" />
                  <span></span>Following
                </Link>
              </li>
              <li>
                <Link>
                  <img src={play} alt="" />
                  <span></span>Explore
                </Link>
              </li>
            </ul>
          </div>
          <div className="popular">
            <h4>Popular Creators</h4>
            <ul className="popular-creators">
              <li className="popular-creator">
                <div className="avatar">
                  <img src={avtar1} alt="avatar" />
                </div>
                <div className="creator-details">
                  <p>Makenna Rosser</p>
                  <span>@rosser_makenna</span>
                </div>
              </li>
              <li className="popular-creator">
                <div className="avatar">
                  <img src={avtar2} alt="avatar" />
                </div>
                <div className="creator-details">
                  <p>Desirae Bator</p>
                  <span>@batorbaby</span>
                </div>
              </li>
              <li className="popular-creator">
                <div className="avatar">
                  <img src={avtar3} alt="avatar" />
                </div>
                <div className="creator-details">
                  <p>James Workman</p>
                  <span>@workman</span>
                </div>
              </li>
              <li className="popular-creator">
                <div className="avatar">
                  <img src={avtar4} alt="avatar" />
                </div>
                <div className="creator-details">
                  <p>Talan Stanton</p>
                  <span>@stanton</span>
                </div>
              </li>
              <li className="popular-creator">
                <div className="avatar">
                  <img src={avtar5} alt="avatar" />
                </div>
                <div className="creator-details">
                  <p>Madelyn</p>
                  <span>@madelynbips</span>
                </div>
              </li>
            </ul>
            <Link>
              See More <MdOutlineKeyboardArrowRight />
            </Link>
          </div>
          <div className="download-app">
            <h4>Download App</h4>
            <div className="store">
              <div className="apple-store">
                <button>
                  <img src={appleStore} alt="" />
                </button>
              </div>
              <div className="play-store">
                <button>
                  <img src={playStore} alt="" />
                </button>
              </div>
            </div>
          </div>
          <div className="about">
            <h4>About</h4>
            <div className="menus">
              <ul>
                <li>
                  <Link>About Us</Link>
                </li>
                <li>
                  <Link>Partnership</Link>
                </li>
                <li>
                  <Link>help</Link>
                </li>
                <li>
                  <Link> Safety</Link>
                </li>
                <li>
                  <Link> Community Guidelines</Link>
                </li>
              </ul>
            </div>
            <div className="social">
              <ul>
                <li>
                  <Link> Follow us</Link>
                </li>
                <li>
                  <Link>
                    <BiLogoFacebook />
                  </Link>
                </li>
                <li>
                  <Link>
                    <BiLogoLinkedin />
                  </Link>
                </li>
                <li>
                  <Link>
                    <BiLogoInstagram />
                  </Link>
                </li>
                <li>
                  <Link>
                    <BsTwitter />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </Sidebar>
      )}
    </>
  );
};

const Sidebar = styled.div`
  width: 100%;
  position: sticky; /* Make the sidebar sticky */
  top: 11.2%;
  bottom: 0; /* Stick to the top of the viewport */
  height: 100vh;
  grid-template-rows: 20% 40% 30%;
  gap: 5rem;
  .skeleton-loader {
    display: flex;
    flex-direction: column;
    gap: 20px; /* Adjust the spacing between items */
  }

  .skeleton-item {
    background-color: #f0f0f0; /* Placeholder background color */
    height: 20px;
    width: 100%;
    animation: loading 1s infinite alternate; /* Add a simple loading animation */
  }

  .avatar {
    border-radius: 50%;
    height: 50px;
    width: 50px;
  }

  .creator-details {
    display: flex;
    flex-direction: column;
    gap: 10px; /* Adjust the spacing between creator name and username */
  }

  @keyframes loading {
    0% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
  .trending-following-explore {
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: start;
    align-items: start;
    ul {
      display: flex;
      flex-direction: column;
      gap: 20px;
      li {
        a {
          color: #000;
          font-family: Poppins;
          font-size: 18px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
          display: flex;
          gap: 4px;
          color: black;
          position: relative;
          transition: color 0.5s ease-in-out;
          &:hover {
            color: var(--secondary-text-color);
          }
        }
      }
    }
  }
  .popular {
    width: 100%;
    height: 380px;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    margin-top: 42px;
    h4 {
      color: #000;
      font-family: Poppins;
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
    .popular-creators {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 16px;
      .popular-creator {
        cursor: pointer;
        display: flex;
        gap: 7px;
        position: relative;
        transition: all 0.5s ease-in-out;
        padding-right: 10px;
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
        &:hover {
          background-color: #71bb42;
          .creator-details {
            p {
              color: white;
            }
            span {
              color: white;
            }
          }
        }
        .avatar {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          img {
            flex-shrink: 0;
          }
        }
        .creator-details {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: start;
          p {
            margin-bottom: 0;
            color: #000;
            font-family: Poppins;
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
          }
          span {
            color: #4f4f4f;
            font-family: Poppins;
            font-size: 10px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
          }
        }
      }
    }
    a {
      color: #3c3c3c;
      font-family: Poppins;
      font-size: 14px;
      font-style: normal;
      margin-top: 20px;
      font-weight: 400;
      line-height: normal;
      display: flex;
      align-items: center;
      transition: all 0.5s ease-in-out;
      &:hover {
        color: #71bb42;
      }
      svg {
        font-size: 15px;
        margin-left: 2px;
        margin-top: 2px;
      }
    }
  }
  .download-app {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: -4px;
    gap: 5px;
    h4 {
      color: #000;
      font-family: Poppins;
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
    .store {
      display: flex;
      gap: 13px;
      margin-top: 7px;
      .apple-store {
        width: 121.333px;
        height: 40px;
        flex-shrink: 0;

        button {
          border-radius: 5px;
          border: none;
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
      }
      .play-store {
        width: 121.333px;
        height: 40px;
        flex-shrink: 0;
        button {
          border-radius: 5px;
          border: none;
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
      }
    }
  }
  .about {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    width: 100%;
    h4 {
      color: #000;
      font-family: Poppins;
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      margin-top: 11px;
    }
    .menus {
      width: 100%;
      margin-top: 16px;
      ul {
        display: flex;
        flex-wrap: wrap;
        row-gap: 15px;

        li {
          margin-right: 16px;
          &:last-child {
            margin-right: 2px;
          }
          a {
            white-space: nowrap;
            color: #3c3c3c;
            font-family: Poppins;
            text-transform: capitalize;
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            transition: all 0.5s ease-in-out;
            &:hover {
              color: var(--secondary-text-color);
            }
          }
        }
      }
    }
    .social {
      display: flex;
      justify-content: start;
      align-items: center;
      margin-top: 17px;
      ul {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        li {
          background-color: #e6e6e6;
          border-radius: 100%;
          width: 1.5rem;
          height: 1.5rem;
          display: flex;
          align-items: center;
          transition: all 0.5s ease-in-out;
          &:hover {
            background-color: #71bb42;
            a {
              svg {
                color: white;
              }
            }
          }
          &:first-child {
            width: 80px;
            background-color: transparent;
            margin: 0;
            padding: 0;
            a {
              font-family: Poppins;
              font-weight: 400;
              line-height: 24px;
              letter-spacing: 0em;
              text-align: left;
              svg {
                font-size: 20px;
                font-weight: bold;
              }
              &:first-child {
                font-size: 16px;
              }
            }
          }
          a {
            font-size: 0.8rem;
            display: flex;
            width: 100%;
            height: 100%;
            justify-content: center;
            align-items: center;
            color: gray;
            line-height: 0.3rem;
            &:first-child {
              display: flex;
              justify-content: start;
            }
            svg {
              font-size: 0.9rem;
              color: black;
              margin-left: 5px;
            }
            &:hover {
              color: var(--secondary-text-color);
            }
          }
        }
      }
    }
  }
  @media (max-width: 768px) {
    display: none;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 100%;
    top: 10%;
    .trending-following-explore {
      width: 100%;
      height: fit-content;
      display: flex;
      justify-content: start;
      align-items: start;
      ul {
        display: flex;
        flex-direction: column;
        gap: 20px;
        li {
          a {
            color: #000;
            font-family: Poppins;
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            display: flex;
            gap: 4px;
            color: black;

            &:hover {
              color: var(--secondary-text-color);
            }
          }
        }
      }
    }
    .popular {
      width: 100%;
      height: 380px;
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: start;
      margin-top: 42px;
      h4 {
        color: #000;
        font-family: Poppins;
        font-size: 17px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }
      .popular-creators {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-top: 16px;
        .popular-creator {
          display: flex;
          gap: 7px;
          .avatar {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 40px;
            img {
              flex-shrink: 0;
            }
          }
          .creator-details {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: start;
            p {
              margin-bottom: 0;
              color: #000;
              font-family: Poppins;
              font-size: 14px;
              font-style: normal;
              font-weight: 500;
              line-height: normal;
            }
            span {
              color: #4f4f4f;
              font-family: Poppins;
              font-size: 10px;
              font-style: normal;
              font-weight: 400;
              line-height: normal;
            }
          }
        }
      }
      a {
        color: #3c3c3c;
        font-family: Poppins;
        font-size: 14px;
        font-style: normal;
        margin-top: 20px;
        font-weight: 400;
        line-height: normal;
        display: flex;
        align-items: center;
        svg {
          font-size: 15px;
          margin-left: 2px;
          margin-top: 2px;
        }
      }
    }
    .download-app {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-top: -4px;
      gap: 5px;
      h4 {
        color: #000;
        font-family: Poppins;
        font-size: 17px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }
      .store {
        display: flex;
        gap: 13px;
        margin-top: 7px;
        .apple-store {
          width: 100.333px;
          height: 40px;
          flex-shrink: 0;

          button {
            border-radius: 5px;
            border: none;
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }
        }
        .play-store {
          width: 100.333px;
          height: 40px;
          flex-shrink: 0;
          button {
            border-radius: 5px;
            border: none;
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }
        }
      }
    }
    .about {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      width: 100%;
      h4 {
        color: #000;
        font-family: Poppins;
        font-size: 17px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        margin-top: 11px;
      }
      .menus {
        width: 100%;
        margin-top: 16px;
        ul {
          display: flex;
          flex-wrap: wrap;
          row-gap: 15px;

          li {
            margin-right: 16px;
            &:last-child {
              margin-right: 2px;
            }
            a {
              white-space: nowrap;
              color: #3c3c3c;
              font-family: Poppins;
              text-transform: capitalize;
              font-size: 14px;
              font-style: normal;
              font-weight: 400;
              line-height: normal;

              &:hover {
                color: var(--secondary-text-color);
              }
            }
          }
        }
      }
      .social {
        display: flex;
        justify-content: start;
        align-items: center;
        margin-top: 17px;
        ul {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          li {
            background-color: #e6e6e6;
            border-radius: 100%;
            width: 1.5rem;
            height: 1.5rem;
            display: flex;
            align-items: center;
            &:first-child {
              width: 80px;
              background-color: transparent;
              margin: 0;
              padding: 0;
              a {
                font-family: Poppins;
                font-weight: 400;
                line-height: 24px;
                letter-spacing: 0em;
                text-align: left;
                svg {
                  font-size: 20px;
                  font-weight: bold;
                }
                &:first-child {
                  font-size: 16px;
                }
              }
            }
            a {
              font-size: 0.8rem;
              display: flex;
              width: 100%;
              height: 100%;
              justify-content: center;
              align-items: center;
              color: gray;
              line-height: 0.3rem;
              &:first-child {
                display: flex;
                justify-content: start;
              }
              svg {
                font-size: 0.9rem;
                color: black;
                margin-left: 5px;
              }
              &:hover {
                color: var(--secondary-text-color);
              }
            }
          }
        }
      }
    }
  }
`;
export default SideBar;
