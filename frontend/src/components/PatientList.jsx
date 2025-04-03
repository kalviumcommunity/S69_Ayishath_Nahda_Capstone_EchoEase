import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPatients(response.data.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch patients");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [navigate]);

  return (
    <div 
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: `url('https://i.pinimg.com/736x/0c/ca/d1/0ccad1b5d5d43afd2ad36ba4ae7cb977.jpg')` }}
    >
      <div className="absolute inset-0 bg-[#365B6D] opacity-60"></div>
      <div className="relative z-10 max-w-4xl w-full bg-[#B2D1CF] bg-opacity-80 p-6 rounded-lg shadow-lg">
        <header className="flex justify-between items-center mb-4">
          <img src="/logo.png" alt="Logo" className="h-12" />
          <button onClick={() => navigate("/dashboard")}>
            <img src="/home.png" alt="Home" className="h-10 w-10" />
          </button>
        </header>
        <h1 className="text-2xl font-semibold text-[#365B6D] text-center mb-4">Patient List</h1>
        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-[#B2D1CF] focus:outline-none"
        />
        {loading ? (
          <p className="text-center text-gray-700">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <ul className="divide-y divide-gray-300">
            {patients.filter(patient => patient?.patientName?.toLowerCase()?.includes(searchTerm.toLowerCase())).map((patient) => (
              <li key={patient._id} className="py-2 flex justify-between items-center cursor-pointer hover:bg-gray-100 px-2 rounded" onClick={() => navigate(`/therapy-plans/patient/${patient._id}`)}>
                <span className="text-lg text-[#365B6D] font-medium">{patient.patientName}</span>
                <span className="text-gray-700">{patient.age} years</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PatientList;