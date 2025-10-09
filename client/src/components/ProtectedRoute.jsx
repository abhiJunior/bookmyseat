import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/usersSlice";

function ProtectedRoute({ children }) {
  const url = "https://bookmyseat-backend.onrender.com";
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.warn("❌ No token found — user not logged in");
        setAuthenticated(false);
        dispatch(setUser(null));
        setLoading(false);
        return;
      }

      const response = await fetch(`${url}/api/user/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ use Bearer token from localStorage
        },
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data));
        console.log("✅ Authenticated user:", data);
        setAuthenticated(true);
      } else {
        console.warn("❌ Token invalid or expired:", response.status);
        localStorage.removeItem("authToken");
        dispatch(setUser(null));
        setAuthenticated(false);
      }
    } catch (error) {
      console.error("⚠️ Auth check failed:", error);
      localStorage.removeItem("authToken");
      dispatch(setUser(null));
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-200 text-lg">
        Checking authentication...
      </div>
    );
  }

  return authenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
