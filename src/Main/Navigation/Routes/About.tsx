import Map from "../Assets/Account Assets/About_Map.png";
import FirstTop from "../Assets/Account Assets/About_First_Top.png";
import FirstBottom from "../Assets/Account Assets/About-First-Bottom.png";
import FirstRight from "../Assets/Account Assets/About_First_Right.png";
import SecondBottom from "../Assets/Account Assets/About-Second-Bottom.png";
import Seb from "../Assets/Account Assets/Seb.png";
import Fred from "../Assets/Account Assets/Fred.png";
import Just from "../Assets/Account Assets/Just.png";
import Alex from "../Assets/Account Assets/Alex.png";
import Marker from "../Assets/Account Assets/Red-Marker.png";
import { MdOutlineKeyboardDoubleArrowDown } from "react-icons/md";
import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    document.body.style.backgroundColor = "#ffffff";
  }, []);
  return (
    <>
      <div className="about-first">
        <div className="about-text-container">
          <h1 className="about-text-header">
            ENHANCING TOURIST EXPLORATION AND EXPERIENCE UTILIZING PATHFINDING
            ALGORITHMS
          </h1>
          <div className="about-text-para">
            <p>
              Padayo is our attempt to create a practical, intuitive, and
              customizable tourist exploration web application that aims to
              elevate the usage of pathfinding algorithms
            </p>
            <p style={{ marginTop: "1rem" }}>
              We seek to promote businesses, tourism, and lesser known
              destinations in our quest to enhance the typical tourist's
              experience to be as memorable as possible.
            </p>
          </div>
          <div className="about-text-suggestion">
            <p>Got any feedbacks or suggestions?</p>
            <p>
              Click{" "}
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSd8BsxaWkn2h6yRAFb7C2KHUnF8acxD4sFhr7nlo8V_8Gw_2Q/viewform"
                target="_blank"
              >
                Here
              </a>{" "}
              to take a survey!
            </p>
          </div>
        </div>
      </div>
      <div className="about-second">
        <div className="team-container">
          <h1>Behind The Project: Padayo</h1>
          <div className="team-align">
            <div className="one">
              <p>Abuyo, Sebastian</p>
              <img src={Seb} />
              <p>Project Manager</p>
              <p>Lead Programmer</p>
            </div>
            <div className="two">
              <p>Romero, Justine</p>
              <img src={Just} />
              <p>Asst. Project Manager</p>
              <p>Algoritm Specialist</p>
            </div>
            <div className="three">
              <p>Atienza, Dominic Fred</p>
              <img src={Fred} />
              <p>Document Manager</p>
              <p>UI Designer</p>
            </div>
            <div className="four">
              <p>Roman, Alessandra</p>
              <img src={Alex} />
              <p>Lead Researcher</p>
              <p>Data Manager</p>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="bottom-header">THIS SECTION IS UNDER CONSTRUCTION</div> */}
      <img src={FirstTop} className="bg-first-top" />
      <img src={Map} className="bg-map" />
      <img src={FirstBottom} className="bg-first-bottom" />
      <img src={FirstRight} className="bg-first-right" />
      <img src={SecondBottom} className="bg-second-bottom" />
      <img src={Marker} className="bg-marker" />
      <MdOutlineKeyboardDoubleArrowDown className="bg-arrow" />
    </>
  );
}
