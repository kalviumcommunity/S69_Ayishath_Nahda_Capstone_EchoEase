import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [therapist, setTherapist] = useState({ name: "", profilePic: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTherapistData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const therapistRes = await axios.get(`${import.meta.env.VITE_META_URI}/api/therapist`, {
        headers: {Authorization: `Bearer ${token} `},
      });

      setTherapist({
        name: therapistRes.data.name,
        profilePic: therapistRes.data.profilePic
          ? `${import.meta.env.VITE_META_URI}${therapistRes.data.profilePic}`
          : "/user.png",
      });

    } catch (error) {
      console.error("Error fetching therapist data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapistData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#D9D9D9] flex flex-col relative">
      {/* Header */}
      <header className="bg-[#D9D9D9] shadow-sm p-2 flex justify-between items-center h-[60px] relative">
        <img src="/logo.png" alt="Logo" className="h-20 object-contain" />

        {/* Profile Section with hover */}
        <div className="relative group">
          <div
            className="w-10 h-10 rounded-full overflow-hidden cursor-pointer border-2 border-[#365B6D]"
          >
            <img
              src={therapist.profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = "/user.png")}
            />
          </div>

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-40 bg-[#B2D1CF] rounded-lg shadow-lg overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
            <button
              className="block w-full text-left px-4 py-2 text-[#365B6D] hover:bg-[#365B6D] hover:text-white transition-colors"
              onClick={() => navigate("/profile")}
            >
              View Profile
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-[#365B6D] hover:bg-[#365B6D] hover:text-white transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className="flex-1 flex flex-col items-center bg-cover bg-center relative"
        style={{
          backgroundImage: `url('https://i.pinimg.com/736x/11/36/22/1136225d739b320c6323289af7aa37a8.jpg')`,

        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#365B6D] opacity-70"></div>

        {/* Title */}
        <h1 className="relative z-10 text-4xl font-bold text-white mt-8 mb-8">
          {loading ? "Loading..." : `${therapist.name || "Therapist"}'s Dashboard`}
        </h1>

        {/* Buttons */}
        <div className="relative z-10 mt-20 w-full flex justify-center">
          <div className="flex space-x-8">
            <button
              onClick={() => navigate("/add-patient")}
              className="bg-[#D9D9D9] bg-opacity-40 text-white font-semibold text-2xl py-6 px-10 rounded-[5px] shadow-[0_6px_12px_rgba(0,0,0,0.2)] hover:bg-opacity-50 hover:scale-105 hover:shadow-[0_8px_16px_rgba(0,0,0,0.25)] transition-all duration-300 ease-in-out w-[351px] h-[215px] flex items-center justify-center"
              style={{ fontFamily: "'Lisu Bosa', sans-serif" }}
            >
              Add New Patient
            </button>

            <button
              onClick={() => navigate("/patient-list")}
              className="bg-[#D9D9D9] bg-opacity-40 text-white font-semibold text-2xl py-6 px-10 rounded-[5px] shadow-[0_6px_12px_rgba(0,0,0,0.2)] hover:bg-opacity-50 hover:scale-105 hover:shadow-[0_8px_16px_rgba(0,0,0,0.25)] transition-all duration-300 ease-in-out w-[351px] h-[215px] flex items-center justify-center"
              style={{ fontFamily: "'Lisu Bosa', sans-serif" }}
            >
              View Patients
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;