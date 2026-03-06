import axios from "axios";

const API_BASE_URL = "http://localhost:5050/api";

const authHeaders = () => {
  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  const token = auth?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getProblems = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const url = params ? `${API_BASE_URL}/problems?${params}` : `${API_BASE_URL}/problems`;
    const res = await axios.get(url, { headers: authHeaders() });
    return res.data;
  } catch (e) {
    console.error("getProblems error:", e);
    return [];
  }
};

export const getProblemById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/problems/${id}`, { headers: authHeaders() });
  return res.data;
};

export const createProblem = async (payload) =>
  (await axios.post(`${API_BASE_URL}/problems`, payload, { headers: authHeaders() })).data;

export const updateProblem = async (id, payload) =>
  (await axios.put(`${API_BASE_URL}/problems/${id}`, payload, { headers: authHeaders() })).data;

export const deleteProblem = async (id) =>
  (await axios.delete(`${API_BASE_URL}/problems/${id}`, { headers: authHeaders() })).data;