// src/services/api.ts
const API_BASE = 'https://checkin-system-9dwb.vercel.app'; // Nest backend URL

export const register = async (email: string, password: string , name:string) => {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password , name }),
  });

  if (!response.ok) throw new Error('Registration failed');
  return await response.json(); // returns { access_token }
};

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error('Login failed');
  return await response.json(); // returns { access_token }
};
