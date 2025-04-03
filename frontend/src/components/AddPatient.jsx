import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddPatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    diagnosis: '',
    nativeLanguage: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.patientName.trim() || !formData.age || !formData.diagnosis.trim()) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      // 1. First save patient data
      const patientResponse = await axios.post(
        "http://localhost:5000/api/patients",
        {
          patientName: formData.patientName.trim(),
          age: Number(formData.age),
          diagnosis: formData.diagnosis.trim(),
          nativeLanguage: formData.nativeLanguage.trim()
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // 2. Then generate therapy plan
      const therapyPlanResponse = await axios.post(
        "http://localhost:5000/api/therapy-plans/generate",
        {
          age: Number(formData.age),
          diagnosis: formData.diagnosis.trim()
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // 3. Redirect to therapy plan with the generated data
      navigate(`/therapy-plans/patient/${patientResponse.data._id}`, {
        state: {
          generatedPlan: therapyPlanResponse.data,
          patient: patientResponse.data
        },
        replace: true // Prevent going back to add patient page
      });

    } catch (error) {
      console.error("Error in patient creation:", error);
      setError(
        error.response?.data?.message || 
        "Failed to create patient. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-cover bg-center relative"
      style={{ backgroundImage: `url('https://i.pinimg.com/736x/0c/ca/d1/0ccad1b5d5d43afd2ad36ba4ae7cb977.jpg')` }}>
      
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[#365B6D] opacity-[0.59]"></div>

      {/* Home Button */}
      <button onClick={() => navigate("/dashboard")} className="absolute top-13 left-13 z-10">
        <img src="/home.png" alt="Home" className="w-10 h-10" />
      </button>

      {/* Logo */}
      <img src="/logo.png" alt="EchoEase" className="absolute top-1 right-9 w-[150px] z-10" />

      {/* Form Container */}
      <div className="relative z-10 bg-[#B2D1CF] bg-opacity-[0.80] backdrop-blur-md rounded-lg shadow-lg p-10 w-[800px]">
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Patient Name */}
          <div className="flex justify-between items-center">
            <label className="text-lg font-semibold text-black">Patient Name</label>
            <input 
              type="text" 
              name="patientName"
              value={formData.patientName} 
              onChange={handleChange}
              className="w-80 p-2 bg-transparent border-b border-black text-gray-700 placeholder-gray-500 outline-none"
              placeholder="Enter name.." 
              required 
            />
          </div>

          {/* Age */}
          <div className="flex justify-between items-center">
            <label className="text-lg font-semibold text-black">Age</label>
            <input 
              type="number" 
              name="age"
              value={formData.age} 
              onChange={handleChange}
              className="w-80 p-2 bg-transparent border-b border-black text-gray-700 placeholder-gray-500 outline-none"
              placeholder="Enter age.." 
              min="1"
              max="120"
              required 
            />
          </div>

          {/* Diagnosis */}
          <div className="flex justify-between items-center">
            <label className="text-lg font-semibold text-black">Diagnosis</label>
            <input 
              type="text" 
              name="diagnosis"
              value={formData.diagnosis} 
              onChange={handleChange}
              className="w-80 p-2 bg-transparent border-b border-black text-gray-700 placeholder-gray-500 outline-none"
              placeholder="Enter diagnosis.." 
              required 
            />
          </div>

          {/* Native Language (Optional) */}
          <div className="flex justify-between items-center">
            <label className="text-lg font-semibold text-black">Native Language</label>
            <input 
              type="text" 
              name="nativeLanguage"
              value={formData.nativeLanguage} 
              onChange={handleChange}
              className="w-80 p-2 bg-transparent border-b border-black text-gray-700 placeholder-gray-500 outline-none"
              placeholder="Enter language.." 
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button 
              type="submit" 
              className="bg-[#365B6D] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#2b4a59] transition-all w-40 flex justify-center items-center" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;