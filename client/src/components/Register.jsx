import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const url = "https://bookmyseat-backend.onrender.com";
  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [statusLogin, setstatuslogin] = useState(null);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!fullName) {
      errs.fullName = "Name is required";
    } else if (fullName.length < 4) {
      errs.fullName = "Name should be greater than 4 characters";
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      try {
        const response = await fetch(`${url}/api/user/register`, {
          method: "POST",
          body: JSON.stringify({ fullName, email, password }),
          headers: { "Content-Type": "application/json" },
        });
        const res = await response.json();
        setstatuslogin({ status: res.status, message: res.message });
      } catch (e) {
        alert("Signup Failed", e.message);
      }
    }
  };

  useEffect(() => {
    if (statusLogin) {
      if (statusLogin.status) {
        navigate("/login");
      }
    }
  }, [statusLogin, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 sm:p-6">
      <div className="bg-gray-800 p-6 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg">
        <div className="mb-6 sm:mb-10 flex justify-center">
          <span className="text-3xl sm:text-4xl font-extrabold text-red-600">Sign Up</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div>
            <label htmlFor="fullName" className="block text-sm sm:text-lg text-gray-200 mb-2">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              className="w-full px-3 sm:px-5 py-3 sm:py-4 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-base sm:text-lg"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setfullName(e.target.value)}
            />
            {errors.fullName && <div className="text-red-400 text-sm mt-2">{errors.fullName}</div>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm sm:text-lg text-gray-200 mb-2">
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
            {errors.email && <div className="text-red-400 text-sm mt-2">{errors.email}</div>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm sm:text-lg text-gray-200 mb-2">
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
            {errors.password && <div className="text-red-400 text-sm mt-2">{errors.password}</div>}
          </div>

          <button
            type="submit"
            className="w-full py-3 sm:py-4 rounded-lg bg-red-600 text-white text-lg sm:text-xl font-bold hover:bg-red-700 transition"
          >
            Sign Up
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

        <div className="flex justify-between text-xs sm:text-sm text-gray-400 mt-6">
          <a href="#" className="hover:underline">
            Forgot Password?
          </a>
          <Link to="/login" className="hover:underline hover:text-green-400">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
