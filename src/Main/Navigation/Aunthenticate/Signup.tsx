import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { useState, FormEvent } from "react";
import { auth } from "../../../firebase";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  // Confirm password comparison to Password
  const validatePassword = () => {
    if (password !== passwordConfirmation) {
      // Error Popup
      toast.error("Passwords do not match");
      clearPasswords();
      return false;
    }
    return true;
  };

  const signUp = async (e: FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!validatePassword()) {
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Clear password fields after successful signup
      clearPasswords();
      toast.success("Account created successfully. Please log in.");

      // Automatically log out the user after signup
      await signOut(auth);
    } catch (error) {
      console.error(error);
      toast.error("Sign up failed. Please try again.");
    }
  };

  const clearPasswords = () => {
    setPassword("");
    setPasswordConfirmation("");
  };

  return (
    <>
      <div className="authenticate signup">
        <div className="signLogBtnContainer">
          <Link to="/signup">
            <button className="signLogBtn"> SignUp </button>
          </Link>
          <Link to="/signin">
            <button className="signLogBtn"> SignIn </button>
          </Link>
        </div>
        <h1>Sign Up</h1>
        <form onSubmit={signUp} className="formSignup">
          <input
            className="inputs"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="inputs"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="inputs"
            placeholder="Confirm Password"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
          <button type="submit"> Sign up</button>
        </form>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}
