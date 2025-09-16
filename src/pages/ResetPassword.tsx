import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "@/assets/logo.jpg";
import Title from "@/assets/flowpane.png";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;
const ResetPassword = () => {
  const { token } = useParams(); // get token from URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      setMessage("Please fill out both fields.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/reset-password/${token}`,
        {
          password,
        }
      );
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000); // redirect to login
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center primary-gradient animate-fade-in p-6">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md overflow-hidden p-6">
        {/* Logo + Title */}
        <div className="flex items-center justify-center mb-6">
          <img src={Logo} alt="Logo" className="h-12 w-16 object-contain" />
          <img
            src={Title}
            alt="FlowBoostPanel"
            className="h-12 md:h-16 object-contain"
          />
        </div>

        <h2 className="text-xl text-center mb-6 text-gray-800">
          Reset Your Password
        </h2>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 border border-border/20 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 p-3 border border-border/20 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <button
          onClick={handleReset}
          className="w-full p-3 primary-gradient hover-glow text-white rounded mb-4"
        >
          Reset Password
        </button>

        {message && (
          <p className="text-sm text-center text-muted-foreground mb-4">
            {message}
          </p>
        )}

        <div className="text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-primary font-semibold hover:underline"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
