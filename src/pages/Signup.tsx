import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "@/assets/logo.jpg"; // ✅ logo image
import Title from "@/assets/flowpane.png"; // ✅ title image
const BASE_URL = process.env.REACT_APP_BACKEND_URL;
const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [emailError, setEmailError] = useState("");

  const [passwordError, setPasswordError] = useState("");

  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [phoneError, setPhoneError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    // Clear previous errors
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPhoneError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let hasError = false;

    if (!firstName.trim()) {
      setFirstNameError("First name is required");
      hasError = true;
    }
    if (!lastName.trim()) {
      setLastNameError("Last name is required");
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError("Email address is required");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid email format");
      hasError = true;
    }

    if (!phone.trim()) {
      setPhoneError("Phone number is required");
      hasError = true;
    } else if (!/^\+?[0-9]{7,15}$/.test(phone)) {
      setPhoneError("Invalid phone number");
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasError = true;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError("Please confirm your password");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;

      const res = await axios.post(`${BASE_URL}/api/auth/signup`, {
        name: fullName,
        email,
        phone,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center primary-gradient p-6 animate-fade-in">
      <div className="w-full max-w-sm md:max-w-md bg-white rounded-lg shadow-md overflow-hidden p-6">
        {/* Logo + Title inside the card */}
        <div className="flex items-center justify-center mb-0">
          <img src={Logo} alt="Logo" className="h-12 w-16 object-contain" />
          <img
            src={Title}
            alt="FlowBoostPanel"
            className="h-12 md:h-16 object-contain"
          />
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Card Title */}
        <h2 className="text-xl text-center mb-5 text-gray-800">
          Create your account
        </h2>

        {/* Input Full Name Field*/}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-1/2">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (firstNameError) setFirstNameError("");
              }}
              className="w-full mb-1 p-3 border border-border/20 rounded-lg bg-white text-gray-800 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {firstNameError && (
              <p className="text-red-500 text-sm mt-1">{firstNameError}</p>
            )}
          </div>

          <div className="w-full md:w-1/2">
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                if (lastNameError) setLastNameError("");
              }}
              className="w-full mb-1 p-3 border border-border/20 rounded-lg bg-white text-gray-800 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {lastNameError && (
              <p className="text-red-500 text-sm mt-1">{lastNameError}</p>
            )}
          </div>
        </div>

        {/* Input Email Address Field*/}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-3/4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              className="w-full mb-1 p-3 border border-border/20 rounded-lg bg-white text-gray-800 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          <div className="w-full md:w-2/4">
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (phoneError) setPhoneError("");
              }}
              className="w-full mb-1 p-3 border border-border/20 rounded-lg bg-white text-gray-800 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {phoneError && (
              <p className="text-red-500 text-sm mt-1">{phoneError}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-1/2">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError("");
              }}
              className="w-full p-3 border border-border/20 rounded-lg bg-white text-gray-800 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          <div className="w-full md:w-1/2">
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmPasswordError) setConfirmPasswordError("");
              }}
              className="w-full p-3 border border-border/20 rounded-lg bg-white text-gray-800 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {confirmPasswordError && (
              <p className="text-red-500 text-sm mt-1">
                {confirmPasswordError}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full p-3 primary-gradient hover-glow text-white rounded mb-4"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <p className="text-muted-foreground">
          By clicking the “Sign Up” button, you agree to FlowBoostPanel’s terms
          of acceptable use and Data Processing Agreement.
          <br />{" "}
        </p>
        <p className="mt-4 text-center text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="text-primary font-semibold">
            Login
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

export default Signup;
