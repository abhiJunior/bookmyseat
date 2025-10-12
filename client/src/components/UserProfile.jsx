import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const url = "https://bookmyseat-backend.onrender.com";
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  const getProfile = async () => {
    const token = localStorage.getItem("authToken")
    const response = await fetch(`${url}/api/user/profile`, {
      method: "GET",
      headers:{
        Authorization : `Bearer ${token}`,
        "Conten-Type": "application/json"
      }
    });
    console.log(response)
    if (!response.ok) {
      console.error("Failed to fetch profile:", response.statusText);
      return;
    }
    const res = await response.json();
    setUser(res);
  };

  const handleLogout = async () => {
    try {

      localStorage.removeItem("authToken")
      const response = await fetch(`${url}/api/user/logout`, {
        method: "POST",
        credentials: "include",
      });

      setUser({}); // clear state immediately

      if (response.ok) {
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="flex justify-center items-start bg-gray-100 py-6 px-2 sm:py-10 sm:px-4">
      <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 to-pink-600 p-6 flex items-center space-x-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center text-gray-500 text-xs sm:text-sm font-medium shadow-md relative overflow-hidden">
            <img
              src="https://thvnext.bing.com/th/id/OIP.tdX1Yq831S2rKZFFs3Dx4QHaHa?w=165&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-white text-lg sm:text-xl font-semibold">
            Hi, {user?.fullName || "Guest"}
          </h2>
        </div>

        {/* Account Details */}
        <div className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            Account Details
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Name</p>
              <p className="text-gray-800 font-medium">
                {user?.fullName || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Email Address</p>
              <p className="text-gray-800 font-medium">
                {user?.email || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Role</p>
              <p className="text-gray-800 font-medium">
                {user?.role || "Not provided"}
              </p>
            </div>
            <div>
              <button
                onClick={() => navigate("/booking")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition cursor-pointer w-full sm:w-auto"
              >
                Tickets
              </button>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-4 sm:p-6 border-t flex flex-col sm:flex-row gap-2 sm:justify-between">
          {user?.role === "ADMIN" && (
            <button
              onClick={() => navigate("/admin")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition cursor-pointer w-full sm:w-auto"
            >
              Go to Admin Dashboard
            </button>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer w-full sm:w-auto"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
