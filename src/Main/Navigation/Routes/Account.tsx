import { useEffect, useState } from "react";
import { auth, fs } from "../../../firebase";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Account = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>("");
  const [userContactNumber, setUserContactNumber] = useState<string | null>(
    null
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        // Display details from auth
        setUserEmail(currentUser.email ?? null);
        setUserName(currentUser.displayName ?? "none");

        // Fetch user address and contact number from Firestore
        const userDocRef = doc(fs, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserAddress(userData.address);
          setUserContactNumber(userData.contactNumber);
        } else {
          setUserAddress("");
          setUserContactNumber(null);
        }
      }
    };
    fetchUserData();
  }, []);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const updateUserProfile = async (
    newName: string,
    newAddress: string,
    newContactNumber: string
  ) => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        // Update display name in Auth
        await updateProfile(currentUser, { displayName: newName });
        setUserName(newName);

        // Update address and contact number in Firestore
        const userDocRef = doc(fs, "users", currentUser.uid);
        await setDoc(
          userDocRef,
          { address: newAddress, contactNumber: newContactNumber },
          { merge: true }
        );
        setUserAddress(newAddress);
        setUserContactNumber(newContactNumber);
        alert("Profile updated successfully");
      } catch (error) {
        alert("Failed to update profile. Please try again.");
      }
    }
  };

  return (
    <div className="account-page">
      <div className="account-app">
        <div className="account-user">
          <p className="p-t account-profile-header">Name</p>
          <p className="p-t account-profile-text">{userName}</p>
          <p className="p-t account-profile-header">Email</p>
          <p className="p-t account-profile-text">{userEmail}</p>
          <p className="p-t account-profile-header">Address</p>
          <p className="p-t account-profile-text">{userAddress}</p>
          <p className="p-t account-profile-header">Contact Number</p>
          <p className="p-t account-profile-text">{userContactNumber}</p>
          <button onClick={togglePopup} className="p-t open-popup-btn">
            Open Form
          </button>
          {isPopupOpen && (
            <PopupForm
              handleClose={togglePopup}
              updateUserProfile={updateUserProfile}
              existingName={userName}
              existingAddress={userAddress}
              existingContactNumber={userContactNumber}
            />
          )}
        </div>
        <div className="account-profiler">
          <p className="p-t account-profile-header">User Preferences</p>
          <label>
            <input type="checkbox" /> Food and Cuisine
          </label>
          <label>
            <input type="checkbox" /> Historical and Cultural Heritage Sites
          </label>
          <label>
            <input type="checkbox" /> Nature and Sightseeing
          </label>
          <label>
            <input type="checkbox" /> Entertainment
          </label>
          <p className="p-t account-profile-header">Budget Estimate</p>
          <label>
            <input type="checkbox" /> Low
          </label>
          <label>
            <input type="checkbox" /> Medium
          </label>
          <label>
            <input type="checkbox" checked /> High
          </label>
          <p className="p-t account-profile-header">Mode of Transport</p>
          <label>
            <input type="checkbox" /> Public
          </label>
          <label>
            <input type="checkbox" /> Private
          </label>
          <button className="p-t open-popup-btn">Update</button>
        </div>
      </div>
    </div>
  );
};

// PopupForm component
const PopupForm = ({
  handleClose,
  updateUserProfile,
  existingName,
  existingAddress,
  existingContactNumber,
}: {
  handleClose: () => void;
  updateUserProfile: (
    newName: string,
    newAddress: string,
    newContactNumber: string
  ) => Promise<void>;
  existingName: string | null;
  existingAddress: string | null;
  existingContactNumber: string | null;
}) => {
  const [name, setName] = useState<string>(existingName || "");
  const [address, setAddress] = useState<string>(existingAddress || "");
  const [contactNumber, setContactNumber] = useState<string>(
    existingContactNumber || ""
  );

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission

    // Validate contact number
    if (contactNumber && !/^0\d{10}$/.test(contactNumber)) {
      alert(
        "Please enter a valid contact number starting with 0 and 10 digits long."
      );
      return;
    }

    // Use existing values if input fields are empty
    const finalName = name.trim() || existingName || "";
    const finalAddress = address.trim() || existingAddress || "";
    const finalContactNumber =
      contactNumber.trim() || existingContactNumber || "";

    // Call the function to update the display name, address, and contact number in Firebase
    await updateUserProfile(finalName, finalAddress, finalContactNumber);

    // Close the form after submission
    handleClose();
  };

  return (
    <div className="popup-overlay" onClick={handleOutsideClick}>
      <div className="popup-form">
        <button className="close-btn" onClick={handleClose}>
          ×
        </button>
        <div className="account-spacing">
          <form onSubmit={handleSubmit} className="form">
            <h1 className="text-header-profile-form">Update Profile</h1>
            <h1 className="text-account">Name</h1>
            <input
              type="text"
              name="name"
              value={name}
              className="profiler-input"
              onChange={(e) => setName(e.target.value)}
            />
            <h1 className="text-account">Address</h1>
            <input
              type="text"
              name="address"
              value={address}
              className="profiler-input"
              onChange={(e) => setAddress(e.target.value)}
            />
            <h1 className="text-account">Contact Number</h1>
            <input
              type="text"
              name="contactNumber"
              maxLength={11}
              value={contactNumber}
              className="profiler-input"
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  // Allow only digits
                  setContactNumber(value);
                }
              }}
            />
            <button className="account-button" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;
