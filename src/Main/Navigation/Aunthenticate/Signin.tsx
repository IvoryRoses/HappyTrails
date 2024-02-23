import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // If login is successful, navigate to the dashboard
      navigate("/dashboard");
    } catch (error) {
      // Handle login errors
      console.error(error);
      clearPasswords();
      toast.error("Login failed. Please check your email and password.");
    }
  };

  // Check if the user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is already logged in, navigate to the dashboard
        navigate("/dashboard");
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, [navigate]);

  const clearPasswords = () => {
    setPassword("");
  };

  return (
    <>
      <div className="authenticate login">
        <div className="signLogBtnContainer">
          <Link to="/signup">
            <button className="signLogBtn"> SignUp </button>
          </Link>
          <Link to="/signin">
            <button className="signLogBtn"> SignIn </button>
          </Link>
        </div>
        <h1> Login</h1>
        <input
          className="inputs"
          placeholder="yoMama@test.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="inputs"
          placeholder="******"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Link to="/signup" className="textForget">
          <h1>Forget password?</h1>
        </Link>
        <button onClick={login}> Log In</button>
        <Link to="/signup" className="textCreate">
          <h1>Create a new account</h1>
        </Link>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}
