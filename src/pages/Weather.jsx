import { FaCloudSun, FaCloudRain, FaTint,
  FaWind,
  FaSun,
  FaBug } from 'react-icons/fa'
import { useTranslation } from "react-i18next";
import { getWeather } from "../services/weatherService";
import { useEffect, useState } from "react";
import i18n from "../i18n";
import { BiLoaderAlt } from "react-icons/bi";
function Weather() {
 
const {t}=useTranslation();
  
const [weather, setWeather] = useState(null);

const [loading, setLoading] = useState(true);

// to load data automatic
const loadWeather = async () => {

    try{

        setLoading(true);

        const data = await getWeather(i18n.language);

        setWeather(data);
        saveActivity({

    type:"weather",

    title:"Weather Forecast Updated",

    location:data.location,

    status:"healthy"

});

    }
    catch(err){

        console.log(err);

    }
    finally{

        setLoading(false);

    }

};
useEffect(() => {

loadWeather();

},[]);
if(loading){

return(

<div className="text-center mt-5">
  {/* Dynamic Keyframe Injection to guarantee rendering behavior */}
      <style>{`
        @keyframes customGlobalSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .force-spin-icon {
          animation: customGlobalSpin 1.1s linear infinite !important;
          display: inline-block !important;
        }
      `}</style>
 <BiLoaderAlt className="text-success mb-3 force-spin-icon" size={55} />
<h4>Loading Weather...</h4>

</div>

)
}
if (!weather) {
  return (
    <div className="text-center mt-5">
      <h4>Unable to load weather data.</h4>
    </div>
  );
}
  return (
    <div className="weather-page fade-in">
      <div className="page-header">
        <h1 className="page-title">{t("weather.title")}</h1>
        <p className="page-subtitle">{t("weather.subtitle")}</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-6">
          <div className="weather-card">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <p className="mb-1 opacity-75">{weather.location}</p>
               <p className="mb-2 small opacity-50">
  {t("airecommedationcard.lastUpdated")}: {new Date().toLocaleTimeString()}
</p>
              </div>
              <FaCloudSun size={48} className="opacity-50" />
            </div>
            <div className="my-4">
  <div className="weather-temp">
    {Math.round(weather.current.main.temp)}°C
  </div>

  <div className="weather-desc">
    {weather.current.weather[0].description}
  </div>
</div>
            <div className="row g-3 mt-3">
              <div className="col-4">
                <div className="text-center">
                  <FaTint className="mb-2" />
                  <div className="fs-5 fw-bold">{weather.current.main.humidity}%</div>
                  <small className="opacity-75">{t("weather.humidity")}</small>
                </div>
              </div>
              <div className="col-4">
                <div className="text-center">
                  <FaWind className="mb-2" />
                  <div className="fs-5 fw-bold">{weather.current.main.wind_speed} km/h</div>
                  <small className="opacity-75">{t("weather.wind")}</small>
                </div>
              </div>
              <div className="col-4">
                <div className="text-center">
                  <div className="mb-2 fs-5">T</div>
                  <div className="fs-5 fw-bold">{weather.current.main.feels_like}C</div>
                  <small className="opacity-75">{t("weather.feelsLike")}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">Farming Alerts</h5>
            </div>
            <div className="card-body">
              {weather.ai?.alerts?.map((alert,index)=>(

<div
key={index}
className="alert alert-warning"
>

<strong>{alert.title}</strong>

<p>{alert.description}</p>

</div>

))}
            </div>
          </div>
        </div>
      </div>

     <div className="row g-4 mb-4">

  {/* Humidity */}
  <div className="col-6 col-lg-3">
    <div className="weather-stat-card humidity-card">
      <div className="weather-icon">
        <FaTint />
      </div>

      <h2>{weather.current.main.humidity}%</h2>

      <p>Humidity</p>

      <div className="progress mt-3">
        <div
          className="progress-bar bg-info"
          style={{
            width: `${weather.current.main.humidity}%`
          }}
        ></div>
      </div>
    </div>
  </div>

  {/* Wind */}
  <div className="col-6 col-lg-3">
    <div className="weather-stat-card wind-card">
      <div className="weather-icon">
        <FaWind />
      </div>

      <h2>{weather.current.wind.speed} km/h</h2>

      <p>Wind Speed</p>
    </div>
  </div>

  {/* UV */}
  <div className="col-6 col-lg-3">
    <div className="weather-stat-card uv-card">
      <div className="weather-icon">
        <FaSun />
      </div>

      <h2>--</h2>

      <p>UV Index</p>
    </div>
  </div>

  {/* Disease */}
  <div className="col-6 col-lg-3">
    <div
      className={`weather-stat-card disease-card ${
        weather.ai.diseaseRisk.risk === "High"
          ? "high"
          : weather.ai.diseaseRisk.risk === "Medium"
          ? "medium"
          : "low"
      }`}
    >
      <div className="weather-icon">
        <FaBug />
      </div>

      <h2>{weather.ai.diseaseRisk.risk}</h2>

      <p>Disease Risk</p>
    </div>
  </div>

</div>

      <div className="card weather-forecast-card border-0 shadow-sm">

  <div className="card-header forecast-header">
    <h5 className="mb-0">
      🌤 5-Day Forecast
    </h5>
  </div>

  <div className="card-body">

    <div className="forecast-wrapper">

      {weather.forecast.list
        .filter((_, index) => index % 8 === 0)
        .slice(0, 5)
        .map((day, index) => (

          <div className="forecast-item" key={index}>

            <h6>
              {new Date(day.dt * 1000).toLocaleDateString("en", {
                weekday: "short",
              })}
            </h6>

            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              alt=""
              width={70}
            />

            <div className="forecast-temp">

              <span className="high">
                {Math.round(day.main.temp_max)}°
              </span>

              <span className="low">
                {Math.round(day.main.temp_min)}°
              </span>

            </div>

            <small className="forecast-desc">
              {day.weather[0].main}
            </small>

            <div className="rain-badge">
              🌧 {Math.round((day.pop || 0) * 100)}%
            </div>

          </div>

        ))}

    </div>

  </div>

</div>

      <div className="row g-4 mt-4">
        <div className="col-12 col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">{t("weather.irrigationRecommendation")}</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle bg-info p-3">
                  <FaTint className="text-white" size={24} />
                </div>
                <div>
                 <h6>

{weather.ai.irrigation.title}

</h6>

<p>

{weather.ai.irrigation.description}

</p>

<span className="badge bg-info">

{weather.ai.irrigation.waterSaving}

</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">{t("weather.spraySchedule")}</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle bg-success p-3">
                  <FaSun className="text-white" size={24} />
                </div>
                <div>
                 <h6>

{weather.ai.spraying.title}

</h6>

<p>

{weather.ai.spraying.description}

</p>

<span className="badge bg-success">

Recommended

</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Weather
