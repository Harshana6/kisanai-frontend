import React, { useState } from 'react';
import { Link,useNavigate  } from 'react-router-dom';
import { FaLeaf, FaEye, FaEyeSlash, FaGoogle, FaEnvelope, FaLock, FaUser,FaCloudSun,FaChartLine } from 'react-icons/fa';
import API from "../api/axios";
import { toast } from "react-toastify";
import '../style/main.css';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

 if (formData.password !== formData.confirmPassword) {
  alert("Passwords do not match");
  return;
}

  try {
    const response = await API.post("/auth/register", {
      
  name: formData.fullName,
  email: formData.email,
  password: formData.password,
  role: formData.role,

    });

    const notify =()=> toast.success(response.data.message);
    notify();
    navigate("/login");

  } catch (error) {
    const notifyError = () =>toast.error(error.response?.data?.message || "Registration Failed");
    notifyError();
  }
};
const navigate = useNavigate();
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
            <p className="tagline">Join thousands of farmers using AI to transform agriculture.</p>
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

      {/* Right Side - Register Form */}
      <div className="auth-form-side">
        <div className="auth-card glass-card">
          {/* Mobile Logo */}
          <div className="mobile-logo d-lg-none text-center mb-4">
            <FaLeaf className="logo-icon-mobile" />
            <span className="app-name-mobile">KisanAI</span>
          </div>

          <div className="text-center mb-4">
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">Join KisanAI and start your smart farming journey.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label className="form-label">Full Name</label>
              <div className="input-group-custom">
                <span className="input-icon">
                  <FaUser />
                </span>
                <input
                  type="text"
                  name="fullName"
                  className="form-control custom-input"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Email</label>
              <div className="input-group-custom">
                <span className="input-icon">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  name="email"
                  className="form-control custom-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="form-label">Password</label>
                  <div className="input-group-custom">
                    <span className="input-icon">
                      <FaLock />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="form-control custom-input"
                      placeholder="Create password"
                      value={formData.password}
                      onChange={handleChange}
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
              </div>
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-group-custom">
                    <span className="input-icon">
                      <FaLock />
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      className="form-control custom-input"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Role</label>
              <select
                name="role"
                className="form-control custom-input custom-select"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select your role</option>
                <option value="farmer">Farmer</option>
                <option value="student">Student</option>
                <option value="researcher">Researcher</option>
                <option value="agriculture_officer">Agriculture Officer</option>
              </select>
            </div>

            <div className="form-check mb-4">
              <input
                type="checkbox"
                className="form-check-input custom-checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
              />
              <label className="form-check-label" htmlFor="agreeTerms">
                I agree to the{' '}
                <Link to="/terms" className="auth-link">
                  Terms & Privacy Policy
                </Link>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-custom w-100 mb-3">
              Create Account
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

            <button type="button" className="btn btn-google w-100 mb-3">
              <FaGoogle className="me-2" />
              Continue with Google
            </button>

            <p className="text-center auth-footer">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
