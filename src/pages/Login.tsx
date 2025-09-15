import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import Logo from "@/assets/logo.jpg"; // ✅ logo image
import Title from "@/assets/flowpane.png"; // ✅ title image

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      const { token, role, user } = res.data;

      // Store token and role in localStorage
      localStorage.setItem("user_id", user.id);
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", user.email);
      localStorage.setItem("balance", user.balance); // <-- add this

      toast({
        title: "Login Successful",
        description: "Welcome back to FlowBoostPanel!",
        variant: "success",
      });

      // Navigate based on role
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center primary-gradient p-6 animate-fade-in">
      {/* Login Card */}
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md overflow-hidden p-6">
        {/* Logo + Title inside the card */}
        <div className="flex items-center justify-center mb-6">
          <img src={Logo} alt="Logo" className="h-12 w-16 object-contain" />
          <img
            src={Title}
            alt="FlowPanel"
            className="h-12 md:h-16 object-contain"
          />
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Card Title */}
        <h2 className="text-xl text-center mb-6 text-gray-800">
          Log in to your account
        </h2>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border border-border/20 rounded-lg bg-white text-gray-800 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-2 p-3 border border-border/20 rounded-lg bg-white text-gray-800 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Forgot Password link */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-primary font-semibold hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full p-3 primary-gradient hover-glow text-white rounded mb-4"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-primary font-semibold">
            Sign Up
          </a>
        </p>

        {/* Back to Hero page */}
        <div className="mt-4 text-center mb-4">
          <button
            onClick={() => navigate("/")}
            className="text-primary font-semibold hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
