import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import logo from "../assets/logo.jpg";
import "../styles/Login.css";
import { adminLogin } from "../services/adminService";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    if (!email.trim() || !isValidEmail(email)) {
      setMessageType("error");
      setMessage("Please provide a valid email address.");
      return;
    }

    if (!password.trim()) {
      setMessageType("error");
      setMessage("Password is required.");
      return;
    }

    setLoading(true);

    try {
      const result = await adminLogin(email, password);

      if (result.token) {
        localStorage.setItem("adminToken", result.token);
        localStorage.setItem("adminEmail", email.toLowerCase().trim());

        setMessageType("success");
        setMessage("Admin login successful. Redirecting to dashboard...");

        setTimeout(() => {
          navigate("/admin");
        }, 1200);
      }
    } catch (error: any) {
      setMessageType("error");
      setMessage(
        error?.response?.data?.message || "Admin login failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <img src={logo} alt="SwanCore Logo" className="login-logo" />
            <h1>Admin Login</h1>
            <p>Secure admin access only</p>
          </div>

          {message && (
            <div className={`login-alert ${messageType}`}>{message}</div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@swancore.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <FaSpinner className="spinner" /> Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="login-links">
            <p>
              Not an admin? <a href="/login" className="link">Go to user login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
