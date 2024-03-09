import { useEffect, useState } from "react";
import { auth } from "../../../firebase";

export default function Account() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUserEmail(currentUser.email ?? null);
    }
  }, []);

  return (
    <div>
      <h1 className="page-content accountMain"> Profile </h1>;
      <p className="page-content">Email: {userEmail}</p>
    </div>
  );
}
