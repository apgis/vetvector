import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"; // Backend URL from .env
const PREDICTION_API_URL = process.env.REACT_APP_AI_URL || "http://localhost:8000"; // AI Prediction API URL

// Function to add a new disease
export const addDisease = async (diseaseData, setLoading) => {
    try {
        setLoading(true); // Show loading indicator
        const response = await axios.post(`${API_URL}/add-disease`, diseaseData);
        return response.data;
    } catch (error) {
        console.error("Error adding disease:", error.response?.data || error.message);
        return { error: "Failed to add disease. Please try again." };
    } finally {
        setLoading(false); // Hide loading indicator
    }
};

// Function to get all diseases
export const getDiseases = async (setLoading) => {
    try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/diseases`);
        return response.data;
    } catch (error) {
        console.error("Error fetching diseases:", error.response?.data || error.message);
        return { error: "Failed to fetch diseases." };
    } finally {
        setLoading(false);
    }
};

// Function to predict disease using AI

export const predictDisease = async (symptoms) => {
    try {
        const response = await axios.post("http://localhost:5000/api/predict", { symptoms }); // ✅ Correct port
        return response.data;
    } catch (error) {
        console.error("Error predicting disease:", error);
        return { error: "Failed to predict disease" };
    }
};
