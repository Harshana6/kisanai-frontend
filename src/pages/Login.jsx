import React, { useState } from 'react';
import { Link,useNavigate  } from 'react-router-dom';
import { FaLeaf, FaEye, FaEyeSlash, FaGoogle, FaEnvelope, FaLock, FaUser,FaCloudSun,FaChartLine } from 'react-icons/fa';
import API from "../api/axios";
import { toast } from "react-toastify";
import '../style/main.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
const navigate = useNavigate();
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await API.post("/auth/login", {
      email,
      password,
    });

    console.log(response.data);

    // Save JWT Token
    localStorage.setItem("token", response.data.token);

    // Save User Details
    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

const notify = () => toast.success("Login Successful!");
notify();
    navigate("/dashboard");

  } catch (error) {
    const notifyError = () => toast.error(error.response?.data?.message || "Login Failed");
  }
};

  return (
    <div className="auth-container">
      {/* Left Side - Illustration */}
      <div className="auth-illustration d-none d-lg-flex">
        <div className="illustration-overlay">
          <div className="illustration-content">
            <div className="logo-large">
              <FaLeaf className="logo-icon" />
            </div>
            <h1 className="app-name">KisanAI</h1>
            <p className="tagline">AI-powered farming assistant for smarter agriculture.</p>
            <div className="illustration-features">
                         <div className="feature-item">
                           <div className="feature-icon"><FaLeaf /> AI Disease Detection</div>
                           <span>Detect 50+ crop diseases instantly.</span>
                         </div>
                         <div className="feature-item">
                           <div className="feature-icon"><FaCloudSun /> Live Weather Forecast</div>
                           <span>Plan irrigation with accurate forecasts.</span>
                         </div>
                         <div className="feature-item">
                           <div className="feature-icon"><FaChartLine />Farm Analytics</div>
                           <span>Track all your reports in one place.</span>
                         </div>
                       </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="auth-form-side">
        <div className="auth-card glass-card">
          {/* Mobile Logo */}
          <div className="mobile-logo d-lg-none text-center mb-4">
            <FaLeaf className="logo-icon-mobile" />
            <span className="app-name-mobile">KisanAI</span>
          </div>

          <div className="text-center mb-4">
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Login to continue to your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label className="form-label">Email</label>
              <div className="input-group-custom">
                <span className="input-icon">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  className="form-control custom-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Password</label>
              <div className="input-group-custom">
                <span className="input-icon">
                  <FaLock />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control custom-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input custom-checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  Remember Me
                </label>
              </div>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn btn-primary btn-custom w-100 mb-3">
              Login
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

            <button type="button" className="btn btn-google w-100 mb-3">
              <FaGoogle className="me-2" />
              Continue with Google
            </button>

            <p className="text-center auth-footer">
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
