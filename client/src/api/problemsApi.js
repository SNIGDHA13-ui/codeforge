import axios from "axios";

const API_BASE_URL = "http://localhost:5050/api";

export const getProblems = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const res = await axios.get(`${API_BASE_URL}/problems?${params}`);
  return res.data;
};

export const getProblemById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/problems/${id}`);
  return res.data;
};

export const createProblem = async (payload) => {
  const res = await axios.post(`${API_BASE_URL}/problems`, payload);
  return res.data;
};

export const updateProblem = async (id, payload) => {
  const res = await axios.put(`${API_BASE_URL}/problems/${id}`, payload);
  return res.data;
};

export const deleteProblem = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/problems/${id}`);
  return res.data;
};
