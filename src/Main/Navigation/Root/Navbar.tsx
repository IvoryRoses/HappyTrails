import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import { IoHome } from "react-icons/io5";
import { TbInfoCircleFilled } from "react-icons/tb";
import { CiLogout } from "react-icons/ci";
import PadayoWhite from "../Assets/Padayo_Brown.png";

export default function NavigationBar() {
  const location = useLocation();

  const isSignupRoute = location.pathname === "/signup";
  const isSigninRoute = location.pathname === "/signin";
  const isForgetRoute = location.pathname === "/forget";
  const isHomeRoute = location.pathname === "/home";

  if (isSignupRoute || isSigninRoute || isForgetRoute || isHomeRoute) {
    return null;
  }

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <>
      <nav className="notif"></nav>
      <nav className="navigation">
        <img src={PadayoWhite} className="nav-logo" />
        <ul className="nav-list">
          <li>
            <Link to="/dashboard" className="nav-link">
              <IoHome className="dashboard-icon" />
              <span className="nav-text">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/about" className="nav-link">
              <TbInfoCircleFilled className="dashboard-icon" />
              <span className="nav-text">About</span>
            </Link>
          </li>
          <li>
            <Link to="/signin" className="nav-link" onClick={logout}>
              <CiLogout onClick={logout} className=" dashboard-icon" />
              <span className="nav-text">Logout</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
