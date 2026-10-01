import { NavLink } from "react-router-dom";
import {
  FaLeaf,
  FaTint,
  FaCloudSun,
  FaHistory,
  FaCog,
  FaHome,
  FaBars,
  FaTimes,
   FaUserCircle, FaSignOutAlt
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
const menuItems = [
  { path: "/dashboard", key: "dashboard", icon: FaHome },
  { path: "/leaf-doctor", key: "leafDoctor", icon: FaLeaf },
  { path: "/soil-consultant", key: "soilConsultant", icon: FaTint },
  { path: "/weather", key: "weather", icon: FaCloudSun },
  { path: "/settings", key: "settings", icon: FaCog },
];


function Sidebar({ collapsed, mobileOpen, onToggle }) {
  const navigate = useNavigate();
   const {t}=useTranslation();

// to get user
const { user } = useContext(UserContext);

  //  to handle log-out
   const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  navigate("/login");
};
  return (
    <>

      <div
        className={`sidebar ${collapsed ? "collapsed" : ""} ${
          mobileOpen ? "show" : ""
        }`}
      >
        <div className="sidebar-header">
          <div className="logo">
            <FaLeaf className="logo-icon" />
            {!collapsed && <span className="logo-text">KisanAI</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
               onClick={() => {
    if (window.innerWidth <= 767) {
      onToggle();
    }
  }}
            >
              <item.icon className="nav-icon" />
              {!collapsed && (
    <span className="nav-text">
        {t(`sidebar.${item.key}`)}
    </span>
)}
            </NavLink>
          ))}
        </nav>

        {!collapsed && (
          <div className="sidebar-footer">
  <div className="user-profile">
    <div className="user-avatar">
      <FaUserCircle />
    </div>

    {!collapsed && (
      <div className="user-info" >
        <h6>{user?.name}</h6>
        <small>{user?.role}</small>
      </div>
    )}
  </div>

  {!collapsed && (
    <button className="logout-btn" onClick={ handleLogout}>
      <FaSignOutAlt />
      <span>Logout</span>
    </button>
  )}
</div>
        )}
      </div>
    </>
  );
}

export default Sidebar;