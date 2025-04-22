import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [therapist, setTherapist] = useState({
    name: "",
    profilePic: ""
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTherapistData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const therapistRes = await axios.get("http://localhost:5000/api/therapist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setTherapist({
        name: therapistRes.data.name,
        profilePic: therapistRes.data.profilePic 
          ? `http://localhost:5000${therapistRes.data.profilePic}`
          : "/user.png"
      });

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapistData();
    
    // Add event listener for profile updates
    const handleProfileUpdate = () => {
      fetchTherapistData(); // Refetch therapist data when profile updates
    };
    
    window.addEventListener('profileUpdate', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdate', handleProfileUpdate);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#D9D9D9] flex flex-col">
      {/* Header Section */}
      <header className="bg-[#D9D9D9] shadow-sm p-2 flex justify-between items-center h-[60px]">
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="EchoEase Logo"
            className="h-20 mr-3 object-contain"
          />
        </div>
        <div 
          className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <img
            src={therapist.profilePic}
            alt="User Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/user.png";
            }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main
        className="flex-1 flex flex-col items-center bg-cover bg-center relative"
        style={{
          backgroundImage: `url('https://i.pinimg.com/736x/11/36/22/1136225d739b320c6323289af7aa37a8.jpg')`,
        }}
      >
        {/* Overlay for Background Tint */}
        <div className="absolute inset-0 bg-[#365B6D] opacity-70"></div>

        {/* Dashboard Title */}
        <h1 className="relative z-10 text-4xl font-bold text-white mt-8 mb-8">
          {loading ? "Loading..." : `${therapist.name}'s Dashboard`}
        </h1>

        {/* Buttons Container - Updated styling here */}
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
