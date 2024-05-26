import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";
import NavigationBar from "./Navbar";

//DO NOT TOUCH THIS FOR THE LOVE OF GOD, UNLES YOUR SEBASTIAN ABUYO

const Root = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/home");
      }
      if (location.pathname === "/" && user) {
        navigate("/dashboard");
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, [navigate]);

  return (
    <>
      <NavigationBar />
      <Outlet />
    </>
  );
};

export default Root;

//DO NOT TOUCH THIS FOR THE LOVE OF GOD, UNLES YOUR SEBASTIAN ABUYO
