import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const TherapyPlans = () => {
  const { patientId } = useParams();
  const [plan, setPlan] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const fetchTherapyPlan = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const token = localStorage.getItem("token") || "";
      if (!token) {
        throw new Error("No token found, please log in");
      }

      if (!patientId) {
        throw new Error("Patient ID is required");
      }

      const patientResponse = await fetch(`${import.meta.env.VITE_META_URI}/api/patients/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!patientResponse.ok) {
        if (patientResponse.status === 404) {
          throw new Error("Patient not found");
        }
        throw new Error(`Failed to fetch patient: ${patientResponse.status}`);
      }

      const response = await fetch(`${import.meta.env.VITE_META_URI}/api/therapy-plans/patient/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          const createResponse = await fetch(`${import.meta.env.VITE_META_URI}/api/therapy-plans`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ patientId }),
          });
          if (!createResponse.ok) throw new Error(`Failed to create therapy plan: ${createResponse.status}`);
          const data = await createResponse.json();
          setPlan(data.data);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        const data = await response.json();
        setPlan(data.data);
      }
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchVideos = async () => {
    if (!searchTerm.trim()) return;
    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(`${import.meta.env.VITE_META_URI}/api/therapy-plans/search-videos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchTerm }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data.data || []);
    } catch (err) {
      setError(`Error fetching videos: ${err.message}`);
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

  const handleAddActivity = () => {
    if (plan && selectedVideo) {
      setPlan({
        ...plan,
        activities: [...plan.activities, { name: searchTerm, videos: [selectedVideo] }],
      });
      setSearchTerm("");
      setSearchResults([]);
      setSelectedVideo(null);
    } else if (!selectedVideo) {
      alert("Please select a video before adding an activity.");
    }
  };

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
    setSearchResults([]); // Clear results after selection
  };

  const handleSave = async () => {
    try {
      // Validate plan data before sending
      if (!plan || !plan._id) {
        throw new Error("Invalid plan data");
      }

      // Validate required fields
      if (!plan.goals || !Array.isArray(plan.goals)) {
        throw new Error("Goals must be an array");
      }

      const res = await fetch(`${import.meta.env.VITE_META_URI}/api/therapy-plans/${plan._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...plan,
          goals: plan.goals.filter(goal => goal.trim()), // Remove empty goals
          activities: plan.activities || [] // Ensure activities is defined
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Server error: ${res.status}`);
      }
      
      const updatedPlan = await res.json();
      setPlan(updatedPlan.data);
      setEditMode(false);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(`Failed to save changes: ${err.message}`);
      console.error("Save error:", err);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to discard your changes?")) {
      setEditMode(false);
      fetchTherapyPlan(); // Re-fetch the original plan
    }
  };
  const handleProgressNoteClick = () => {
    // Navigating to the progress page
    navigate(`/progress-note/${patientId}`);
  };


  if (loading)
    return (
      <div className="min-h-screen p-6 sm:p-10 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(54, 91, 109, 0.59), rgba(54, 91, 109, 0.59)), url('https://i.pinimg.com/736x/0c/ca/d1/0ccad1b5d5d43afd2ad36ba4ae7cb977.jpg')` }}>
        <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#B2D1CF] to-[#A5C4C2] p-4 sm:p-8 md:p-10 rounded-2xl shadow-2xl border border-teal-200 min-h-[500px]">
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
    <div className="min-h-screen p-6 sm:p-10 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(54, 91, 109, 0.59), rgba(54, 91, 109, 0.59)), url('https://i.pinimg.com/736x/0c/ca/d1/0ccad1b5d5d43afd2ad36ba4ae7cb977.jpg')` }}>
      <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#B2D1CF] to-[#A5C4C2] p-4 sm:p-8 md:p-10 rounded-2xl shadow-2xl border border-teal-200 min-h-[500px] flex flex-col justify-between">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => window.history.back()} className="text-teal-900 text-sm hover:underline hover:text-teal-700 transition-colors duration-200" aria-label="Go back to previous page">← Back</button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-teal-900">Patient's Therapy Plan</h1>
            {plan.diagnosis && (
              <div className="text-sm text-teal-900 bg-teal-100 px-2 py-1 rounded mt-1">
                Diagnosis: {plan.diagnosis}
                {plan.diagnosis.toLowerCase() === "aphasia" && plan.aphasiaSeverity && (
                  <span> (Severity: {plan.aphasiaSeverity})</span>
                )}
              </div>
            )}
          </div>
          <img
            src="/logo.png"
            alt="EchoEase"
            className="w-[120px]"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-teal-800 mt-6 mb-3">Goals</h2>
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
                  <p className="text-teal-800">• {goal}</p>
                )}
              </div>
            ))}
            {editMode && (
              <button onClick={handleAddGoal} className="text-sm text-teal-600 mt-2 hover:underline">+ Add Goal</button>
            )}
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-teal-800 mt-6 mb-3">Activities</h2>
            {plan.activities.map((activity, index) => (
              <div key={index} className="mb-4">
                {editMode ? (
                  <div>
                    {activity.videos?.length > 0 ? (
                      <div className="ml-4 mt-2">
                        <p className="text-sm text-teal-600">Related Videos:</p>
                        {activity.videos.map((video, vidIndex) => (
                          <div key={vidIndex} className="flex items-center mt-3">
                            {video.thumbnail && video.thumbnail !== "" ? (
                              <img
                                src={video.thumbnail}
                                alt={video.title || "Video thumbnail"}
                                className="w-20 h-14 mr-2 rounded hover:scale-105 transition-transform duration-200"
                                onError={(e) => {
                                  e.target.src = "https://via.placeholder.com/80x56?text=No+Thumbnail";
                                }}
                              />
                            ) : (
                              <div className="w-20 h-14 mr-2 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500 border border-gray-300">
                                No thumbnail
                              </div>
                            )}
                            <a
                              href={video.url || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-600 hover:underline hover:text-teal-700 transition-all duration-200 text-sm"
                            >
                              {video.title || "Untitled video"}
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 ml-4 mt-2"></p>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-teal-800">• {activity.name}</p>
                    {activity.videos?.length > 0 ? (
                      <div className="ml-4 mt-2">
                        <p className="text-sm text-teal-600">Related Videos:</p>
                        {activity.videos.map((video, vidIndex) => (
                          <div key={vidIndex} className="flex items-center mt-3">
                            {video.thumbnail && video.thumbnail !== "" ? (
                              <img
                                src={video.thumbnail}
                                alt={video.title || "Video thumbnail"}
                                className="w-20 h-14 mr-2 rounded hover:scale-105 transition-transform duration-200"
                                onError={(e) => {
                                  e.target.src = "https://via.placeholder.com/80x56?text=No+Thumbnail";
                                }}
                              />
                            ) : (
                              <div className="w-20 h-14 mr-2 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500 border border-gray-300">
                                No thumbnail
                              </div>
                            )}
                            <a
                              href={video.url || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-600 hover:underline hover:text-teal-700 transition-all duration-200 text-sm"
                            >
                              {video.title || "Untitled video"}
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
              <div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearchVideos()}
                  placeholder="+ Add Activity (Search YouTube for videos...)"
                  className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring focus:ring-teal-300"
                />
                <button
                  onClick={handleSearchVideos}
                  className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition mr-2"
                >
                  Search
                </button>
                {searchResults.length > 0 && (
                  <div className="mt-2">
                    {searchResults.map((video, vidIndex) => (
                      <div
                        key={vidIndex}
                        className="flex items-center mt-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                        onClick={() => handleSelectVideo(video)}
                      >
                        {video.thumbnail && video.thumbnail !== "" ? (
                          <img
                            src={video.thumbnail}
                            alt={video.title || "Video thumbnail"}
                            className="w-20 h-14 mr-2 rounded"
                          />
                        ) : (
                          <div className="w-20 h-14 mr-2 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                            No thumbnail
                          </div>
                        )}
                        <span className="text-teal-600">{video.title || "Untitled video"}</span>
                      </div>
                    ))}
                  </div>
                )}
                {selectedVideo && (
                  <button
                    onClick={handleAddActivity}
                    className="mt-2 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
                  >
                    Add Selected Video as Activity
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-10">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-full shadow transition"
                aria-label="Save therapy plan changes"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-white border border-red-500 text-red-500 hover:bg-red-50 px-8 py-3 rounded-full shadow transition"
                aria-label="Cancel editing therapy plan"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-teal-600 text-white hover:bg-teal-700 px-8 py-3 rounded-full shadow transition"
              aria-label="Edit therapy plan"
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