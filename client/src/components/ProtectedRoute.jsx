import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { setUser } from "../redux/usersSlice";
function ProtectedRoute({ children }) {
  const url = "http://localhost:5000"
  const {user} = useSelector((state)=>state.users)
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${url}/api/user/profile`, {
        method: "GET", // ✅ fix casing
        credentials: "include", // ✅ ensures cookies are sent
      });

      if (response.ok) {
        const data = await response.json()
        dispatch(setUser(data))
        console.log("✅ Authenticated user");
        setAuthenticated(true);
      } else {
        console.log("❌ Not authenticated:", response.status);
        setAuthenticated(false);
        dispatch(setUser(null))
      }
    } catch (e) {
      console.log("⚠️ Auth check failed", e);
      setAuthenticated(false);
      dispatch(setUser(null))
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return authenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
