import axios from "axios";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;
export const fetchUserProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get( `${BASE_URL}/api/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.user; // match the backend key
};
