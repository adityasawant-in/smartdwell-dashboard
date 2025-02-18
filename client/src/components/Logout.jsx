import React from 'react';
import { toast } from 'react-toastify';  // Importing toast for notifications
import 'react-toastify/dist/ReactToastify.css';  // Importing the toast styles

const Logout = () => {
  const handleLogout = () => {
    // Show the info toast message that logging out is in progress
    toast.info("Logging out...", {
      position: "top-right",
      autoClose: 2000,  // Toast will disappear after 2 seconds
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });

    // Wait for 2 seconds before attempting to log out
    setTimeout(() => {
      try {
        // Attempt to clear localStorage and sessionStorage
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        localStorage.removeItem("userInfo");
        sessionStorage.removeItem("userInfo");
        localStorage.removeItem("selectedView"); // Clear selected view on logout
        
        // Show success toast message
        toast.success("Logged out successfully!", {
          position: "top-right",
          autoClose: 2000,  // Toast will disappear after 2 seconds
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
        });

        // Redirect user to login page
        window.location.href = "/login";
      } catch (error) {
        // In case of an error during logout, show error toast message in red
        toast.error("Error logging out user", {
          position: "top-right",
          autoClose: 2000,  // Toast will disappear after 2 seconds
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    }, 2000);  // Wait for 2 seconds before redirecting or showing error
  };

  return (
    <button
      onClick={handleLogout}
      className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
    >
      Logout
    </button>
  );
};

export default Logout;
