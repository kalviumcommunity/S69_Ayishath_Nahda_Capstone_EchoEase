import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "./Navbar";

const Dashboard = () => {
  const [therapistName, setTherapistName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found!");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/therapist", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTherapistName(res.data.name);
      } catch (error) {
        console.error("Failed to fetch therapist details:", error);
      }
      setLoading(false);
    };

    fetchTherapist();
  }, []);


return (
  <div className="min-h-screen bg-[#D9D9D9] flex flex-col">
    {/* Header Section */}
    <header className="bg-[#D9D9D9] shadow-sm p-2 flex justify-between items-center h-15"> 
      <div className="flex items-center">
        <img
          src="/logo.png" 
          alt="EchoEase Logo"
          className="h-20 mr-3 object-contain" 
        />

      </div>
      <div className="text-lg font-bold text-gray-800">
        {loading ? "Loading..." : `${therapistName}'s Dashboard`}
      </div>
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
        <img
          src="/user.png" 
          alt="User Profile"
          className="w-full h-full object-cover"
        />
      </div>
    </header>

    {/* Main Content */}
    <main
      className="flex-1 flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url('https://i.pinimg.com/736x/11/36/22/1136225d739b320c6323289af7aa37a8.jpg')`,
      }}
    >
      {/* Overlay for Background Tint */}
      <div className="absolute inset-0 bg-[#365B6D] opacity-75"></div>

      {/* Buttons Container */}
      <div className="relative flex space-x-6 z-10">
        {/* Add New Patient Button */}
        <button
          onClick={() => navigate("/add-patient")} // Adjust the route as needed
          className="bg-[#D9D9D9] bg-opacity-50 text-gray-800 font-semibold text-xl py-6 px-10 rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:bg-opacity-70 hover:scale-105 hover:shadow-[0_6px_12px_rgba(0,0,0,0.15)] transition-all duration-300 ease-in-out"
        >
          Add New Patient
        </button>

        {/* View Patients Button */}
        <button
          onClick={() => navigate("/view-patients")} // Adjust the route as needed
          className="bg-[#D9D9D9] bg-opacity-50 text-gray-800 font-semibold text-xl py-6 px-10 rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:bg-opacity-70 hover:scale-105 hover:shadow-[0_6px_12px_rgba(0,0,0,0.15)] transition-all duration-300 ease-in-out"
        >
          View Patients
        </button>
      </div>
    </main>
  </div>
);
  };

export default Dashboard;