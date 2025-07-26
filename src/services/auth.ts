import axios from 'axios';

const API_URL = 'https://checkin-system-9dwb.vercel.app'; // Update with your backend base URL

export const register = async (userData: { email: string; password: string , name :string }) => {
  const res = await axios.post(`${API_URL}/auth/register`, userData);
  return res.data;
};

export const login = async (userData: { email: string; password: string }) => {
  const res = await axios.post(`${API_URL}/auth/login`, userData);
  return res.data;
};
