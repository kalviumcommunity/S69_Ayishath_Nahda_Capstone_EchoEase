// src/service/TherapyPlanService.js
import axios from 'axios';
import { authHeader } from './authHeader';

const API_URL = 'http://localhost:5000/api/therapyPlans'; // Use full URL in development

class TherapyPlanService {
  // Generate a therapy plan template
  generateTherapyPlan(diagnosis, age, language = 'en') {
    return axios.post(
      `${API_URL}/generate`,
      { diagnosis, age, language },
      { headers: authHeader() }
    );
  }

  // Create a new therapy plan for a patient
  createTherapyPlan(patientId) {
    return axios.post(
      API_URL,
      { patientId },
      { headers: authHeader() }
    );
  }

  // Get therapy plan by patient ID
  getTherapyPlanByPatientId(patientId) {
    return axios.get(
      `${API_URL}/patient/${patientId}`,
      { headers: authHeader() }
    );
  }

  // Update an existing therapy plan
  updateTherapyPlan(planId, updateData) {
    return axios.put(
      `${API_URL}/${planId}`,
      updateData,
      { headers: authHeader() }
    );
  }
}

export default new TherapyPlanService();