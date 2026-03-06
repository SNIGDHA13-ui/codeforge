import axios from "axios";

const API_BASE_URL = "http://localhost:5050/api";

const authHeaders = () => {
  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  const token = auth?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getTodayChallenge = async () =>
  (await axios.get(`${API_BASE_URL}/daily/today`, { headers: authHeaders() })).data;

export const getSubmissions = async () =>
  (await axios.get(`${API_BASE_URL}/daily/submissions`, { headers: authHeaders() })).data;

export const submitSolution = async () =>
  (await axios.post(`${API_BASE_URL}/daily/submit`, {}, { headers: authHeaders() })).data;