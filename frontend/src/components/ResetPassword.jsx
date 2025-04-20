import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Added navigate for redirection
import axios from "axios";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const email = localStorage.getItem("resetEmail"); // Get stored email
  
    const handleResetPassword = async (e) => {
      e.preventDefault();
  
      if (newPassword !== confirmPassword) {
        setMessage("Passwords do not match");
        return;
      }
  
      try {
        const response = await axios.post("${import.meta.env.VITE_META_URI}/api/auth/reset-password", { email, newPassword });
        setMessage(response.data.message);
      //   setSuccess(true); 
        localStorage.removeItem("resetEmail"); // Clear stored email/
      //   navigate("/");
        setTimeout(() => {
          navigate("/login"); // Redirect to login page
        }, 3000);
      } catch (error) {
        setMessage(error.response?.data?.message || "Error resetting password");
      }
    };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#2C4A52]">``
      <form className="bg-[#E3E3E3] p-12 rounded-lg shadow-lg w-[600px] text-center relative" onSubmit={handleResetPassword}>
        {/* Logo in Top Right */}
        <img src="/logo.png" alt="EchoEase Logo" className="absolute top-0 right-0 h-24" />

        {/* Heading */}
        <h2 className="text-3xl font-bold text-[#111a1d] mb-4">Reset Password</h2>
        <p className="text-gray-700 mb-6">Enter a new password for your account</p>

        {/* Password Inputs */}
        <div className="text-left">
          <label className="block text-lg font-semibold text-[#111a1d] mb-1">New Password</label>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-400 rounded-md text-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-[#2C4A52]"
          />

          <label className="block text-lg font-semibold text-[#111a1d] mb-1">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-400 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2C4A52]"
          />
        </div>

        {/* Set Password Button */}
        <button
          type="submit"
          className="w-full mt-6 bg-[#2D5B64] text-white py-3 rounded-md text-lg font-semibold hover:bg-[#526F80] transition"
        >
          Set Password
        </button>

        {/* Message Display */}
        {message && <p className="text-green-500 mt-3">{message}</p>}
      </form>
    </div>
  );
};


export default ResetPassword;
