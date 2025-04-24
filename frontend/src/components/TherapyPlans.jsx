import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TherapyPlans = () => {
  const { patientId } = useParams();
  const [plan, setPlan] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTherapyPlan = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/therapy-plans/patient/${patientId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log("Fetched therapy plan data:", data.data); // Debug log
        setPlan(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
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
      const res = await fetch(`http://localhost:5000/api/therapy-plans/${plan._id}`, {
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

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  if (!plan) return <div className="text-center p-4">No plan available</div>;

  const { goals, activities } = plan;

  return (
    <div className="min-h-screen p-6 sm:p-10 bg-cover bg-center" style={{
      backgroundImage: `linear-gradient(rgba(54, 91, 109, 0.59), rgba(54, 91, 109, 0.59)), url('https://i.pinimg.com/736x/0c/ca/d1/0ccad1b5d5d43afd2ad36ba4ae7cb977.jpg')`
    }}>
      <div className="max-w-4xl mx-auto bg-[#B2D1CF]/80 p-8 sm:p-10 rounded-2xl shadow-xl min-h-[500px] flex flex-col justify-between">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => window.history.back()} className="text-teal-900 text-sm hover:underline">← Back</button>
          <h1 className="text-2xl font-semibold text-teal-900 text-center">Patient's Therapy Plan</h1>
          <img src="/logo.png" alt="EchoEase" className="w-[120px]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Goals */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-teal-800 mb-3">Goals</h2>
            {goals.map((goal, index) => (
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

          {/* Activities */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-teal-800 mb-3">Activities</h2>
            {activities.map((activity, index) => (
              <div key={activity._id} className="mb-4">
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
                    {activity.videos && activity.videos.length > 0 ? (
                      <div className="ml-4 mt-2">
                        <p className="text-sm text-gray-600">Related Videos:</p>
                        {activity.videos.map((video, vidIndex) => (
                          <div key={video._id} className="flex items-center mt-1">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-16 h-12 mr-2 rounded"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/64x48?text=No+Thumbnail';
                              }}
                            />
                            <a
                              href={video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              {video.title}
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

        {/* Buttons */}
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
                  setEditMode(false);
                  setPlan(plan); // Reset to original plan data
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