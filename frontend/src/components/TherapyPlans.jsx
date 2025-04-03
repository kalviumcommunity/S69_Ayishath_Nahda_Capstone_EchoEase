import { useNavigate, useLocation, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TherapyPlan = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const location = useLocation();
  const [therapyPlan, setTherapyPlan] = useState(null);
  const [editablePlan, setEditablePlan] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle field changes
  const handleChange = (field, index, value) => {
    setEditablePlan(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  // Generate new plan with AI
  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/therapy-plans/generate",
        {
          age: therapyPlan.age,
          diagnosis: therapyPlan.diagnosis
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setEditablePlan(response.data);
    } catch (error) {
      console.error("Error generating therapy plan:", error);
      setError(error.response?.data?.message || "Failed to generate therapy plan");
    } finally {
      setGenerating(false);
    }
  };

  // Save the plan
  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/therapy-plans/${therapyPlan._id}`,
        editablePlan,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh the plan after saving
      const updatedResponse = await axios.get(
        `http://localhost:5000/api/therapy-plans/patient/${patientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setTherapyPlan(updatedResponse.data);
      setEditablePlan(updatedResponse.data);
    } catch (error) {
      console.error("Error saving therapy plan:", error);
      setError(error.response?.data?.message || "Failed to save therapy plan");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check for pre-loaded data from navigation state
        if (location.state?.generatedPlan) {
          setTherapyPlan(location.state.generatedPlan);
          setEditablePlan(location.state.generatedPlan);
          setLoading(false);
          return;
        }

        // If no pre-loaded data, fetch from API
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/therapy-plans/patient/${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setTherapyPlan(response.data);
        setEditablePlan(response.data);
      } catch (error) {
        console.error("Error fetching therapy plan:", error);
        setError(error.response?.data?.message || "Failed to load therapy plan");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId, location.state]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="text-2xl font-semibold text-[#365B6D]">Loading therapy plan...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="text-xl text-red-500 p-4 bg-white rounded-lg shadow-md">
        Error: {error}
      </div>
    </div>
  );

  if (!therapyPlan) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="text-xl text-[#365B6D] p-4 bg-white rounded-lg shadow-md">
        No therapy plan found for this patient
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-[#365B6D] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Therapy Plan for {therapyPlan.patientName}</h1>
          <div className="flex space-x-4">
            <button 
              onClick={() => navigate(`/patient-list`)}
              className="bg-white text-[#365B6D] px-4 py-2 rounded-md hover:bg-gray-100"
            >
              Patient List
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="bg-white text-[#365B6D] px-4 py-2 rounded-md hover:bg-gray-100"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Generation Button */}
          <div className="bg-[#B2D1CF] p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#365B6D]">THERAPY PLAN</h2>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className={`py-2 px-6 rounded-lg text-white font-bold ${generating ? 'bg-gray-400' : 'bg-[#4CAF50] hover:bg-[#3e8e41]'} flex items-center`}
            >
              {generating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : "Generate with AI"}
            </button>
          </div>

          {/* Patient Info */}
          <div className="p-6 border-b">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-500">PATIENT NAME</h3>
                <p className="text-lg">{therapyPlan.patientName}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500">AGE</h3>
                <p className="text-lg">{therapyPlan.age} years</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500">DIAGNOSIS</h3>
                <p className="text-lg">{therapyPlan.diagnosis}</p>
              </div>
            </div>
          </div>

          {/* Goals Section */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-bold text-[#365B6D] mb-4">GOALS</h3>
            <div className="space-y-4">
              {editablePlan?.goals?.map((goal, index) => (
                <div key={`goal-${index}`} className="flex items-start">
                  <span className="bg-[#365B6D] text-white rounded-full w-6 h-6 flex items-center justify-center mt-1 mr-3">
                    {index + 1}
                  </span>
                  <textarea
                    value={goal}
                    onChange={(e) => handleChange("goals", index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md p-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#B2D1CF]"
                    placeholder="Enter therapy goal..."
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Activities Section */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-bold text-[#365B6D] mb-4">ACTIVITIES</h3>
            <div className="space-y-4">
              {editablePlan?.activities?.map((activity, index) => (
                <div key={`activity-${index}`} className="flex items-start">
                  <span className="bg-[#365B6D] text-white rounded-full w-6 h-6 flex items-center justify-center mt-1 mr-3">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <textarea
                      value={activity}
                      onChange={(e) => handleChange("activities", index, e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#B2D1CF] mb-2"
                      placeholder="Enter therapy activity..."
                    />
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={editablePlan.youtubeLinks?.[index] || ""}
                        onChange={(e) => handleChange("youtubeLinks", index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#B2D1CF]"
                        placeholder="YouTube link for this activity"
                      />
                      {editablePlan.youtubeLinks?.[index] && (
                        <a 
                          href={editablePlan.youtubeLinks[index]} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-2 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="p-6 bg-gray-50 flex justify-between">
            <button
              onClick={() => navigate(`/patient-list`)}
              className="text-[#365B6D] hover:underline"
            >
              ← Back to Patient List
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`bg-[#365B6D] text-white py-2 px-6 rounded-lg hover:bg-[#2b4a59] transition-colors flex items-center ${saving ? 'opacity-75' : ''}`}
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : "Save Plan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapyPlan;