import { FaYoutube, FaFacebook } from "react-icons/fa";

export default function About() {
  return (
    <>
      <h1 className="page-content creditMain">
        Frontend and Backend Developer: Sebastian G. Abuyo
      </h1>
      <a className="icon">
        <a
          target="_blank"
          href="https://www.youtube.com/channel/UCjlhn4r78Fg1rEXTJUHOleQ"
          className="seb-youtube-channel"
        >
          <FaYoutube className="browser-icon youtube-icon" />
        </a>
        <a
          href="https://www.facebook.com/memes.are.cool.i.guess"
          target="_blank"
          className="seb-facebook-channel"
        >
          <FaFacebook className="browser-icon facebook-icon" />
        </a>
      </a>
      <div className="bottom-header">THIS SECTION IS UNDER CONSTRUCTION</div>
    </>
  );
}
