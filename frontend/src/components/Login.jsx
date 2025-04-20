import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    // Log only the email, exclude the password
    console.log("Login attempt:", { email: trimmedEmail });

    try {
      const response = await fetch("${import.meta.env.VITE_META_URI}/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
        throw new Error(errorData.error);
      }

      const data = await response.json();
      console.log("Login successful:", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("therapist", JSON.stringify(data.therapist));

      setSuccessMessage("Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#2D5B64]">
      <div className="bg-[#f9f9f4] p-10 rounded-2xl shadow-lg w-[420px] text-center">
        <div className="flex flex-col items-center mb-4">
          <img src="/logo.png" alt="EchoEase Logo" className="w-60 h-60 object-contain" />
        </div>

        {successMessage && (
          <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-gray-600 italic hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2D5B64] text-white font-semibold py-3 rounded-md hover:bg-[#20454E] transition-all"
          >
            Login
          </button>

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