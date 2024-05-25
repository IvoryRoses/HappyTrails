import { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { updateProfile } from "firebase/auth"; // Import updateProfile function

const Account = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userTrait, setUserTrait] = useState("empty");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUserEmail(currentUser.email ?? null);
      setUserName(currentUser.displayName ?? "None");
    }
  }, []);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const updateUserName = async (newName: string) => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        await updateProfile(currentUser, { displayName: newName });
        setUserName(newName); // Update local state with the new display name
        alert("Username updated successfully!");
      } catch (error) {
        console.error("Error updating username:", error);
        alert("Failed to update username. Please try again.");
      }
    }
  };

  return (
    <div>
      <h1 className="page-content accountMain">Profile</h1>
      <p className="page-content">Username: {userName}</p>
      <p className="page-content">Email: {userEmail}</p>
      <p className="page-content">Trait: {userTrait}</p>
      <button onClick={togglePopup} className="page-content open-popup-btn">
        Open Form
      </button>
      {isPopupOpen && (
        <PopupForm handleClose={togglePopup} updateUserName={updateUserName} />
      )}
    </div>
  );
};

const PopupForm = ({
  handleClose,
  updateUserName,
}: {
  handleClose: () => void;
  updateUserName: (newName: string) => Promise<void>;
}) => {
  const [name, setName] = useState<string>("");

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission

    // Call the function to update the display name in Firebase
    await updateUserName(name);

    // Close the form after submission
    handleClose();
  };

  return (
    <div className="popup-overlay" onClick={handleOutsideClick}>
      <div className="popup-form">
        <button className="close-btn" onClick={handleClose}>
          ×
        </button>
        <h2>Update Username</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={name}
              className="profiler-input"
              onChange={(e) => setName(e.target.value)}
            />
            <button className="profiler-trait">Pangit</button>
            <button className="profiler-trait">Gwapo</button>
            <button className="profiler-trait">Bading</button>
          </label>
          <button className="account-button" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Account;
