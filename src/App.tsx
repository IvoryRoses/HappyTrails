import "./Main/Style/main.css";
import "./Main/Style/navbar.css";
import "./Main/Style/setting.css";
import "./Main/Style/authentication.css";
import "./Main/Style/front.css";
import "./Main/Style/account.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Main/Navigation/Root/Root";
import Dashboard from "./Main/Navigation/Routes/Dashboard";
import Account from "./Main/Navigation/Routes/Account";
import History from "./Main/Navigation/Routes/History";
import Setting from "./Main/Navigation/Routes/Setting";
import About from "./Main/Navigation/Routes/About";
import Signup from "./Main/Navigation/Aunthenticate/Signup";
import Signin from "./Main/Navigation/Aunthenticate/Signin";
import Forget from "./Main/Navigation/Aunthenticate/ForgetPassword";
import LandingPage from "./Main/Navigation/Front/LandingPage";

//routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/home",
        Component: LandingPage,
      },
      {
        path: "/signup",
        Component: Signup,
      },
      {
        path: "/signin",
        Component: Signin,
      },
      {
        path: "/forget",
        Component: Forget,
      },
      {
        path: "/dashboard",
        Component: Dashboard,
      },
      {
        path: "/account",
        Component: Account,
      },
      {
        path: "/history",
        Component: History,
      },
      {
        path: "/setting",
        Component: Setting,
      },
      {
        path: "/about",
        Component: About,
      },
    ],
  },
]);

export default function App() {
  return (
    <>
      <h1 className="version"></h1>
      <RouterProvider router={router} />
    </>
  );
}
