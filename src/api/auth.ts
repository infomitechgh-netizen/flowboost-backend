import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // backend auth URL
// Replace with your Railway backend URL

//const API_URL = process.env.REACT_APP_BACKEND_URL + "/api/auth";

// Get user profile
export const getUserProfile = async (token: string) => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const signupUser = async (name: string, email: string, password: string) => {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Signup failed");
  }

  return res.json();
};

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Login failed");
  }

  return res.json();
};
