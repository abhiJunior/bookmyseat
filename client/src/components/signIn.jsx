import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function SignInPage() {
  const url = "https://bookmyseat-backend.onrender.com"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [statusLogin,setstatuslogin] = useState(null)
  const navigate = useNavigate()
  

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

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      // Proceed with API call or further logic
      try{
        const response = await fetch(`${url}/api/user/login`,{
          method: "POST",
          body: JSON.stringify({
            email,
            password
          }),
          credentials: "include",
          headers:{
            "Content-Type": "application/json"
          }
        })
        const res = await response.json()
        console.log("res",res)
        
        
        setstatuslogin({ status: res.status, message: res.message });
        
        
        
      
      }catch(e){
        alert("Login is Failed",e.message)
      }
    }
  };

  useEffect(() => {
  if (statusLogin) {
    if (statusLogin.status) {
      console.log("✅ Login success:", statusLogin.message);
      navigate("/");
    } else {
      console.log("❌ Login failed:", statusLogin.message);
    }
  }
}, [statusLogin]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900  p-10">
      <div className="bg-gray-800  p-14 rounded-3xl shadow-2xl w-full max-w-2xl">
        <div className="mb-10 flex justify-center">
          {/* Replace with BookMyShow Logo */}
          <span className="text-4xl font-extrabold text-red-600">BookMySeat</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <label htmlFor="email" className="block text-lg text-gray-200 mb-2">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-5 py-4 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-lg"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {errors.email && <div className="text-red-400 text-base mt-2">{errors.email}</div>}
          </div>
          <div>
            <label htmlFor="password" className="block text-lg text-gray-200 mb-2">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-5 py-4 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-lg"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {errors.password && <div className="text-red-400 text-base mt-2">{errors.password}</div>}
          </div>
          <button
            type="submit"
            className="w-full py-4 rounded-lg bg-red-600 text-white text-xl font-bold cursor-pointer hover:bg-red-700"
          >
            Sign In
          </button>
          {statusLogin && (
            <p
              className={`mt-2 text-lg ${
              statusLogin.status ? "text-green-600" : "text-red-600"
              }`}
            >
              {statusLogin.message}
            </p>
)}

        </form>
        <div className="flex justify-between text-sm text-gray-400 mt-10">
          <a href="#" className="hover:underline">Forgot Password?</a>
          <Link to="/signup" className="text-lg hover:underline hover:text-green-400">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
