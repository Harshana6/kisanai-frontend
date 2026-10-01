import { FaLeaf, FaTint, FaCloudSun, FaSeedling, FaBug, FaChartLine,FaWind } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import AIRecommendation from '../components/AIRecommendationCard'
import { useTranslation } from "react-i18next";
import { getWeather } from "../services/weatherService";
import i18n from "../i18n";
import { useContext,useState,useEffect } from 'react';
import AskAIModal from "../components/AskAIModal";
import { saveActivity } from "../utils/activityLogger";
import { useLocation } from "react-router-dom";
import {
LineChart,
Line,
ResponsiveContainer,
XAxis,
YAxis,
Tooltip
} from "recharts";

import { getCropHealthHistory } from "../utils/chartData";
function Dashboard() {
  const {t}=useTranslation();
  const [weather, setWeather] = useState(null);
  const [showAI, setShowAI] = useState(false);
const [result, setResult] = useState(null);
const [initialQuestion, setInitialQuestion] = useState("");
const [recentActivities, setRecentActivities] = useState([]);
  useEffect(() => {

    const loadWeather = async () => {
        try {
            const data = await getWeather(i18n.language);
            setWeather(data);
        } catch (err) {
            console.log(err);
        }
    };

    loadWeather();

}, []);
  const stats = weather
  ? [
      {
        icon: FaCloudSun,
        value: `${Math.round(weather.current.main.temp)}°C`,
        label: "Temperature",
        color: "info",       // instead of blue
      },
      {
        icon: FaTint,
        value: `${weather.current.main.humidity}%`,
        label: "Humidity",
        color: "success",    // instead of green
      },
      {
        icon: FaWind,
        value:`${Math.round(weather.current.wind.speed)} km/h`,
        label: "Wind Speed",
        color: "warning",    // instead of orange
      },
      {
        icon: FaBug,
        value: weather.ai.diseaseRisk.risk,
        label: "Disease Risk",
        color:
          weather.ai.diseaseRisk.risk === "High"
            ? "danger"
            : weather.ai.diseaseRisk.risk === "Medium"
            ? "warning"
            : "success",
      },
    ]
  : [];

 const location = useLocation();

useEffect(() => {
  setRecentActivities(
    JSON.parse(localStorage.getItem("activities")) || []
  );
}, [location]);

// chart data
const chartData = getCropHealthHistory();

  return (
    <>
    <AskAIModal
    show={showAI}
    onClose={() => setShowAI(false)}
    diagnosis={result}
    language={localStorage.getItem("language") || "English"}
    initialQuestion={initialQuestion}
/>
    <div className="dashboard fade-in">
      <div className="page-header">
        <h1 className="page-title">{t("dashboard.title")}</h1>
        <p className="page-subtitle">🌱 {t("dashboard.goodMorning")}</p>
      </div>
    <AIRecommendation weather={weather}></AIRecommendation>
      <div className="row g-4 my-xl-4 my-lg-3 my-md-2 ">
        {stats.map((stat, index) => (
          <div className="col-12 col-sm-6 col-xl-3" key={index}>
            <div className={`stat-card ${stat.color}`}>
              <stat.icon className="stat-icon" />
              <div><div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div></div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4 mt-xl-0 mt-2">
        <div className="col-12 col-lg-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">{t("dashboard.quickActions")}</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <Link to="/leaf-doctor" className="text-decoration-none">
                    <div className="d-flex align-items-center p-3 bg-light rounded-3 hover-shadow">
                      <div className="rounded-circle bg-success p-3 me-3">
                        <FaLeaf className="text-white" size={24} />
                      </div>
                      <div>
                        <h6 className="mb-1 text-dark">{t("dashboard.scanNow")}</h6>
                        <small className="text-muted">Upload leaf image for analysis</small>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-12 col-md-6">
                  <Link to="/soil-consultant" className="text-decoration-none">
                    <div className="d-flex align-items-center p-3 bg-light rounded-3 hover-shadow">
                      <div className="rounded-circle bg-warning p-3 me-3">
                        <FaTint className="text-white" size={24} />
                      </div>
                      <div>
                        <h6 className="mb-1 text-dark">{t("dashboard.soilAnalysis")}</h6>
                        <small className="text-muted">Get soil health recommendations</small>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-12 col-md-6">
                  <Link to="/weather" className="text-decoration-none">
                    <div className="d-flex align-items-center p-3 bg-light rounded-3 hover-shadow">
                      <div className="rounded-circle bg-info p-3 me-3">
                        <FaCloudSun className="text-white" size={24} />
                      </div>
                      <div>
                        <h6 className="mb-1 text-dark">{t("dashboard.weatherForecast")}</h6>
                        <small className="text-muted">7-day agricultural forecast</small>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-center p-3 bg-light rounded-3 hover-shadow cursor-pointer">
                    <div className="rounded-circle bg-primary p-3 me-3">
                      <FaSeedling className="text-white" size={24} />
                    </div>
                    <div style={{cursor:"pointer"}} onClick={() => {

        setResult({

            prompt: `
You are an experienced agriculture expert.

Farmer Location:
${weather?.location}

Current Weather:
Temperature: ${weather?.current?.main?.temp}°C
Humidity: ${weather?.current?.main?.humidity}%
Wind Speed: ${weather?.current?.wind?.speed} km/h
Condition: ${weather?.current?.weather?.[0]?.description}

Disease Risk:
${weather?.ai?.diseaseRisk?.risk}

Based on today's conditions:

1. Recommend the best crops to grow.

2. Explain why these crops are suitable.

3. Mention which crops should be avoided.

4. Give irrigation advice.

5. Mention disease precautions if necessary.

Keep the answer simple for farmers.
`

        });

        const lang = localStorage.getItem("language");

setInitialQuestion(
  lang === "gu"
    ? "આજના હવામાન અને મારા સ્થાન પ્રમાણે આજે કયો પાક ઉગાડવો જોઈએ?"
    : lang === "hi"
    ? "आज के मौसम और मेरे स्थान के अनुसार मुझे कौन सी फसल उगानी चाहिए?"
    : "Which crop should I cultivate today based on my location and weather?"
);

        setShowAI(true);

    }}>
                      <h6 className="mb-1 text-dark">{t("dashboard.cropRecommendation")}</h6>
                      <small className="text-muted">AI-powered suggestions</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">{t("dashboard.recentActivities")}</h5>
            </div>
          <div className="card-body p-0 activity-list">
  <div className="list-group list-group-flush">

    {recentActivities.length === 0 ? (

      <div className="text-center py-5 text-muted">
        No recent activities
      </div>

    ) : (

      recentActivities.map((activity, index) => (

        <div
          key={index}
          className="list-group-item px-3 py-3"
        >
          <div className="d-flex justify-content-between align-items-start">

            <div>

              <p className="mb-1 fw-medium">
                {activity.title}
              </p>

              <small className="text-muted">

                {activity.crop && (
                  <>Crop: {activity.crop}</>
                )}

                {activity.field && (
                  <>Field: {activity.field}</>
                )}

                {activity.location && (
                  <>Location: {activity.location}</>
                )}

              </small>

            </div>

            <span
              className={`badge bg-${
                activity.status === "healthy"
                  ? "success"
                  : activity.status === "moderate"
                  ? "warning"
                  : "danger"
              }`}
            >
              {activity.status}
            </span>

          </div>

          <small className="text-muted">
            {activity.date}
          </small>

        </div>

      ))

    )}

  </div>
</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <FaChartLine className="me-2" />
                {t("dashboard.cropHealthTrends")}
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>

<LineChart data={chartData}>

<XAxis dataKey="day"/>

<YAxis/>

<Tooltip/>

<Line
type="monotone"
dataKey="confidence"
stroke="#16a34a"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <FaBug className="me-2" />
               {t("dashboard.activeAlerts")}
              </h5>
            </div>
            <div className="card-body">
              <ul className="feature-list">

{weather?.ai?.alerts?.map((alert,index)=>(

<li key={index}>

<span className="badge bg-warning">

Warning

</span>

<span>

{alert.title}

</span>

</li>

))}

</ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Dashboard
