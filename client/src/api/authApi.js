import axios from "axios";

const API_BASE_URL = "http://localhost:5050/api";

export const loginApi = async (payload) => {
  const res = await axios.post(`${API_BASE_URL}/users/login`, payload);
  return res.data;
};

export const registerApi = async (payload) => {
  const res = await axios.post(`${API_BASE_URL}/users/register`, payload);
  return res.data;
};

export const forgotPasswordApi = async (email) => {
  const res = await axios.post(`${API_BASE_URL}/users/forgot-password`, { email });
  return res.data;
};

export const resetPasswordApi = async (token, newPassword) => {
  const res = await axios.post(`${API_BASE_URL}/users/reset-password`, { token, newPassword });
  return res.data;
};