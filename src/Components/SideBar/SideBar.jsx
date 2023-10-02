import { Link } from "react-router-dom";
import styled from "styled-components";
import { BsStars, BsCollectionPlay, BsTwitter } from "react-icons/bs";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import {
  BiLogoFacebook,
  BiLogoLinkedin,
  BiLogoInstagram,
} from "react-icons/bi";
import appleStore from "../../../public/appleStore.jpg";
import playStore from "../../../public/playstore.jpg";
import { RiGroupLine } from "react-icons/ri";
const SideBar = () => {
  return (
    <Sidebar>
      <div className="trending-following-explore">
        <ul>
          <li>
            <Link>
              <BsStars />
              <span></span>Trending
            </Link>
          </li>
          <li>
            <Link>
              <RiGroupLine />
              <span></span>Following
            </Link>
          </li>
          <li>
            <Link>
              <BsCollectionPlay />
              <span></span>Explore
            </Link>
          </li>
        </ul>
      </div>
      <div className="popular">
        <h4>Popular Creators</h4>
        <div className="popular-creators">
          <div className="popular-creator">
            <div className="avatar">
              <img
                src="https://img.favpng.com/18/18/18/computer-icons-icon-design-avatar-png-favpng-X29r5WhWMXVYvNsYXkR4iBgwf.jpg"
                alt="avatar"
              />
            </div>
            <div className="creator-details">
              <p>Makenna Rosser</p>
              <span>@rosser_makenna</span>
            </div>
          </div>
          <div className="popular-creator">
            <div className="avatar">
              <img
                src="https://img.favpng.com/18/18/18/computer-icons-icon-design-avatar-png-favpng-X29r5WhWMXVYvNsYXkR4iBgwf.jpg"
                alt="avatar"
              />
            </div>
            <div className="creator-details">
              <p>Makenna Rosser</p>
              <span>@rosser_makenna</span>
            </div>
          </div>
          <div className="popular-creator">
            <div className="avatar">
              <img
                src="https://img.favpng.com/18/18/18/computer-icons-icon-design-avatar-png-favpng-X29r5WhWMXVYvNsYXkR4iBgwf.jpg"
                alt="avatar"
              />
            </div>
            <div className="creator-details">
              <p>Makenna Rosser</p>
              <span>@rosser_makenna</span>
            </div>
          </div>
          <div className="popular-creator">
            <div className="avatar">
              <img
                src="https://img.favpng.com/18/18/18/computer-icons-icon-design-avatar-png-favpng-X29r5WhWMXVYvNsYXkR4iBgwf.jpg"
                alt="avatar"
              />
            </div>
            <div className="creator-details">
              <p>Makenna Rosser</p>
              <span>@rosser_makenna</span>
            </div>
          </div>
          <div className="popular-creator">
            <div className="avatar">
              <img
                src="https://img.favpng.com/18/18/18/computer-icons-icon-design-avatar-png-favpng-X29r5WhWMXVYvNsYXkR4iBgwf.jpg"
                alt="avatar"
              />
            </div>
            <div className="creator-details">
              <p>Makenna Rosser</p>
              <span>@rosser_makenna</span>
            </div>
          </div>
        </div>
        <Link>
          See more <MdOutlineKeyboardArrowRight />
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
  );
};

const Sidebar = styled.div`
  width: 100%;
  height: 100vh;
  grid-template-rows: 20% 40% 40%;
  gap: 5rem;
  .trending-following-explore {
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: start;
    align-items: start;
    ul {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      li {
        a {
          display: flex;
          gap: 0.3rem;
          color: black;
          font-weight: bold;
          font-size: 1rem;
          &:hover {
            color: var(--secondary-text-color);
          }
        }
      }
    }
  }
  .popular {
    width: 100%;
    display: flex;
    padding: 2.1rem 0;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    h4 {
      font-weight: bold;
      font-size: 1.1rem;
      margin: 1rem 0;
      text-transform: capitalize;
    }
    .popular-creators {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      .popular-creator {
        display: flex;
        gap: 0.5rem;
        .avatar {
          img {
            width: 2rem;
          }
        }
        .creator-details {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: start;
          p {
            font-size: 0.8rem;
            font-weight: 600;
            margin-bottom: 0;
          }
          span {
            font-size: 0.5rem;
          }
        }
      }
    }
    a {
      display: flex;
      align-items: center;
      gap: 0.1rem;
      margin: 1rem 0;
      font-size: 0.8rem;
      text-transform: capitalize;
      svg {
        font-size: 1rem;
      }
    }
  }
  .download-app {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.4rem;
    gap: 0.5rem;
    h4 {
      font-size: 1.1rem;
    }
    .store {
      display: flex;
      gap: 0.5rem;
      .apple-store {
        width: 7rem;
        height: 2.5rem;

        overflow: hidden;
        border-radius: 0.5rem;
        border: 1px solid gray;
        button {
          img {
            width: 100%;
            object-fit: cover;
            transform: scaleX(1.2) scaleY(1.55);
          }
        }
      }
      .play-store {
        width: 7rem;
        height: 2.5rem;
        overflow: hidden;
        border-radius: 0.5rem;
        border: 1px solid gray;
        button {
          img {
            width: 100%;
            object-fit: cover;
            transform: scaleX(1.15) scaleY(1.2);
          }
        }
      }
    }
  }
  .about {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    h4 {
      font-size: 1.1rem;
      font-weight: bold;
    }
    .menus {
      ul {
        display: flex;
        flex-wrap: wrap;
        column-gap: 0.5rem;
        li {
          a {
            font-size: 0.8rem;
            color: gray;
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
      ul {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        li {
          background-color: #e6e6e6;
          padding: 0.1rem 0;
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
              font-size: 0.9rem;
              padding: 0;
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
`;
export default SideBar;
