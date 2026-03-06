import axios from "axios";

const API_BASE_URL = "http://localhost:5050/api";

export const getStats = async () => (await axios.get(`${API_BASE_URL}/stats`)).data;
export const updateProfile = async (payload) =>
  (await axios.put(`${API_BASE_URL}/stats/profile`, payload)).data;
export const markTodayActive = async (solvedInc = 1) =>
  (await axios.post(`${API_BASE_URL}/stats/activity`, { solvedInc })).data;
