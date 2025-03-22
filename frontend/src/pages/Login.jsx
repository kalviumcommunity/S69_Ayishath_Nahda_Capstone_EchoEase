import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // To store error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
        throw new Error(errorData.error);
      }
  
      const data = await response.json();
      console.log("Login successful:", data);
  
      // Store the JWT token (e.g., in localStorage)
      localStorage.setItem("token", data.token);
      localStorage.setItem("therapist", JSON.stringify(data.therapist));
  
      // Redirect to a dashboard or home page
      setErrorMessage(""); // Clear any previous errors
      setTimeout(() => {
        window.location.href = "/dashboard"; 
      }, 1000);
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#2D5B64]">
      <div className="bg-[#f9f9f4] p-10 rounded-2xl shadow-lg w-[420px] text-center">
        {/* Logo */}
        <div className="flex flex-col items-center mb-4">
          <img src="/logo.png" alt="EchoEase Logo" className="w-60 h-60 object-contain" />
        </div>

        {/* Error Message Display */}
        {errorMessage && (
          <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="text-left">
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5B64]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="text-left">
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5B64]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-gray-600 italic hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#2D5B64] text-white font-semibold py-3 rounded-md hover:bg-[#20454E] transition-all"
          >
            Login
          </button>
          
          {/* Signup Redirect */}
          <p className="text-sm text-gray-700 mt-4">
            Not a registered user?{" "}
            <Link to="/signup" className="text-[#2D5B64] font-semibold hover:underline">
              Sign up!
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
