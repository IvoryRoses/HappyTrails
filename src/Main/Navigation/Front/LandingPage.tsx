import { Link } from "react-router-dom";
import { MouseEvent } from "react";
import { useEffect } from "react";
import PadayoWhite from "../Image/Padayo_White.png";
import PadayoColor from "../Image/Padayo_Color.png";
import LandingPageBG from "../Image/Landing_Page_BG.png";

export default function LandingPage() {
  const scrollToAbout = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const aboutElement = document.querySelector("#about") as HTMLElement;
    if (aboutElement) {
      window.scrollTo({
        top: aboutElement.offsetTop - 200,
        behavior: "smooth",
      });
    }
  };

  const scrollToHome = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const aboutElement = document.querySelector("#home") as HTMLElement;
    if (aboutElement) {
      window.scrollTo({
        top: aboutElement.offsetTop,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    document.body.style.backgroundColor = "#E5EBE6";
  }, []);

  return (
    <>
      <div className="trial">
        <nav className="nav-front">
          <a onClick={scrollToHome}>
            <img src={PadayoWhite} className="web-name" />
          </a>
          <ul>
            <li>
              <a href="#about" onClick={scrollToAbout}>
                About Us
              </a>
            </li>
            <li>
              <Link to="/signin">Log In</Link>
            </li>
            <li>
              <button className="front-signup-btn">
                <Link to="/signup">Sign Up</Link>
              </button>
            </li>
          </ul>
        </nav>
        <div className="padayo">
          <img src={PadayoColor} className="padayo-logo" id="home" />
          <h1 className="padayo-text">
            Gain new perspectives and explore your way!
          </h1>
        </div>
        <div>
          <img src={LandingPageBG} className="bg-grass" />
        </div>
        <h1 className="about-text" id="about">
          About Us
        </h1>
        <p className="bruh-text">
          With Padayo, travelers can say goodbye to the hassle of traditional
          trip planning and hello to seamless, stress-free exploration. Whether
          you're a solo adventurer, a family on vacation, or a group of friends
          seeking adventure, Padayo caters to your every need, offering tailored
          recommendations, detailed information about local landmarks and
          businesses, and intuitive navigation features to guide you every step
          of the way. From historic landmarks to trendy cafes, Padayo ensures
          that every traveler finds exactly what they're looking for. No matter
          where the road takes you Padayo will guarantee your travels are
          hassle-free!
        </p>
      </div>
    </>
  );
}
