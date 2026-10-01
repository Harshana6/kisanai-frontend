import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useTranslation } from "react-i18next";
import AskAIModal from "./AskAIModal";
import { useEffect, useState } from "react";
import { getWeather } from "../services/weatherService";
import i18n from "../i18n";
import { saveActivity } from "../utils/activityLogger";
const AIRecommendation = ({ weather }) => {
  const { t } = useTranslation();
  const [result, setResult] = useState(null)
  const [showAI, setShowAI] = useState(false);
  const [initialQuestion, setInitialQuestion] = useState("");

const aiConfidence =
weather?.ai?.diseaseRisk?.risk === "High"
? 98
: weather?.ai?.diseaseRisk?.risk === "Medium"
? 90
: 85;
  return (
    <>
<AskAIModal
     show={showAI}
    onClose={() => setShowAI(false)}
    diagnosis={result}
    language={localStorage.getItem("language") || "English"}
    initialQuestion={initialQuestion}
/>
    <div className="container py-2">
      <div
        className="card shadow-sm border-0 rounded-4 p-4"
        style={{ backgroundColor: "#fff" }}
      >
        <div className="row">
          {/* Left Section */}
          <div className="col-lg-7">
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-robot text-success fs-3 me-2"></i>
              <h4 className="fw-bold mb-0">{t("airecommedationcard.aiRecommendationTitle")}</h4>
            </div>

            <span className="badge bg-success rounded-pill px-3 py-2 mb-3">
              ✨{t("airecommedationcard.aiPowered")}
            </span>

            <p className="text-muted small">
               AI recommendations for <strong>{weather?.location}</strong> based on current weather conditions.
            </p>

            {/* Recommendation Item */}
            <div className="d-flex py-3 border-bottom">
              <div
                className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3 cloud"
                style={{ width: "45px", height: "45px" }}
              >
                <i className="bi bi-cloud-rain-fill text-success"></i>
              </div>

              <div
              className="recommendation-item"
onClick={() => {

  setResult({

prompt: `
You are an agriculture expert.

The farmer is from ${weather.location}.

Current weather:
Temperature: ${weather.current.main.temp}°C
Condition: ${weather.current.weather[0].description}

Explain this recommendation in simple language.

Recommendation:
${weather.ai.alerts[0].title}

${weather.ai.alerts[0].description}

Tell the farmer:
• Why this recommendation was given.
• What actions should be taken today.
• What mistakes to avoid.
• Keep the answer practical.
`

});

  setInitialQuestion(
`Explain this recommendation:

${weather.ai.alerts[0].title}

${weather.ai.alerts[0].description}

What should I do?`
);
saveActivity({

        type:"ai",

        title:"AI Recommendation Viewed",

        crop:"Current Crop",

        status:"healthy"

    });
setShowAI(true);
}}
style={{cursor:"pointer"}}>
                <h6 className="mb-1 fw-semibold weather-text">
                    {weather?.ai?.alerts?.[0]?.title}
                </h6>
                <small className="text-muted">
                 {weather?.ai?.alerts?.[0]?.description}
                </small>
              </div>
            </div>

            <div className="d-flex py-3 border-bottom">
              <div
                className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{ width: "45px", height: "45px" }}
              >
                <i className="bi bi-droplet-fill text-success"></i>
              </div>

              <div className="recommendation-item"
  style={{ cursor: "pointer" }}
  onClick={() => {

    setResult({

      prompt: `
You are an agriculture expert.

The farmer is from ${weather.location}.

Current weather:
Temperature: ${weather.current.main.temp}°C
Humidity: ${weather.current.main.humidity}%
Wind Speed: ${weather.current.wind.speed} m/s

Irrigation Recommendation:
${weather.ai.irrigation.title}

${weather.ai.irrigation.description}

Water Saving Tip:
${weather.ai.irrigation.waterSaving}

Explain:
• Why irrigation is needed.
• Best time to irrigate.
• How much water should be used.
• Water-saving methods.
`

    });

    setInitialQuestion(`
Explain today's irrigation recommendation.

${weather.ai.irrigation.title}

${weather.ai.irrigation.description}
`);
saveActivity({

        type:"ai",

        title:"AI Recommendation Viewed",

        crop:"Current Crop",

        status:"healthy"

    });
    setShowAI(true);

  }}>
                <h6 className="mb-1 fw-semibold weather-text">
                    {weather?.ai?.irrigation?.title}
                </h6>
                <small className="text-muted">
                  {weather?.ai?.irrigation?.description}
                </small>
              </div>
            </div>

            <div className="d-flex py-3 border-bottom">
              <div
                className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{ width: "45px", height: "45px" }}
              >
                <i className="bi bi-bug-fill text-success"></i>
              </div>

              <div  className="recommendation-item"
  style={{ cursor: "pointer" }}
  onClick={() => {

    setResult({

      prompt: `
You are an agriculture expert.

The farmer is from ${weather.location}.

Current weather:
Temperature: ${weather.current.main.temp}°C
Humidity: ${weather.current.main.humidity}%

Disease Risk:
${weather.ai.diseaseRisk.risk}

${weather.ai.diseaseRisk.description}

Explain:
• Why this disease risk exists.
• Which crops are affected.
• Prevention methods.
• Whether spraying is needed.
`

    });

    setInitialQuestion(`
Explain today's disease risk.

Risk:
${weather.ai.diseaseRisk.risk}

${weather.ai.diseaseRisk.description}
`);
saveActivity({

        type:"ai",

        title:"AI Recommendation Viewed",

        crop:"Current Crop",

        status:"healthy"

    });
    setShowAI(true);

  }}>
                <h6 className="mb-1 fw-semibold weather-text">
                    Disease Risk: {weather?.ai?.diseaseRisk?.risk}
                </h6>
                <small className="text-muted">
                 {weather?.ai?.diseaseRisk?.description}
                </small>
              </div>
            </div>

            <div className="d-flex py-3">
              <div
                className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{ width: "45px", height: "45px" }}
              >
                <i className="bi bi-currency-dollar text-success"></i>
              </div>

              <div
               className="recommendation-item"
  style={{ cursor: "pointer" }}
  onClick={() => {

    setResult({

      prompt: `
You are an agriculture expert.

The farmer is from ${weather.location}.

Current weather:
Temperature: ${weather.current.main.temp}°C
Humidity: ${weather.current.main.humidity}%
Wind Speed: ${weather.current.wind.speed} m/s
Condition: ${weather.current.weather[0].description}

Spraying Recommendation:
${weather.ai.spraying.title}

${weather.ai.spraying.description}

Explain:
• Why spraying is recommended today.
• Is this the right time for spraying?
• Which precautions should the farmer take?
• What weather conditions should be avoided?
• Suggest safe spraying practices.
`

    });

    setInitialQuestion(`
Explain today's spraying recommendation.

${weather.ai.spraying.title}

${weather.ai.spraying.description}

Should I spray my crops today?
`);
saveActivity({

        type:"ai",

        title:"AI Recommendation Viewed",

        crop:"Current Crop",

        status:"healthy"

    });
    setShowAI(true);

  }}
              >
                <h6 className="mb-1 fw-semibold weather-text">
                  {weather?.ai?.spraying?.title}
                </h6>
                <small className="text-muted">
                {weather?.ai?.spraying?.description}
                </small>
              </div>
            </div>

            <div className="mt-4">
              {/* <button className="btn btn-success report-btn rounded-pill me-3 px-4">
                <i className="bi bi-file-earmark-text me-2"></i>
                {t("airecommedationcard.viewReport")}
              </button> */}

              <button className="btn btn-outline-success rounded-pill px-4"
              onClick={() => {
    console.log("Button Clicked");
    saveActivity({

        type:"ai",

        title:"AI Recommendation Viewed",

        crop:"Current Crop",

        status:"healthy"

    });
    setShowAI(true);
  }}>
                <i className="bi bi-chat-dots me-2"></i>
                {t("airecommedationcard.askAI")}
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="col-lg-5 border-start mt-4 mt-lg-0">

            <div className="text-end">
              <div className="d-inline-block bg-light rounded-4 p-3">
                <small className="text-success fw-bold">
                  AI Confidence
                </small>
                <h2 className="text-success fw-bold mb-0"> {aiConfidence}%</h2>
              </div>
            </div>

            <div className="text-center my-4">
              <div
                className="rounded-circle bg-success bg-opacity-10 d-flex justify-content-center align-items-center mx-auto"
                style={{ width: "140px", height: "140px" }}
              >
                <i
                  className="bi bi-robot text-success"
                  style={{ fontSize: "60px" }}
                ></i>
              </div>
            </div>

            <div className="bg-success bg-opacity-10 rounded-4 p-4">

              <div className="d-flex justify-content-between mb-3">
                <span>🌧 {t("airecommedationcard.weather")}</span>
                <strong>{weather?.current?.weather?.[0]?.main}</strong>
              </div>

              <div className="progress mb-3" style={{ height: "8px" }}>
                <div
                  className="progress-bar bg-success"
                 style={{
width:
weather?.ai?.diseaseRisk?.risk==="High"
?"100%"
:weather?.ai?.diseaseRisk?.risk==="Medium"
?"70%"
:"35%"
}}
                ></div>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>🌱 {t("airecommedationcard.soilHealth")}</span>
                <strong className="text-success">Good</strong>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>🐞 {t("airecommedationcard.diseaseRisk")}</span>
                <strong
className={`${
weather?.ai?.diseaseRisk?.risk==="High"
?"text-danger"
:weather?.ai?.diseaseRisk?.risk==="Medium"
?"text-warning"
:"text-success"
}`}
>
{weather?.ai?.diseaseRisk?.risk}
</strong>
              </div>

              <div className="d-flex justify-content-between update-time">
                <span>🕒 {t("airecommedationcard.lastUpdated")}</span>
                <small className="text-muted">
                 {new Date().toLocaleTimeString()}
                </small>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AIRecommendation;