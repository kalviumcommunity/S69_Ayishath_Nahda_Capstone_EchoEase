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

      setPatients(response.data.data || []);
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
      <div className="absolute inset-0 bg-[#365B6D] opacity-50"></div>
      <div className="relative z-10 max-w-6xl w-full bg-[#B2D1CF] bg-opacity-90 p-6 rounded-lg shadow-lg border border-gray-200">
        <header className="flex justify-between items-center mb-6 px-4">
          <img src="/logo.png" alt="Logo" className="h-22" />
          <button
            onClick={() => navigate("/dashboard")}
            className="text-black hover:text-gray-200 transition-colors duration-200"
          >
            <FaHome className="h-7 w-7" />
          </button>
        </header>

        <h1 className="text-2xl font-semibold text-[#365B6D] text-center mb-6">Patient List</h1>

        <div className="relative mb-6">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#365B6D] focus:border-[#365B6D] focus:outline-none transition-all duration-200"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-700 text-base">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600 text-base">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full bg-white bg-opacity-95 border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#B2D1CF] bg-opacity-80">
                    <th className="py-3 px-4 text-left text-[#365B6D] font-medium border-b border-gray-200">Name</th>
                    <th className="py-3 px-4 text-left text-[#365B6D] font-medium border-b border-gray-200">Age</th>
                    <th className="py-3 px-4 text-left text-[#365B6D] font-medium border-b border-gray-200">Origin</th>
                    <th className="py-3 px-4 text-left text-[#365B6D] font-medium border-b border-gray-200">Diagnosis</th>
                    <th className="py-3 px-4 text-left text-[#365B6D] font-medium border-b border-gray-200">Progress</th>
                    <th className="py-3 px-4 text-left text-[#365B6D] font-medium border-b border-gray-200">Therapy Plan</th>
                    <th className="py-3 px-4 text-left text-[#365B6D] font-medium border-b border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient, index) => (
                    <tr
                      key={patient._id}
                      className="hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className="py-3 px-4 border-b border-gray-200">
                        <span className="text-[#365B6D] font-medium mr-4 w-6 text-right">
                          {(currentPage - 1) * 10 + index + 1}.
                        </span>
                        <span className="text-gray-800 font-medium">{patient.patientName}</span>
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200">
                        <p className="text-gray-700 text-sm">{patient.age} years</p>
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200">
                        <p className="text-gray-700 text-sm">{patient.nativeLanguage || "N/A"}</p>
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200">
                        <p className="text-gray-700 text-sm">{patient.diagnosis || "N/A"}</p>
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/progress-tracking/patient/${patient._id}`);
                          }}
                          className="bg-[#365B6D] text-white px-4 py-1 rounded-md hover:bg-[#2a4758] transition-colors duration-200 text-sm"
                        >
                          View Progress
                        </button>
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/therapy-plans/patient/${patient._id}`);
                          }}
                          className="bg-[#365B6D] text-white px-4 py-1 rounded-md hover:bg-[#2a4758] transition-colors duration-200 text-sm"
                        >
                          View Plan
                        </button>
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200">
                        <button
                          onClick={(e) => handleDelete(patient._id, e)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors duration-200"
                          aria-label="Delete patient"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPatients.length === 0 && (
                <div className="text-center text-gray-700 text-base mt-4">No patients found</div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`flex items-center space-x-2 px-4 py-1 rounded-md transition-all duration-200 ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#365B6D] text-white hover:bg-[#2a4758]"
                  }`}
                >
                  <FaArrowLeft />
                  <span>Previous</span>
                </button>
                <span className="text-[#365B6D] font-medium text-base">
                  Page {currentPage} of {totalPages} (Total: {totalPatients})
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center space-x-2 px-4 py-1 rounded-md transition-all duration-200 ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
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