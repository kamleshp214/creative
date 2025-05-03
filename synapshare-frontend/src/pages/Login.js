import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  signInWithRedirect,
  getRedirectResult,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { motion } from "framer-motion"; // For animations

function Login() {
  const [error, setError] = useState("");
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          await handlePostLogin(result.user);
        }
      } catch (err) {
        console.error("Google Redirect Error:", err);
        setError(`Google redirect failed: ${err.message}`);
      }
    };
    handleRedirectResult();
  }, [handlePostLogin]);

  const handlePostLogin = async (user) => {
    try {
      const token = await user.getIdToken(true);
      const response = await axios.get(
        `http://localhost:5000/api/user/${user.uid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.isAdmin || response.data.username) {
        navigate("/");
      } else {
        setShowUsernameModal(true);
      }
    } catch (err) {
      console.error("Error checking user:", err);
      setError("Failed to verify user. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handlePostLogin(result.user);
    } catch (err) {
      console.error("Google Popup Error:", err);
      let errorMessage = "Failed to log in with Google.";
      if (err.code === "auth/popup-blocked") {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectErr) {
          errorMessage = `Redirect fallback failed: ${redirectErr.message}`;
        }
      } else if (err.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (err.code === "auth/cancelled-popup-request") {
        errorMessage = "Popup request cancelled. Please try again.";
      } else {
        errorMessage = `Google login failed: ${err.message}`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setUsernameError("");
    try {
      const checkResponse = await axios.post(
        "http://localhost:5000/api/check-username",
        { username }
      );
      if (checkResponse.data.exists) {
        setUsernameError("Username is already taken. Please choose another.");
        return;
      }
      const user = auth.currentUser;
      if (!user) {
        setUsernameError("User not authenticated. Please log in again.");
        return;
      }
      const token = await user.getIdToken(true);
      const saveResponse = await axios.post(
        "http://localhost:5000/api/save-username",
        { username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (saveResponse.data.success) {
        setShowUsernameModal(false);
        navigate("/");
      } else {
        setUsernameError(saveResponse.data.error || "Failed to save username.");
      }
    } catch (err) {
      console.error(
        "Username submission error:",
        err.response ? err.response.data : err.message
      );
      setUsernameError("Failed to save username. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col relative">
      {/* Background Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950 dark:to-transparent opacity-50 -z-10"></div>

      {/* Header Section */}
      <section className="py-12 text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
          Welcome to SynapShare
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Sign in to join the community and share your knowledge!
        </p>
      </section>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 dark:text-red-400 mb-8 text-center bg-red-100/50 dark:bg-red-900/50 p-4 rounded-lg max-w-2xl mx-auto relative z-10">
          {error}
        </p>
      )}

      {/* Login Section */}
      <section className="flex justify-center mb-auto relative z-10">
        <div className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 max-w-md w-full hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300 shadow-lg hover:shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-200 to-transparent dark:from-blue-900 dark:to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`relative flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white font-semibold text-lg py-4 px-8 rounded-full hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl w-full overflow-hidden ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {/* Subtle shimmer effect on hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-shimmer"></span>
            <FcGoogle className="text-2xl" />
            {loading ? "Logging in..." : "Sign in with Google"}
          </motion.button>

          <p className="text-center text-gray-600 dark:text-gray-300 mt-4 text-sm">
            Yeah, I was too lazy to add the manual sign-in thing, so I went with
            Firebase auth—quick and easy! 🚀
          </p>
        </div>
      </section>

      {/* Username Modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-sm w-full">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Choose a Unique Username
            </h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              required
            />
            {usernameError && (
              <p className="text-red-500 dark:text-red-400 mb-4">
                {usernameError}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleUsernameSubmit}
                className="bg-blue-600 dark:bg-blue-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 shadow-md flex-1"
              >
                Submit
              </button>
              <button
                onClick={() => setShowUsernameModal(false)}
                className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold py-2 px-4 rounded-full hover:bg-gray-400 dark:hover:bg-gray-500 transition-all duration-300 shadow-md flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
