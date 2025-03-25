import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyResetOtp = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail"); // Get stored email

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-reset-otp", { email, otp });
      setMessage(response.data.message);
      navigate("/reset-password"); // Redirect to reset password page
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#2C4A52]">
      <form className="bg-[#E3E3E3] p-10 rounded-lg shadow-lg w-[500px] min-h-[300px] text-center relative" onSubmit={handleVerifyOtp}>
        
        {/* Logo */}
        <img src="/logo.png" alt="EchoEase Logo" className="absolute top-0 right-0 h-24" />

        {/* Heading */}
        <h2 className="text-3xl font-bold mb-4 text-[#111a1d]">Verify OTP</h2>
        <p className="text-gray-700 mb-3">An OTP has been sent to your email.</p>

        {/* Email Display */}
        <p className="text-black font-semibold mb-3">{email}</p>

        {/* OTP Input */}
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full p-3 border border-gray-400 rounded-md text-gray-700 italic focus:outline-none focus:ring-2 focus:ring-[#2C4A52]"
        />

        {/* Verify OTP Button */}
        <button
          type="submit"
          className="w-full mt-4 bg-[#2C4A52] text-white py-3 rounded-md text-lg font-semibold hover:bg-[#486673] transition"
        >
          Verify OTP
        </button>

        {/* Error/Success Message Display */}
        {message && <p className="text-red-500 mt-3">{message}</p>}
      </form>
    </div>
  );
};
export default VerifyResetOtp;


