import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TherapyPlans = () => {
  const { patientId } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTherapyPlan = async () => {
      try {
        console.log(`Fetching plan for patientId: ${patientId}`); // Debug log
        const response = await fetch(`${import.meta.env.VITE_META_URI}/api/therapy-plans/patient/${patientId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Response status:', response.status); // Debug status
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Response data:', data); // Debug data
        setPlan(data.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTherapyPlan();
  }, [patientId]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  if (!plan) return <div className="text-center p-4">No therapy plan found</div>;
  return (
    <div className="min-h-screen bg-teal-700 text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => window.history.back()} className="text-white">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 11H7.414l4.293-4.293a1 1 0 1 0-1.414-1.414l-6 6a1 1 0 0 0 0 1.414l6 6a1 1 0 0 0 1.414-1.414L7.414 13H20a1 1 0 0 0 0-2z"/>
          </svg>
        </button>
        <h1 className="text-2xl font-semibold">Patient's Therapy Plans</h1>
        <img src="/logo.png" alt="EchoEase" className="w-[150px]" />
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <div className="w-1/2 bg-gray-200 p-4 rounded-lg text-black">
          <h3 className="text-lg font-semibold mb-2">Goals</h3>
          <ul className="list-disc pl-5">
            {plan.goals.map((goal, index) => (
              <li key={index} className="mb-2">{goal}</li>
            ))}
          </ul>
        </div>
        <div className="w-1/2 bg-gray-200 p-4 rounded-lg text-black">
          <h3 className="text-lg font-semibold mb-2">Activities</h3>
          {plan.activities.map((activity, index) => (
            <div key={index} className="mb-4 ">
              <h4 className="font-medium">{activity.name}</h4>
              <div className="mt-2 grid grid-cols-1 gap-4">
                {activity.videos.map((video, vidIndex) => (
                  <div key={vidIndex} className="flex items-center space-x-4">
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {video.title}
                    </a>
                    {video.thumbnail && (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-48 h-27 object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <button className="bg-white text-teal-700 px-4 py-2 rounded flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
          Bookmark
        </button>
        <button className="bg-white text-teal-700 px-4 py-2 rounded flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
          Edit
        </button>
      </div>
    </div>
  );
};

export default TherapyPlans;