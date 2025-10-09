import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import SpinComponent from "./SpinComponent";

export default function SignInPage() {
  const url = "https://bookmyseat-backend.onrender.com";
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [statusLogin, setStatusLogin] = useState(null);
  const navigate = useNavigate();

  // ✅ Basic validation
  const validate = () => {
    const errs = {};
    if (!email) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Invalid email format";
    }
    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }
    return errs;
  };

  // ✅ Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch(`${url}/api/user/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const res = await response.json();
      setStatusLogin({ status: res.status, message: res.message });

      if (res.status && res.token) {
        // ✅ Save token in localStorage
        console.log("token",res.token)
        localStorage.setItem("authToken", res.token);
        // Optional: store user info
        navigate("/");
      } else {
        console.log(res)
        console.warn("Login failed:", res.message);
      }
    } catch (err) {
      alert("Login failed. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) navigate("/");
  }, [navigate]);

  if (loading) return <SpinComponent />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 sm:p-6">
      <div className="bg-gray-800 p-6 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg">
        <div className="mb-6 sm:mb-10 flex justify-center">
          <span className="text-3xl sm:text-4xl font-extrabold text-red-600">
            BookMySeat
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm sm:text-lg text-gray-200 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 sm:px-5 py-3 sm:py-4 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-base sm:text-lg"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-400 text-sm sm:text-base mt-2">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm sm:text-lg text-gray-200 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 sm:px-5 py-3 sm:py-4 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-base sm:text-lg"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-400 text-sm sm:text-base mt-2">
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 sm:py-4 rounded-lg bg-red-600 text-white text-lg sm:text-xl font-bold cursor-pointer hover:bg-red-700 transition"
          >
            Sign In
          </button>

          {statusLogin && (
            <p
              className={`mt-2 text-sm sm:text-lg ${
                statusLogin.status ? "text-green-600" : "text-red-600"
              }`}
            >
              {statusLogin.message}
            </p>
          )}
        </form>

        {/* Footer Links */}
        <div className="flex justify-between text-xs sm:text-sm text-gray-400 mt-6">
          <a href="#" className="hover:underline">
            Forgot Password?
          </a>
          <span>
            New user?
            <Link
              to="/signup"
              className="hover:underline hover:text-green-400 p-2 text-white font-medium"
            >
              Sign Up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
