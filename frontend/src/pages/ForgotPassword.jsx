import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
  
    const handleSendOtp = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
        setMessage(response.data.message);
        localStorage.setItem("resetEmail", email); // Store email for next step
        navigate("/verify-reset-otp"); // Redirect to OTP verification page
      } catch (error) {
        setMessage(error.response?.data?.message || "Error sending OTP");
  }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#2C4A52]">
      <form className="bg-[#E3E3E3] p-10 rounded-lg shadow-lg w-[500px] min-h-[300px] text-center relative" onSubmit={handleSendOtp}>
        
        {/* Logo */}
        <img src="/logo.png" alt="EchoEase Logo" className="absolute top-0 right-0 h-24" />

        {/* Heading */}
        <h2 className="text-3xl font-bold mb-4 text-[#111a1d]">Forgot Password?</h2>
        <p className="text-gray-700 mb-3">Enter your email and we’ll send you an OTP.</p>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border border-gray-400 rounded-md text-gray-700 italic focus:outline-none focus:ring-2 focus:ring-[#2C4A52]"
        />

        {/* Send OTP Button */}
        <button
          type="submit"
          className="w-full mt-4 bg-[#2C4A52] text-white py-3 rounded-md text-lg font-semibold hover:bg-[#486673] transition"
        >
          Send OTP
        </button>

        {/* Error/Success Message Display */}
        {message && <p className="text-red-500 mt-3">{message}</p>}
      </form>
    </div>
  );
};


export default ForgotPassword;
