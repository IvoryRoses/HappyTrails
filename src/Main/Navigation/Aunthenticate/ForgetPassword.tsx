import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import SigninBG from "../Assets/Signup_BG.png";

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [isFilled, setIsFilled] = useState(false);

  useEffect(() => {
    // Set the background image
    document.body.style.backgroundImage = `url(${SigninBG})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center center";
    document.body.style.backgroundAttachment = "fixed"; // Optional for fixed background

    // Cleanup function to remove the background image when the component unmounts
    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundAttachment = ""; // Cleanup optional style
    };
  }, []);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsFilled(e.target.value.trim() !== "");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const emailVal = formData.get("email") as string;

    if (!isFilled) {
      toast.error("Please enter your email.");
      return;
    }

    sendPasswordResetEmail(auth, emailVal)
      .then(() => {
        toast.success("Password reset email sent. Please check your inbox.");
        navigate("/signin");
      })
      .catch(() => {
        toast.error("Error sending password reset email. Please try again.");
      });
  };

  return (
    <>
      <div className="authenticate">
        <div className="first-spacing">
          <h1 className="text-header">Forget Password</h1>
          <form onSubmit={(e) => handleSubmit(e)} className="form">
            <input
              name="email"
              className="inputs"
              placeholder="Enter your Email"
              onChange={handleEmailChange}
            />
            <button
              className={`btn-login ${isFilled ? "filled" : ""}`}
              type="submit"
              disabled={!isFilled}
            >
              Reset
            </button>
          </form>

          <div className="back-padding">
            <Link to="/signin" className="text-back">
              <h1>Go back to Log in</h1>
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}
