import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFilled, setIsFilled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if both email and password are filled
    setIsFilled(email.trim() !== "" && password.trim() !== "");
  }, [email, password]);

  const login = async () => {
    setIsSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        // If the email is not verified, display an error message and prevent login
        toast.error("Please verify your email before logging in.");
        setIsSubmitting(false);
        return;
      }

      // If login is successful and email is verified, navigate to the dashboard
      navigate("/dashboard");
    } catch (error) {
      // Handle login errors
      console.error(error);
      clearPasswords();
      toast.error("Login failed. Please check your email and password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if the user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
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
      <div className="authenticate">
        <div className="first-spacing">
          <h1 className="text-header">Login</h1>
          <h1 className="text-email-pass">Email</h1>
          <input
            name="email"
            className="inputs"
            placeholder="harrystyles@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <h1 className="text-email-pass">Password</h1>
          <input
            className="inputs"
            placeholder="******"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="forgot-padding">
            <Link to="/forget" className="text-forget">
              <h1>Forgot password?</h1>
            </Link>
          </div>
        </div>
        <div className="first-spacing">
          <button
            onClick={login}
            className={`btn-login ${isFilled ? "filled" : ""}`}
            disabled={!isFilled || isSubmitting}
          >
            Log In
          </button>
          <div className="create-padding">
            <Link to="/signup" className="text-create">
              <h1>Create a new account</h1>
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}
