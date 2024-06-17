import { Link } from "react-router-dom";
import { MouseEvent } from "react";
import { useEffect } from "react";
import PadayoGreen from "../Assets/Padayo_Green.png";
import PadayoColor from "../Assets/Padayo_Color.png";
import LandingPageBG from "../Assets/Landing_Page_BG.png";
import Polaroid from "../Assets/Land-Pola.png";
import LeavesBG from "../Assets/Leaves_BG.png";
import { LiaArrowRightSolid } from "react-icons/lia";

export default function LandingPage() {
  const scrollToAbout = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const aboutElement = document.querySelector("#about") as HTMLElement;
    if (aboutElement) {
      window.scrollTo({
        top: aboutElement.offsetTop,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    document.body.style.backgroundColor = "#eff8f1";
  }, []);

  return (
    <>
      <nav className="nav-front">
        <a>
          <img src={PadayoGreen} className="web-name" />
        </a>
        <ul>
          <li>
            <a
              href="#about"
              onClick={scrollToAbout}
              className="padayo-navbar-about"
            >
              About us
            </a>
          </li>
          <li>
            <Link to="/signin" style={{ zIndex: "5" }}>
              <button className="front-signup-btn">Sign In</button>
            </Link>
          </li>
        </ul>
      </nav>

      <div>
        <div className="padayo-main">
          <div className="padayo-main-container">
            <img src={PadayoColor} className="padayo-logo" />
            <h1 className="padayo-text">
              Gain new perspectives and explore your way!
            </h1>
            <Link
              to="/signup"
              className="padayo-main-button"
              style={{ zIndex: "5" }}
            >
              Start Exploring
              <LiaArrowRightSolid className="arrow-icon" />
            </Link>
          </div>
        </div>

        <div className="padayo-about">
          <div>
            <h1 className="padayo-about-header" id="about">
              About Us
            </h1>

            <div className="padayo-about-text-container">
              <p>
                With Padayo, travelers can say goodbye to the hassle of
                traditional trip planning and hello to seamless, stress-free
                exploration. Whether you're a solo adventurer, a family on
                vacation, or a group of friends seeking adventure.
              </p>
              <p>
                Padayo caters to your every need, offering tailored
                recommendations, detailed information about local landmarks and
                businesses, and intuitive navigation features to guide you every
                step of the way. From historic landmarks to trendy cafes, Padayo
                ensures that every traveler finds exactly what they're looking
                for. No matter where the road takes you Padayo will guarantee
                your travels are hassle-free!
              </p>
            </div>
          </div>
        </div>
      </div>
      <img src={LandingPageBG} className="bg-grass" />
      <img src={Polaroid} className="bg-pola" />
      <img src={LeavesBG} className="bg-leaves" />
    </>
  );
}
