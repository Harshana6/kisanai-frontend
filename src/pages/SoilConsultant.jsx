import { useState,useEffect } from 'react'
import { FaTint, FaSeedling, FaCheck, FaSpinner, FaLightbulb } from 'react-icons/fa'
import { useTranslation } from "react-i18next";
import { analyzeSoil } from "../services/soilService";
import i18n from "../i18n";
import { saveActivity } from "../utils/activityLogger";
import {  toast } from "react-toastify";
function SoilConsultant() {
  const {t}=useTranslation();
  const [formData, setFormData] = useState({
    ph: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    moisture: '',
    temperature: '',
    organicMatter: '',
    cropType: '',
  })
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

 const handleAnalyze = async () => {
  try {
    setAnalyzing(true);

    const response = await analyzeSoil({
      ...formData,
      language: i18n.language,
    });

    if (response.success) {
      setResult(response.result);
       saveActivity({
  type: "soil",
  title: "Soil Analysis Completed",
  crop: formData.cropType,
  status:
    response.result.status === "Excellent"
      ? "success"
      : response.result.status === "Good"
      ? "success"
      : response.result.status === "Fair"
      ? "warning"
      : "danger",
});
    } 
   console.log(JSON.stringify(response.result, null, 2));
    
  } catch (err) {
    console.log(err);
    const serverError = ()=>toast.error(err.response?.data?.message || "Server Error");
    serverError();
  } finally {
    setAnalyzing(false);
  }
};

  const resetAnalysis = () => {
    setFormData({
      ph: '',
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      moisture: '',
      temperature: '',
      organicMatter: '',
      cropType: '',
    })
    setResult(null)
  }

  const isFormValid = () => {
    return formData.ph && formData.nitrogen && formData.cropType
  }
useEffect(() => {
  setFormData({
    nitrogen: "90",
    phosphorus: "42",
    potassium: "43",
    ph: "6.5",
    moisture: "58",
   temperature: '32',
      organicMatter: '3.5',
      cropType:  "wheat",
  });
}, []);
  return (
    <div className="soil-consultant fade-in">
      <div className="page-header">
        <h1 className="page-title">{t("soilConsultant.title")}</h1>
        <p className="page-subtitle">{t("soilConsultant.subtitle")}</p>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <FaTint className="me-2 text-success" />
                Soil Parameters
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">{t("soilConsultant.ph")} *</label>
                    <input
                      type="number"
                      step="0.1"
                      name="ph"
                      value={formData.ph}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g., 6.5"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">{t("soilConsultant.nitrogen")} (N) kg/ha *</label>
                    <input
                      type="number"
                      name="nitrogen"
                      value={formData.nitrogen}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g., 250"
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">{t("soilConsultant.phosphorus")}  (P) kg/ha</label>
                    <input
                      type="number"
                      name="phosphorus"
                      value={formData.phosphorus}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g., 30"
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">{t("soilConsultant.potassium")} (K) kg/ha</label>
                    <input
                      type="number"
                      name="potassium"
                      value={formData.potassium}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g., 200"
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">{t("soilConsultant.moisture")}  (%)</label>
                    <input
                      type="number"
                      name="moisture"
                      value={formData.moisture}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g., 45"
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">{t("weather.temperature")} (C)</label>
                    <input
                      type="number"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g., 25"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">{t("soilConsultant.organicMatter")} (%)</label>
                    <input
                      type="number"
                      name="organicMatter"
                      value={formData.organicMatter}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g., 3.5"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">{t("soilConsultant.targetCrop")} *</label>
                    <select
                      name="cropType"
                      value={formData.cropType}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select Crop</option>
                      <option value="tomato">{t("soilConsultant.tomato")}</option>
                      <option value="rice">{t("soilConsultant.rice")}</option>
                      <option value="wheat">{t("soilConsultant.wheat")}</option>
                      <option value="corn">{t("soilConsultant.corn")}</option>
                      <option value="potato">{t("soilConsultant.potato")}</option>
                      <option value="cotton">{t("soilConsultant.cotton")}</option>
                      <option value="sugarcane">{t("soilConsultant.sugarcane")}</option>
                      <option value="vegetables">{t("soilConsultant.vegetables")}</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary flex-grow-1"
                    disabled={!isFormValid() || analyzing}
                  >
                    {analyzing ? (
                      <>
                        <FaSpinner className="fa-spin me-2" />
                       {t("soilConsultant.analyzing")}
                      </>
                    ) : (
                      <>
                        <FaSeedling className="me-2" />
                       {t("soilConsultant.analyze")}
                      </>
                    )}
                  </button>
                  {result && (
                    <button type="button" className="btn btn-outline-secondary" onClick={resetAnalysis}>
                      Reset
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          {result ? (
            <div>
              <div className="card mb-4">
                <div className="card-body">
                  <div className="row g-4 align-items-center">
                    <div className="col-auto">
                      <div className="text-center">
                        <div className="display-4 fw-bold text-success">{result.healthScore}</div>
                        <small className="text-muted">Health Score</small>
                      </div>
                    </div>
                    <div className="col">
                      <h5 className="mb-2">Overall Status: <span className="badge bg-warning">{result.status}</span></h5>
                      <p className="mb-0 text-muted">{result.summary}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-4 mb-4">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Parameter Analysis</h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        {result.analysis.map((issue, index) => (
                          <div className="col-6 col-md-3" key={index}>
                            <div className="text-center p-3 soil-card rounded-3">
                              <h6 className="mb-2">{issue.name}</h6>
                              <span className={`badge bg-${issue.severity}`}>{issue.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <FaLightbulb className="me-2 text-warning" />
                    Recommendations
                  </h5>
                </div>
                <div className="card-body">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className={`recommendation-box ${index < result.recommendations.length - 1 ? 'mb-3' : ''}`}>
                      <h6 className="d-flex align-items-center">
                        <FaCheck className="me-2 text-success" />
                        {rec.title}
                      </h6>
                      <p>{rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <div className="card h-100">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Suitable Crops</h5>
                    </div>
                    <div className="card-body">
                      <div className="d-flex flex-wrap gap-2">
                        {result.suitableCrops.map((crop, index) => (
                          <span key={index} className="badge bg-success fs-6">{crop}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="card h-100">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Next Steps</h5>
                    </div>
                    <div className="card-body">
                      <p className="mb-2">Recommended next soil test: <strong>{result.nextTest}</strong></p>
                      <button className="btn btn-outline-primary btn-sm">
                        Schedule Test Reminder
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card h-100">
              <div className="card-body d-flex flex-column align-items-center justify-content-center text-center py-5">
                <div className="rounded-circle bg-light p-4 mb-4">
                  <FaSeedling className="text-success" size={48} />
                </div>
                <h5 className="mb-2">{t("soilConsultant.enterSoilParameters")}</h5>
                <p className="text-muted small">
                 {t("soilConsultant.soilParametersSubtitle")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SoilConsultant
