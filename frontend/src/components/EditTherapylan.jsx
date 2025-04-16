import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditTherapyPlan = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  // TODO: Fetch and edit plan
  return (
    <div className="min-h-screen bg-teal-700 text-white p-4">
      <h1 className="text-2xl font-semibold mb-4">Edit Therapy Plan</h1>
      <p>Editing plan for patient {patientId} (coming soon)</p>
      <button
        onClick={() => navigate(`/therapy-plans/patient/${patientId}`)}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Back to Plan
      </button>
    </div>
  );
};

export default EditTherapyPlan;