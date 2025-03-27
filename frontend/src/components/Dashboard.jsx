
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
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Lisu+Bosa:ital,wght@0,400;0,700;1,400;1,900&display=swap"
        rel="stylesheet"
      />
      <div className="relative w-full min-h-screen bg-gray-100">
        {/* Navbar */}
        <Navbar />

        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/dashboardbg.jpeg"
            alt="Dashboard background"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0  bg-[#2C4A52] bg-opacity-30"></div>
        </div>

        {/* Main Content */}
        <main className="relative flex flex-col items-center justify-center min-h-screen">
          {/* Title */}
          <h1 className="text-5xl font-bold text-white mb-9 mt-9 max-md:text-4xl max-sm:text-3xl">
            {loading ? "Loading..." : `${therapistName}'s Dashboard`}
          </h1>

          {/* Action Buttons */}
          <div className="flex gap-12 max-md:flex-wrap max-sm:flex-col max-sm:gap-5">
            <button
              onClick={() => navigate("/add-patient")}
              className="text-2xl italic text-white bg-[#D9D9D9] bg-opacity-50 border border-white border-opacity-50 rounded-lg px-10 py-8 shadow-md transition-all duration-300 hover:bg-opacity-60 hover:scale-105"
            >
              Add New Patient
            </button>
            <button
              onClick={() => navigate("/view-patients")}
              className="text-2xl italic text-white bg-[#D9D9D9] bg-opacity-50 border border-white border-opacity-50 rounded-lg px-10 py-8 shadow-md transition-all duration-300 hover:bg-opacity-60 hover:scale-105"
            >
              View Patients
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
