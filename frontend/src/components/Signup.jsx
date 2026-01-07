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
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const trimmedFormData = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      designation: formData.designation,
      hospital: formData.hospital.trim(),
      password: formData.password.trim(),
    };
    console.log("Signup attempt:", {
      fullName: trimmedFormData.fullName,
      email: trimmedFormData.email,
      designation: trimmedFormData.designation,
      hospital: trimmedFormData.hospital,
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_META_URI}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: trimmedFormData.fullName,
          email: trimmedFormData.email,
          designation: trimmedFormData.designation,
          hospital: trimmedFormData.hospital,
          password: trimmedFormData.password,
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
        <div className="flex flex-col items-center mb-4">
          <img src="/logo.png" alt="EchoEase Logo" className="w-32 object-contain" />
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

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-4 gap-y-5 text-left">
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

          <div className="col-span-2 flex flex-col items-center">
            <button
              type="submit"
              className="w-1/2 bg-[#2D5B64] text-white font-semibold py-3 rounded-md hover:bg-[#20454E] transition-all"
            >
              Sign-Up
            </button>

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
