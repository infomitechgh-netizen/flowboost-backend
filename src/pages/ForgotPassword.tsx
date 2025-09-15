import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/logo.jpg";   
import Title from "@/assets/flowpane.png"; 
import axios from "axios";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


    const handleReset = async () => {
  if (!email) {
    setMessage("Please enter your email address.");
    return;
  }
   //setMessage("If this email is registered, you will receive reset instructions.");
  try {
    const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
    setMessage(res.data.message);
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
          <img src={Title} alt="FlowBoostPanel" className="h-12 md:h-16 object-contain" />
        </div>

        <h2 className="text-xl text-center mb-6 text-gray-800">
          Reset your password
        </h2>

        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border border-border/20 rounded-lg bg-white text-gray-800 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <button
          onClick={handleReset}
          className="w-full p-3 primary-gradient hover-glow text-white rounded mb-4"
        >
          Send Reset Link
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

export default ForgotPassword;
