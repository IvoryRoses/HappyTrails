import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import { IoHome } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { BiSolidCompass } from "react-icons/bi";
import { PiGearSixFill } from "react-icons/pi";
import { TbInfoCircleFilled } from "react-icons/tb";
import { CiLogout } from "react-icons/ci";

export default function NavigationBar() {
  const location = useLocation();

  const isSignupRoute = location.pathname === "/signup";
  const isSigninRoute = location.pathname === "/signin";

  if (isSignupRoute || isSigninRoute) {
    return null;
  }

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="navigation">
      <a className="web-name">HappyTrail</a>
      <ul className="nav-list">
        <li>
          <Link to="/dashboard" className="nav-link">
            <IoHome className="DashboardIcon" />
            <span className="nav-text">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/account" className="nav-link">
            <MdAccountCircle alt="" className="DashboardIcon" />
            <span className="nav-text">Account</span>
          </Link>
        </li>
        <li>
          <Link to="/history" className="nav-link">
            <BiSolidCompass className="DashboardIcon" />
            <span className="nav-text">History</span>
          </Link>
        </li>
        <li>
          <Link to="/setting" className="nav-link">
            <PiGearSixFill className="DashboardIcon" />
            <span className="nav-text">Setting</span>
          </Link>
        </li>
        <li>
          <Link to="/about" className="nav-link">
            <TbInfoCircleFilled className="DashboardIcon" />
            <span className="nav-text">About</span>
          </Link>
        </li>
        <li className="nav-link">
          <CiLogout onClick={logout} className=" DashboardIcon" />
          <span className="nav-text">Logout</span>
        </li>
      </ul>
    </nav>
  );
}
