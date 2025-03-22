import { useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    designation: "Speech Therapist",
    hospital: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // To store error messages
  const [successMessage, setSuccessMessage] = useState(""); // To store success messages

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Signup attempt:", formData);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName, 
          email: formData.email,
          designation: formData.designation,
          hospital: formData.hospital,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
        throw new Error(errorData.error);
      }

      const data = await response.json();
      console.log("Signup successful:", data);
      setSuccessMessage("Signup successful! Redirecting to login...");
      setErrorMessage(""); // Clear any previous errors

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error during signup:", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#2D5B64]">
      <div className="bg-[#f2f1ec] p-10 rounded-2xl shadow-lg w-[500px] text-center">
        {/* Logo */}
        <div className="flex flex-col items-center mb-4">
          <img src="/logo.png" alt="EchoEase Logo" className="w-32 object-contain" />
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-4 gap-y-5 text-left">
          {/* Full Name */}
          <label className="text-gray-700 font-semibold flex items-center">Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter name.."
            className="p-3 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5B64]"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          {/* Email */}
          <label className="text-gray-700 font-semibold flex items-center">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email.."
            className="p-3 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5B64]"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Designation */}
          <label className="text-gray-700 font-semibold flex items-center">Designation</label>
          <select
            name="designation"
            className="p-3 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5B64]"
            value={formData.designation}
            onChange={handleChange}
            required
          >
            <option value="Audiologist">Audiologist</option>
            <option value="Speech Therapist">Speech Therapist</option>
          </select>

          {/* Hospital */}
          <label className="text-gray-700 font-semibold flex items-center">Hospital</label>
          <input
            type="text"
            name="hospital"
            placeholder="Enter hospital name.."
            className="p-3 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5B64]"
            value={formData.hospital}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <label className="text-gray-700 font-semibold flex items-center">Create Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password.."
            className="p-3 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5B64]"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Signup Button */}
          <div className="col-span-2 flex flex-col items-center">
            <button
              type="submit"
              className="w-1/2 bg-[#2D5B64] text-white font-semibold py-3 rounded-md hover:bg-[#20454E] transition-all"
            >
              Sign-Up
            </button>

            {/* Already a user? Login */}
            <p className="text-sm mt-4">
              Already a user?{" "}
              <Link to="/login" className="text-[#2D5B64] font-semibold hover:underline">
                Login!
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;