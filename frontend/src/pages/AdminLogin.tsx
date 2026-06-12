import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { adminLogin } from "../services/adminService";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        if (result.refreshToken) {
          localStorage.setItem("adminRefreshToken", result.refreshToken);
        }
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
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--bg, #0B0E11)',
      fontFamily: "'Inter', sans-serif",
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
        }}>
          <img
            src={logo}
            alt="SwanCore Logo"
            style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'contain', background: '#0b0e11', padding: 4 }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2 }}>
            <span style={{ color: '#ffffff', fontSize: 22, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>SwanCore</span>
            <span style={{ color: '#94a3b8', fontSize: 11 }}>Simplified Trading</span>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'var(--text-primary, #f8fafc)', fontSize: 24, fontWeight: 700, margin: 0 }}>Admin Login</h1>
          <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: 13, margin: '6px 0 0 0' }}>Secure admin access only</p>
        </div>

        {message && (
          <div style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 8,
            fontSize: 13,
            textAlign: 'center',
            background: messageType === 'error' ? 'rgba(246,70,93,0.12)' : 'rgba(14,203,129,0.12)',
            color: messageType === 'error' ? '#f6465d' : '#0ecb81',
            border: `1px solid ${messageType === 'error' ? 'rgba(246,70,93,0.3)' : 'rgba(14,203,129,0.3)'}`,
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary, #f8fafc)' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@swancore.com"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid var(--border, #1e293b)',
                background: 'var(--surface, #1E2329)',
                color: 'var(--text-primary, #f8fafc)',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary, #f8fafc)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid var(--border, #1e293b)',
                background: 'var(--surface, #1E2329)',
                color: 'var(--text-primary, #f8fafc)',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 10,
              border: 'none',
              background: '#ff8c32',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: '4px',
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: 13, margin: 0 }}>
          Not an admin? <a href="/login" style={{ color: '#ff8c32', textDecoration: 'none', fontWeight: 600 }}>Go to user login</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
