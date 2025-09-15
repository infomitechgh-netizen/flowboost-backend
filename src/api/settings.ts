// src/api/settings.ts
import axios from "axios";

// --------- Admin API ---------
export const fetchAdminSettings = async () => {
  const res = await axios.get("/api/admin/settings");
  return res.data;
};

export const saveAdminSettings = async (settings: any) => {
  const res = await axios.post("/api/admin/settings", settings);
  return res.data;
};

// --------- User API ---------
export const fetchUserSettings = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("/api/user/settings", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const saveUserSettings = async (settings: any) => {
  const token = localStorage.getItem("token");
  const res = await axios.post("/api/users/settings", settings, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
