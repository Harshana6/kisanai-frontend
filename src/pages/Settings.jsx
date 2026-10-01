import { useState ,useEffect} from 'react'
import { FaUser, FaBell, FaGlobe, FaShieldAlt, FaSave, FaPalette } from 'react-icons/fa'
import i18n from "../i18n";
import axios from "axios";
import API from "../api/axios";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function Settings({ darkMode, setDarkMode }) {
  const {t}=useTranslation();
  const { user, setUser } = useContext(UserContext);
  const [settings, setSettings] = useState({
    profile: {
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@farm.com',
      phone: '+91 98765 43210',
      farmName: 'Green Valley Farm',
      location: 'Pune, Maharashtra',
      farmSize: '25 acres',
      role:"farmer"
    },
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      diseaseAlerts: true,
      weatherAlerts: true,
      weeklyReports: false,
    },
    preferences: {
      language: 'english',
      temperatureUnit: 'celsius',
      measurementUnit: 'metric',
      theme: darkMode ? "dark" : "light",
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
    },
  })
  // for change password
const [passwordData, setPasswordData] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const [passwordError, setPasswordError] = useState("");
const [passwordSuccess, setPasswordSuccess] = useState("");
const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false)

//  for modal controll
const [showModal, setShowModal] = useState(false);

  useEffect(() => {
  fetchSettings();
}, []);

const fetchSettings = async () => {
  try {
    const token = localStorage.getItem("token");

   const res = await API.get("/settings");

    const data = res.data;

    setSettings((prev) => ({
      ...prev,

      profile: {
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        farmName: data.farm_name || "",
        location: data.location || "",
        farmSize: data.farm_size || "",
         role: data.role,
      },

      notifications: {
        emailAlerts: Boolean(data.email_notifications),
        pushNotifications: Boolean(data.push_notifications),
        diseaseAlerts: Boolean(data.disease_alerts),
        weatherAlerts: Boolean(data.weather_alerts),
        weeklyReports: Boolean(data.weekly_reports),
      },
    }));
  } catch (error) {
    console.log(error);
  }
};

  const handleProfileChange = (field, value) => {
    setSettings({
      ...settings,
      profile: { ...settings.profile, [field]: value },
    })
  }

  const handleNotificationChange = (field) => {
    setSettings({
      ...settings,
      notifications: { ...settings.notifications, [field]: !settings.notifications[field] },
    })
  }

  const handlePreferenceChange = (field, value) => {

  setSettings(prev => ({
    ...prev,
    preferences: {
      ...prev.preferences,
      [field]: value,
    },
  }))
    if (field === "language") {
    i18n.changeLanguage(value);
    localStorage.setItem("language", value);
  }

  if (field === "theme") {

    if (value === "dark") {
      setDarkMode(true)
    }

    else if (value === "light") {
      setDarkMode(false)
    }

    else {
      // Auto
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setDarkMode(prefersDark)
    }

  }

}

  const handleSecurityChange = (field, value) => {
    setSettings({
      ...settings,
      security: { ...settings.security, [field]: value },
    })
  }

const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");

   await API.put("/settings", {
  name: settings.profile.name,
  phone: settings.profile.phone,
  farm_name: settings.profile.farmName,
  location: settings.profile.location,
  farm_size: settings.profile.farmSize,

  email_notifications: settings.notifications.emailAlerts,
  push_notifications: settings.notifications.pushNotifications,
  disease_alerts: settings.notifications.diseaseAlerts,
  weather_alerts: settings.notifications.weatherAlerts,
  weekly_reports: settings.notifications.weeklyReports,
});
const updatedUser = {
  ...user,
  name: settings.profile.name,
  role: settings.profile.role,
};

setUser(updatedUser);

localStorage.setItem(
  "user",
  JSON.stringify(updatedUser)
);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  } catch (error) {
    console.log(error);
  }
};
const handleChangePassword = async () => {
  setPasswordError("");
  setPasswordSuccess("");

  if (
    passwordData.newPassword !==
    passwordData.confirmPassword
  ) {
    setPasswordError("Passwords do not match");
    return;
  }

  if (passwordData.newPassword.length < 6) {
    setPasswordError(
      "Password must be at least 6 characters"
    );
    return;
  }

  try {
    setLoading(true);

    await API.put("/settings/change-password", {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });

    setPasswordSuccess(
      "Password changed successfully!"
    );
 
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
setTimeout(() => {
  setShowModal(false);
}, 1200);
    setLoading(false);

  } catch (error) {

    setLoading(false);

    setPasswordError(
      error.response?.data?.message ||
      "Something went wrong"
    );
  }
};
  return (
    <div className="settings-page fade-in">
      <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <h1 className="page-title">{t("settings.title")}</h1>
          <p className="page-subtitle">{t("settings.subtitle")}</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <FaSave className="me-2" />
          {t("settings.save")}
        </button>
      </div>

      {saved && (
        <div className="alert alert-success mb-4">
          {t("settings.saved")}
        </div>
      )}

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <FaUser className="me-2 text-success" />
                {t("settings.profile")}
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">{t("settings.fullName")}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">{t("settings.email")}</label>
                  <input
  type="email"
  className="form-control"
  value={settings.profile.email}
  readOnly
/>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">{t("settings.phone")}</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={settings.profile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">{t("settings.farmName")}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.profile.farmName}
                    onChange={(e) => handleProfileChange('farmName', e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">{t("settings.location")}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.profile.location}
                    onChange={(e) => handleProfileChange('location', e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">{t("settings.farmSize")}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.profile.farmSize}
                    onChange={(e) => handleProfileChange('farmSize', e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-6">
  <label className="form-label">{t("settings.role")}</label>

  <input
    type="text"
    className="form-control"
    value={settings.profile.role}
    readOnly
  />
</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <FaBell className="me-2 text-warning" />
               {t("settings.notifications")}
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <label className="form-label mb-0">{t("settings.emailAlerts")}</label>
                    <small className="text-muted d-block">{t("settings.receiveEmailNotifications")}</small>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={settings.notifications.emailAlerts}
                      onChange={() => handleNotificationChange('emailAlerts')}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <label className="form-label mb-0">{t("settings.pushNotifications")}</label>
                    <small className="text-muted d-block">{t("settings.browserPushAlerts")}</small>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={settings.notifications.pushNotifications}
                      onChange={() => handleNotificationChange('pushNotifications')}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <label className="form-label mb-0">{t("settings.diseaseAlerts")}</label>
                    <small className="text-muted d-block">{t("settings.immediateDiseaseWarnings")}</small>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={settings.notifications.diseaseAlerts}
                      onChange={() => handleNotificationChange('diseaseAlerts')}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <label className="form-label mb-0">{t("settings.weatherAlerts")}</label>
                    <small className="text-muted d-block">{t("settings.severeWeatherWarnings")}</small>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={settings.notifications.weatherAlerts}
                      onChange={() => handleNotificationChange('weatherAlerts')}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <label className="form-label mb-0">{t("settings.weeklyReports")}</label>
                    <small className="text-muted d-block">{t("settings.weeklySummaryReports")}</small>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={settings.notifications.weeklyReports}
                      onChange={() => handleNotificationChange('weeklyReports')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <FaGlobe className="me-2 text-primary" />
                {t("settings.regionalPreferences")}
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">{t("settings.language")}</label>
                  <select
                    className="form-select"
                    value={settings.preferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  >
                    <option value="en">English</option>
<option value="hi">हिन्दी</option>
<option value="gu">ગુજરાતી</option>
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">{t("settings.temperatureUnit")}</label>
                  <select
                    className="form-select"
                    value={settings.preferences.temperatureUnit}
                    onChange={(e) => handlePreferenceChange('temperatureUnit', e.target.value)}
                  >
                    <option value="celsius">Celsius</option>
                    <option value="fahrenheit">Fahrenheit</option>
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">{t("settings.measurementSystem")}</label>
                  <select
                    className="form-select"
                    value={settings.preferences.measurementUnit}
                    onChange={(e) => handlePreferenceChange('measurementUnit', e.target.value)}
                  >
                    <option value="metric">Metric (kg, meters)</option>
                    <option value="imperial">Imperial (lbs, feet)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <FaPalette className="me-2 text-info" />
                {t("settings.appearance")}
              </h5>
            </div>
            <div className="card-body">
              <label className="form-label">{t("settings.theme")}</label>
              <div className="d-flex gap-2 flex-wrap">
                <button
                  className={`btn ${settings.preferences.theme === 'light' ? 'btn-success' : 'btn-outline-secondary'}`}
                  onClick={() => handlePreferenceChange('theme', 'light')}
                >
                 {t("settings.light")}
                </button>
                <button
                  className={`btn ${settings.preferences.theme === 'dark' ? 'btn-success' : 'btn-outline-secondary'}`}
                  onClick={() => handlePreferenceChange('theme', 'dark')}
                >
                 {t("settings.dark")}
                </button>
                <button
                  className={`btn ${settings.preferences.theme === 'auto' ? 'btn-success' : 'btn-outline-secondary'}`}
                  onClick={() => handlePreferenceChange('theme', 'auto')}
                >
                  {t("settings.auto")}
                </button>
              </div>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <FaShieldAlt className="me-2 text-danger" />
                 {t("settings.security")}
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column gap-3">
               <button
  className="btn btn-outline-danger btn-sm"
 onClick={() => {
    setPasswordError("");
    setPasswordSuccess("");
    setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    setShowModal(true);
}}
>
  Change Password
</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        showModal &&(
          <div
  className="modal fade show"
      style={{ display: "block" }}
      tabIndex="-1"
>
  <div className="modal-dialog">
    <div className="modal-content">

      <div className="modal-header">
        <h5 className="modal-title">
          Change Password
        </h5>

        <button
          type="button"
          className="btn-close"
          onClick={() => setShowModal(false)}
        ></button>
      </div>

      <div className="modal-body">

        {passwordError && (
          <div className="alert alert-danger">
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div className="alert alert-success">
            {passwordSuccess}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">
            Current Password
          </label>

          <input
            type="password"
            className="form-control"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                currentPassword: e.target.value,
              })
            }
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            New Password
          </label>

          <input
            type="password"
            className="form-control"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                newPassword: e.target.value,
              })
            }
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            Confirm Password
          </label>

          <input
            type="password"
            className="form-control"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                confirmPassword: e.target.value,
              })
            }
          />
        </div>

      </div>

      <div className="modal-footer">

        <button
          type="button"
          className="btn btn-secondary"
            onClick={() => setShowModal(false)}
        >
          Cancel
        </button>

        <button
          className="btn btn-success"
          onClick={handleChangePassword}
          disabled={loading}
        >
          {loading ? "Updating..." : "Change Password"}
        </button>

      </div>

    </div>
  </div>
</div>
        )
      }
      
    </div>
  )
}

export default Settings
