import { Routes, Route,useLocation } from "react-router-dom";
import { useState ,useEffect} from "react";
import { FaTimes } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import { FaBars } from "react-icons/fa";
import Dashboard from "./pages/Dashboard";
import LeafDoctor from "./pages/LeafDoctor";
import SoilConsultant from "./pages/SoilConsultant";
import Weather from "./pages/Weather";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
 const [darkMode, setDarkMode] = useState(() => {

  return localStorage.getItem("theme") === "dark"

})
useEffect(() => {

  localStorage.setItem(
    "theme",
    darkMode ? "dark" : "light"
  )

}, [darkMode])
const location = useLocation();

const hideSidebar =
  location.pathname === "/login" ||location.pathname === "/register"|| location.pathname === "/";

  const handleSidebarToggle = () => {
    if (window.innerWidth <= 767) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className={`app-container ${darkMode ? "dark-theme" : ""}`}>
       {/* Mobile Top Bar */}
    {!hideSidebar && (
  <header className="mobile-header">
    <button
      className="mobile-toggle"
      onClick={handleSidebarToggle}
    >
      {mobileOpen ? <FaTimes /> : <FaBars />}
    </button>
  </header>
)}
      {!hideSidebar && (
  <Sidebar
    collapsed={sidebarCollapsed}
    mobileOpen={mobileOpen}
    onToggle={handleSidebarToggle}
  />
)}

      <div className={
    hideSidebar
      ? "auth-content"
      : `main-content ${sidebarCollapsed ? "expanded" : ""}`
  }>
        
        <Routes>
            {/* <Route path="/" element={<Login />} /> */}
           <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaf-doctor" element={<LeafDoctor />} />
          <Route path="/soil-consultant" element={<SoilConsultant />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/settings" element={<Settings darkMode={darkMode}
      setDarkMode={setDarkMode}/>} />
          </Route>
          
        </Routes>
      </div>
      <ToastContainer />
    </div>
    
  );
}

export default App;