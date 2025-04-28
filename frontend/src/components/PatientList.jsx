import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTrash, FaHome, FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPatients, setTotalPatients] = useState(0);
 
  useEffect(() => {
    fetchPatients(currentPage);
  }, [currentPage]);

  const fetchPatients = async (page) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_META_URI}/api/patients?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPatients(response.data.data);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setTotalPatients(response.data.pagination?.totalPatients || response.data.data.length);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch patients");
      toast.error("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (patientId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.delete(`${import.meta.env.VITE_META_URI}/api/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Patient deleted successfully");
      fetchPatients(currentPage);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete patient");
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient?.patientName?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

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
            className="text-[#365B6D] hover:text-[#2a4758] transition-colors transition-transform transform hover:scale-105"
          >
            <FaHome className="h-7 w-7 object-contain" />
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
          <>
            <div className="space-y-3">
              {filteredPatients.map((patient, index) => (
                <div
                  key={patient._id}
                  className="flex items-center justify-between p-3 bg-white bg-opacity-90 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div 
                    className="flex items-center cursor-pointer flex-grow"
                    onClick={() => navigate(`/therapy-plans/patient/${patient._id}`)}
                  >
                    <span className="text-[#365B6D] font-medium mr-4 w-6 text-right">
                      {(currentPage - 1) * 10 + index + 1}.
                    </span>
                    <div>
                      <h3 className="text-lg text-[#365B6D] font-medium">{patient.patientName}</h3>
                      <p className="text-sm text-gray-600">{patient.age} years</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDelete(patient._id, e)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                      aria-label="Delete patient"
                    >
                      <FaTrash />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/progress-tracking/patient/${patient._id}`);
                      }}
                      className="bg-[#365B6D] text-white px-3 py-1 rounded hover:bg-[#2a4758] transition-colors"
                    >
                      View Progress
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    currentPage === 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#365B6D] text-white hover:bg-[#2a4758]"
                  }`}
                >
                  <FaArrowLeft />
                  <span>Previous</span>
                </button>
                <span className="text-[#365B6D] font-medium">
                  Page {currentPage} of {totalPages} (Total: {totalPatients})
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    currentPage === totalPages
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#365B6D] text-white hover:bg-[#2a4758]"
                  }`}
                >
                  <span>Next</span>
                  <FaArrowRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PatientList;