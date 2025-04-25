import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TherapyPlans = () => {
  const { patientId } = useParams();
  const [plan, setPlan] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTherapyPlan = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_META_URI}/api/therapy-plans/patient/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setPlan(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapyPlan();
  }, [patientId]);

  const handleGoalChange = (index, value) => {
    if (plan) {
      const updatedGoals = [...plan.goals];
      updatedGoals[index] = value;
      setPlan({ ...plan, goals: updatedGoals });
    }
  };

  const handleAddGoal = () => {
    if (plan) {
      setPlan({ ...plan, goals: [...plan.goals, ""] });
    }
  };

  const handleActivityChange = (index, field, value) => {
    if (plan) {
      const updatedActivities = [...plan.activities];
      updatedActivities[index] = { ...updatedActivities[index], [field]: value };
      setPlan({ ...plan, activities: updatedActivities });
    }
  };

  const handleAddActivity = () => {
    if (plan) {
      setPlan({ ...plan, activities: [...plan.activities, { name: "", videos: [] }] });
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_META_URI}/api/therapy-plans/${plan._id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ goals: plan.goals, activities: plan.activities }),
      });
      if (!res.ok) throw new Error("Failed to save changes");
      const updatedPlan = await res.json();
      setPlan(updatedPlan.data);
      setEditMode(false);
    } catch (err) {
      alert("Error saving data: " + err.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen p-6 sm:p-10 bg-cover bg-center" style={{
      backgroundImage: `linear-gradient(rgba(54, 91, 109, 0.59), rgba(54, 91, 109, 0.59)), url('https://i.pinimg.com/736x/0c/ca/d1/0ccad1b5d5d43afd2ad36ba4ae7cb977.jpg')`
    }}>
      <div className="max-w-4xl mx-auto bg-[#B2D1CF]/80 p-8 sm:p-10 rounded-2xl shadow-xl min-h-[500px]">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-3/4"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-300 rounded w-full"></div>
            ))}
          </div>
          <div className="h-8 bg-gray-300 rounded w-3/4 mt-6"></div>
          <div className="space-y-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-300 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  if (!plan) return <div className="text-center p-4">No plan available</div>;

  return (
    <div className="min-h-screen p-6 sm:p-10 bg-cover bg-center" style={{
      backgroundImage: `linear-gradient(rgba(54, 91, 109, 0.59), rgba(54, 91, 109, 0.59)), url('https://i.pinimg.com/736x/0c/ca/d1/0ccad1b5d5d43afd2ad36ba4ae7cb977.jpg')`
    }}>
      <div className="max-w-4xl mx-auto bg-[#B2D1CF]/80 p-8 sm:p-10 rounded-2xl shadow-xl min-h-[500px] flex flex-col justify-between">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => window.history.back()} className="text-teal-900 text-sm hover:underline">← Back</button>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-teal-900">Patient's Therapy Plan</h1>
            {plan.diagnosis && (
              <div className="text-sm text-teal-800">
                Diagnosis: {plan.diagnosis}
                {plan.diagnosis.toLowerCase() === 'aphasia' && plan.aphasiaSeverity && (
                  <span> (Severity: {plan.aphasiaSeverity})</span>
                )}
              </div>
            )}
          </div>
          <img src="/logo.png" alt="EchoEase" className="w-[120px]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Goals Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-teal-800 mb-3">Goals</h2>
            {plan.goals.map((goal, index) => (
              <div key={index} className="mb-2">
                {editMode ? (
                  <input
                    type="text"
                    value={goal || ""}
                    onChange={(e) => handleGoalChange(index, e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring focus:ring-teal-300"
                  />
                ) : (
                  <p className="text-gray-800">• {goal}</p>
                )}
              </div>
            ))}
            {editMode && (
              <button onClick={handleAddGoal} className="text-sm text-blue-700 mt-2 hover:underline">+ Add Goal</button>
            )}
          </div>

          {/* Activities Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-teal-800 mb-3">Activities</h2>
            {plan.activities.map((activity, index) => (
              <div key={index} className="mb-4">
                {editMode ? (
                  <input
                    type="text"
                    value={activity.name || ""}
                    onChange={(e) => handleActivityChange(index, 'name', e.target.value)}
                    placeholder="Activity Name"
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring focus:ring-teal-300"
                  />
                ) : (
                  <div>
                    <p className="font-medium text-gray-800">• {activity.name}</p>
                    {activity.videos?.length > 0 ? (
                      <div className="ml-4 mt-2">
                        <p className="text-sm text-gray-600">Related Videos:</p>
                        {activity.videos.map((video, vidIndex) => (
                          <div key={vidIndex} className="flex items-center mt-1">
                            <img
                              src={video.thumbnail || 'https://via.placeholder.com/64x48?text=No+Thumbnail'}
                              alt={video.title || 'Video thumbnail'}
                              className="w-16 h-12 mr-2 rounded"
                            />
                            <a
                              href={video.url || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              {video.title || 'Untitled video'}
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 ml-4 mt-2">No videos available for this activity.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
            {editMode && (
              <button onClick={handleAddActivity} className="text-sm text-blue-700 mt-2 hover:underline">+ Add Activity</button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2 rounded-full shadow transition"
              >
                Save
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to discard your changes?')) {
                    setEditMode(false);
                    fetchTherapyPlan();
                  }
                }}
                className="bg-white border border-teal-700 text-teal-700 hover:bg-teal-50 px-6 py-2 rounded-full shadow transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-white border border-teal-700 text-teal-700 hover:bg-teal-50 px-6 py-2 rounded-full shadow transition"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TherapyPlans;