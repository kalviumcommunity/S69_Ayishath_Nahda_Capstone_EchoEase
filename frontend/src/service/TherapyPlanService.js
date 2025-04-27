import axios from "axios";

const API_URL = `${import.meta.env.VITE_META_URI}/api/therapy-plans`;

export const getTherapyPlan = async (patientId) => {
  try {
    const response = await axios.get(`${API_URL}/patient/${patientId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.data || !response.data.data) {
      throw new Error("No therapy plan data received");
    }
    return response.data.data;
  } catch (error) {
    console.error("Error fetching therapy plan:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch therapy plan");
  }
};

export const createTherapyPlan = async (patientData) => {
  try {
    const response = await axios.post(API_URL, patientData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.data || !response.data.data) {
      throw new Error("No therapy plan data received");
    }
    return response.data.data;
  } catch (error) {
    console.error("Error generating therapy plan:", error);
    throw new Error(error.response?.data?.message || "Failed to generate therapy plan");
  }
};