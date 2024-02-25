import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useState, FormEvent, ChangeEvent } from "react";
import { auth } from "../../../firebase";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isFilled, setIsFilled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to sign up the user
  const signUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check if passwords match
    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match");
      setIsSubmitting(false);
      clearPasswords();
      return;
    }

    try {
      // Create the user without signing them in
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Clear form fields
      clearPasswords();

      // Notify user to verify email
      toast.success(
        "Sign up successful. Please verify your email before logging in."
      );
    } catch (error) {
      console.error(error);
      toast.error("Sign up failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to clear form fields
  const clearPasswords = () => {
    setPassword("");
    setPasswordConfirmation("");
  };

  // Function to handle email input change
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsFilled(
      e.target.value.trim() !== "" &&
        password.trim() !== "" &&
        passwordConfirmation.trim() !== ""
    );
  };

  // Function to handle password input change
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setIsFilled(
      email.trim() !== "" &&
        e.target.value.trim() !== "" &&
        passwordConfirmation.trim() !== ""
    );
  };

  // Function to handle password confirmation input change
  const handlePasswordConfirmationChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordConfirmation(e.target.value);
    setIsFilled(
      email.trim() !== "" &&
        password.trim() !== "" &&
        e.target.value.trim() !== ""
    );
  };

  return (
    <>
      <div className="authenticate">
        <div className="first-spacing">
          <h1 className="text-header">Sign Up</h1>
          <h1 className="text-email-pass">Email</h1>
          <form onSubmit={signUp} className="form">
            <input
              className="inputs"
              placeholder="HiMaamJoan@gmail.com"
              value={email}
              onChange={handleEmailChange}
            />
            <h1 className="text-email-pass">Password</h1>
            <input
              className="inputs"
              placeholder="******"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
            <h1 className="text-email-pass">Confirm Password</h1>
            <input
              className="inputs"
              placeholder="******"
              type="password"
              value={passwordConfirmation}
              onChange={handlePasswordConfirmationChange}
            />
            <div className="btn-signup">
              <button
                type="submit"
                className={`btn-login ${isFilled ? "filled" : ""}`}
                disabled={!isFilled || isSubmitting}
              >
                Sign up
              </button>
            </div>
          </form>
          <div className="already-padding">
            <Link to="/signin" className="text-account">
              <h1>Already have an account? Log in</h1>
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}
