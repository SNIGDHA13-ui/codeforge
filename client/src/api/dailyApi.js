import axios from "axios";

const API_BASE_URL = "http://localhost:5050/api";

export const getTodayChallenge = async () =>
  (await axios.get(`${API_BASE_URL}/daily/today`)).data;

export const getSubmissions = async () =>
  (await axios.get(`${API_BASE_URL}/daily/submissions`)).data;

export const submitSolution = async () =>
  (await axios.post(`${API_BASE_URL}/daily/submit`)).data;