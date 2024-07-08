import React from "react";
import { logout } from "@/utils/authUtils";

const LogoutButton = () => {
  const handleLogout = async () => {
    await logout();
    // Perform any additional logout tasks 
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
