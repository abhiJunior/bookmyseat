import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const url = "https://bookmyseat-backend.onrender.com"
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  const getProfile = async () => {
    const response = await fetch(`${url}/api/user/profile`, {
      method: "GET",
      credentials: "include", // send cookies
    });
    if (!response.ok) {
      console.error("Failed to fetch profile:", response.statusText);
      return;
    }
    const res = await response.json();
    console.log(res);
    setUser(res);
  };
  

  const handleLogout = async () => {
    try {
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
    <div className="flex justify-center items-start bg-gray-100 py-10 px-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 to-pink-600 p-6 flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-gray-500 text-sm font-medium shadow-md relative overflow-hidden">
            <img
              src="https://thvnext.bing.com/th/id/OIP.tdX1Yq831S2rKZFFs3Dx4QHaHa?w=165&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-white text-xl font-semibold">
            Hi, {user?.fullName || "Guest"}
          </h2>
        </div>

        {/* Account Details */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Account Details
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-gray-800 font-medium">
                {user?.fullName || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="text-gray-800 font-medium">
                {user?.email || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-gray-800 font-medium">
                {user?.role || "Not provided"}
              </p>
            </div>

            <div>
               
              <button
                onClick={() => navigate("/booking")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition cursor-pointer"
              >
                Tickets
              </button>
              
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-6 border-t flex justify-between">
          {/* Conditionally render Admin button */}
          {user?.role === "ADMIN" && (
            <button
              onClick={() => navigate("/admin")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition cursor-pointer"
            >
              Go to Admin Dashboard
            </button>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
