import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash/debounce';

const AddPatient = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        patientName: '',
        age: '',
        diagnosis: '',
        nativeLanguage: '',
        languageOption: 'English'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [duplicateWarning, setDuplicateWarning] = useState(null);

    const commonLanguages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Hindi', 'Arabic', 'Other'];
    const diagnosisOptions = ['articulation', 'language', 'stuttering', 'apraxia', 'aphasia', 'pragmatic'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'languageOption' && value !== 'Other' ? { nativeLanguage: value.toLowerCase() } : {}),
            ...(name === 'languageOption' && value === 'Other' ? { nativeLanguage: '' } : {})
        }));
    };

    const handleCustomLanguageChange = (e) => {
        setFormData(prev => ({
            ...prev,
            nativeLanguage: e.target.value.toLowerCase()
        }));
    };

    const checkForDuplicate = debounce(async (patientName, nativeLanguage) => {
        if (!patientName || !nativeLanguage) {
            setDuplicateWarning(null);
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_META_URI}/api/patients?search=${encodeURIComponent(patientName)}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const duplicate = response.data.data.find(
                patient => patient.patientName.toLowerCase() === patientName.toLowerCase() &&
                           patient.nativeLanguage.toLowerCase() === nativeLanguage.toLowerCase()
            );
            setDuplicateWarning(duplicate ? 
                `A patient with the name "${patientName}" and language "${nativeLanguage}" already exists.` : null);
        } catch (error) {
            console.error('Duplicate check failed:', error);
        }
    }, 500);

    useEffect(() => {
        checkForDuplicate(formData.patientName.trim(), formData.nativeLanguage.trim());
    }, [formData.patientName, formData.nativeLanguage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { patientName, age, diagnosis, nativeLanguage } = formData;
        const trimmedName = patientName.trim();
        const trimmedDiagnosis = diagnosis.trim().toLowerCase();
        const trimmedLanguage = nativeLanguage.trim();
        const ageNumber = Number(age);

        // Validation
        if (trimmedName.length < 2) {
            setError('Patient name must be at least 2 characters');
            setLoading(false);
            return;
        }
        if (isNaN(ageNumber) || ageNumber < 1 || ageNumber > 120) {
            setError('Age must be between 1 and 120');
            setLoading(false);
            return;
        }
        if (!diagnosisOptions.includes(trimmedDiagnosis)) {
            setError('Please select a valid diagnosis from the list');
            setLoading(false);
            return;
        }
        if (!trimmedLanguage) {
            setError('Native language is required');
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to continue');
            setLoading(false);
            return;
        }

        const patientPayload = { patientName: trimmedName, age: ageNumber, diagnosis: trimmedDiagnosis, nativeLanguage: trimmedLanguage };

        try {
            // Create patient
            const patientResponse = await axios.post(
                '${import.meta.env.VITE_META_URI}/api/patients',
                patientPayload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const patientId = patientResponse.data.patient._id;

            // Create therapy plan
            const planResponse = await axios.post(
                '${import.meta.env.VITE_META_URI}/api/therapy-plans',
                { patientId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
           
            navigate(`/therapy-plans/patient/${patientId}`, {
                state: { patient: patientResponse.data.patient, plan: planResponse.data.data }
            });
        } catch (error) {
            console.error('Submission error:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'Failed to create patient/therapy plan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-cover bg-center relative"
            style={{ backgroundImage: `url('https://i.pinimg.com/736x/0c/ca/d1/0ccad1b5d5d43afd2ad36ba4ae7cb977.jpg')` }}>
            <div className="absolute inset-0 bg-[#365B6D] opacity-[0.59]"></div>
            <button onClick={() => navigate('/dashboard')} className="absolute top-13 left-13 z-10">
                <img src="/home.png" alt="Home" className="w-10 h-10" />
            </button>
            <img src="/logo.png" alt="EchoEase" className="absolute top-1 right-9 w-[150px] z-10" />
            <div className="relative z-10 bg-[#B2D1CF] bg-opacity-[0.80] backdrop-blur-md rounded-lg shadow-lg p-10 w-[800px]">
                {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-center">{error}</div>}
                {duplicateWarning && <div className="mb-4 p-2 bg-yellow-100 text-yellow-700 rounded text-center">{duplicateWarning}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
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
                    <div className="flex justify-between items-center">
                        <label className="text-lg font-semibold text-black">Diagnosis</label>
                        <select
                            name="diagnosis"
                            value={formData.diagnosis}
                            onChange={handleChange}
                            className="w-80 p-2 bg-transparent border-b border-black text-gray-700 outline-none"
                            required
                        >
                            <option value="">Select Diagnosis</option>
                            {diagnosisOptions.map(d => (
                                <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-between items-center">
                        <label className="text-lg font-semibold text-black">Native Language</label>
                        <div className="w-80">
                            <select
                                name="languageOption"
                                value={formData.languageOption}
                                onChange={handleChange}
                                className="w-full p-2 bg-transparent border-b border-black text-gray-700 outline-none"
                            >
                                {commonLanguages.map(lang => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>
                            {formData.languageOption === 'Other' && (
                                <input
                                    type="text"
                                    name="customLanguage"
                                    value={formData.nativeLanguage}
                                    onChange={handleCustomLanguageChange}
                                    className="w-full mt-2 p-2 bg-transparent border-b border-black text-gray-700 placeholder-gray-500 outline-none"
                                    placeholder="Enter custom language.."
                                    required
                                />
                            )}
                        </div>
                    </div>
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
                            ) : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPatient;