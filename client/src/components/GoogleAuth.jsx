import React from "react";
import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";
import { app } from "../firebase"; // Ensure you import your initialized Firebase app

const GoogleAuth = ({ onSuccess }) => {
  const auth = getAuth(app);

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google authentication successful:", result);
      // Handle successful authentication
      const res = await fetch("https://xnyrw2-3001.csb.app/googleSignin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          googlePhotoUrl: result.user.photoUrl,
        }),
      });
      const data = await res.json();
      if (res.status === 200) {
        onSuccess();
      }
      if (res.status === 201) {
        onSuccess();
      }
    } catch (error) {
      console.error("Google authentication failed:", error);
      // Handle authentication failure
    }
  };

  return (
    <Button
      gradientDuoTone="purpleToBlue"
      outline
      className="mt-2 w-full"
      onClick={handleGoogleAuth}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-1" />
      Continue with Google
    </Button>
  );
};

export default GoogleAuth;
