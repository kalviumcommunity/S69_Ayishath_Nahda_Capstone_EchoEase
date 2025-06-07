import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProgressTracking = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    notes: "",
    clarityScore: "",
  });
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProgressData();
  }, [patientId]);

  const fetchProgressData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_META_URI}/api/progress/${patientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProgressData(response.data);
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_META_URI}/api/progress/${patientId}`,
        {
          date: formData.date,
          notes: formData.notes,
          clarityScore: parseInt(formData.clarityScore),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData({ date: new Date().toISOString().split("T")[0], notes: "", clarityScore: "" });
      fetchProgressData();
    } catch (error) {
      console.error("Error saving progress:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center relative"
      style={{ backgroundImage: `url('/Progress.png')` }}
    >
      <div className="absolute inset-0 bg-[#365B6D] opacity-[0.59]"></div>
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-13 left-13 z-10"
      >
        <img src="/home.png" alt="Home" className="w-10 h-10" />
      </button>
      <img
        src="/logo.png"
        alt="EchoEase"
        className="absolute top-1 right-9 w-[150px] z-10"
      />
      <div className="relative z-10 bg-[#B2D1CF] bg-opacity-[0.80] backdrop-blur-md rounded-lg shadow-lg p-10 w-[800px]">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Progress Tracking for Patient {patientId}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg font-semibold text-black">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 bg-transparent border-b border-black text-gray-700"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-black">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-2 bg-transparent border-b border-black text-gray-700"
              placeholder="Enter session notes..."
              required
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-black">Clarity Score (1-10)</label>
            <input
              type="number"
              name="clarityScore"
              value={formData.clarityScore}
              onChange={handleChange}
              className="w-full p-2 bg-transparent border-b border-black text-gray-700"
              min="1"
              max="10"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-[#365B6D] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#2b4a59] transition-all w-40 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        </form>
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-white mb-4">Progress History</h3>
          {progressData.length > 0 ? (
            <ul className="space-y-2">
              {progressData.map((entry, index) => (
                <li key={index} className="p-2 bg-[#365B6D] bg-opacity-20 rounded">
                  <p className="text-white">Date: {new Date(entry.date).toLocaleDateString()}</p>
                  <p className="text-white">Notes: {entry.notes}</p>
                  <p className="text-white">Clarity Score: {entry.clarityScore}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white">No progress entries yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracking;