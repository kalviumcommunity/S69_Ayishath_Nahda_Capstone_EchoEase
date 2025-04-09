import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTrash, FaHome, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

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
      toast.error("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };
//delete functionality
  const handleDelete = async (patientId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      if (window.confirm("Are you sure you want to delete this patient?")) {
        await axios.delete(`http://localhost:5000/api/patients/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        toast.success("Patient deleted successfully");
        fetchPatients();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete patient");
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient?.patientName?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  return (
    <div 
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: `url('https://i.pinimg.com/736x/0c/ca/d1/0ccad1b5d5d43afd2ad36ba4ae7cb977.jpg')` }}
    >
      <div className="absolute inset-0 bg-[#365B6D] opacity-60"></div>
      <div className="relative z-10 max-w-4xl w-full bg-[#B2D1CF] bg-opacity-80 p-6 rounded-lg shadow-lg">
        <header className="flex justify-between items-center mb-4 px-4">
          <img src="/logo.png" alt="Logo" className="h-25" />
          <button 
            onClick={() => navigate("/dashboard")}
            className="text-[#365B6D] hover:text-[#2a4758] transition-colors"
          >
            <header className="flex justify-between items-center mb-4">
 
  <button 
    onClick={() => navigate("/dashboard")}
    className="transition-transform transform hover:scale-105"
  >
    <img 
      src="/home.png" 
      alt="Home" 
      className="h-7 w-7  object-contain" 
    />
  </button>
</header>

          </button>
        </header>
        
        <h1 className="text-2xl font-semibold text-[#365B6D] text-center mb-4">Patient List</h1>
        
        <div className="relative mb-4">
          <FaSearch className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-[#365B6D] focus:border-[#365B6D] focus:outline-none"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-700">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="space-y-3">
            {filteredPatients.map((patient, index) => (
              <div
                key={patient._id}
                className="flex items-center justify-between p-3 bg-white bg-opacity-90 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/therapy-plans/patient/${patient._id}`)}
              >
                <div className="flex items-center">
                  <span className="text-[#365B6D] font-medium mr-4 w-6 text-right">
                    {index + 1}.
                  </span>
                  <div>
                    <h3 className="text-lg text-[#365B6D] font-medium">{patient.patientName}</h3>
                    <p className="text-sm text-gray-600">{patient.age} years</p>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(patient._id, e)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                  aria-label="Delete patient"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;