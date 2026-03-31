import { useState } from "react";
import Landing from "./Landing";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Signup from "./Signup";
import Profile from "./Profile";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .page {
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0b0f1a;
    padding: 32px 16px;
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .page::before {
    content: '';
    position: fixed;
    top: -160px; left: -160px;
    width: 520px; height: 520px;
    background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%);
    pointer-events: none;
  }
  .page::after {
    content: '';
    position: fixed;
    bottom: -180px; right: -140px;
    width: 480px; height: 480px;
    background: radial-gradient(circle, rgba(236,72,153,0.13) 0%, transparent 70%);
    pointer-events: none;
  }

  .profile-btn {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 200;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(99, 102, 241, 0.18);
    border: 1px solid rgba(99, 102, 241, 0.35);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    transition: background 0.2s, transform 0.15s;
    backdrop-filter: blur(12px);
  }

  .profile-btn:hover {
    background: rgba(99, 102, 241, 0.35);
    transform: scale(1.08);
  }

  .card {
    background: #131929;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 24px;
    padding: 48px 40px;
    width: 100%;
    max-width: 480px;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.04) inset,
      0 32px 80px rgba(0,0,0,0.6),
      0 8px 24px rgba(0,0,0,0.4);
    position: relative;
    z-index: 1;
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
    border-radius: 100%;
  }

  .header { text-align: center; margin-bottom: 36px; }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(99,102,241,0.15);
    color: #818cf8;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 20px;
    border: 1px solid rgba(99,102,241,0.25);
    margin-bottom: 16px;
  }

  .tag-dot {
    width: 6px; height: 6px;
    background: #818cf8;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.75); }
  }

  .title {
    font-size: 26px;
    font-weight: 800;
    color: #f1f5f9;
    line-height: 1.25;
    letter-spacing: -0.5px;
  }

  .title span { color: #818cf8; }

  .subtitle {
    font-size: 13px;
    color: #4b5675;
    margin-top: 8px;
    font-weight: 400;
  }

  .divider {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.06);
    margin: 30px 0;
  }

  .field { margin-bottom: 20px; }

  .field label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #4b5675;
    margin-bottom: 8px;
  }

  .input-wrap { position: relative; }

  .input-icon {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 15px;
    pointer-events: none;
    opacity: 0.5;
  }

  .field input {
    width: 100%;
    padding: 12px 14px 12px 38px;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    color: #e2e8f0;
    background: rgba(255,255,255,0.04);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    font-family: 'Inter', sans-serif;
  }

  .field input:focus {
    border-color: rgba(99,102,241,0.5);
    background: rgba(99,102,241,0.06);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }

  .field input::placeholder { color: #2e3a52; }

  .btn {
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 6px 24px rgba(99,102,241,0.4), 0 2px 8px rgba(0,0,0,0.3);
    transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%);
    border-radius: 12px;
  }

  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(99,102,241,0.5), 0 4px 12px rgba(0,0,0,0.4);
    filter: brightness(1.08);
  }

  .btn:active { transform: translateY(0); }

  .result-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    padding: 14px 18px;
    border-radius: 12px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
  }

  .result-left { display: flex; flex-direction: column; gap: 2px; }

  .result-label {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #4b5675;
  }

  .result-region {
    font-size: 13px;
    font-weight: 600;
    color: #94a3b8;
    margin-top: 2px;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .badge {
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 6px 18px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .badge-dot { width: 7px; height: 7px; border-radius: 50%; }

  .badge-high   { background: rgba(239,68,68,0.15);  color: #f87171; border: 1px solid rgba(239,68,68,0.3);  }
  .badge-high   .badge-dot { background: #f87171; }
  .badge-medium { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3); }
  .badge-medium .badge-dot { background: #fbbf24; }
  .badge-low    { background: rgba(34,197,94,0.12);  color: #4ade80; border: 1px solid rgba(34,197,94,0.28); }
  .badge-low    .badge-dot { background: #4ade80; }
  .badge-none   { background: rgba(255,255,255,0.04); color: #3d4f6b; border: 1px solid rgba(255,255,255,0.06); }
  .badge-none   .badge-dot { background: #3d4f6b; }

  .chart-box {
    margin-top: 20px;
    border-radius: 14px;
    border: 1px dashed rgba(255,255,255,0.09);
    background: rgba(255,255,255,0.02);
    height: 164px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    position: relative;
    overflow: hidden;
  }

  .chart-box::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 32px 32px;
  }

  .chart-icon { font-size: 28px; opacity: 0.25; position: relative; z-index: 1; }

  .chart-text {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 1px;
    color: #2e3a52;
    text-transform: uppercase;
    position: relative;
    z-index: 1;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25%       { transform: translateX(-6px); }
    75%       { transform: translateX(6px); }
  }
  .shake { animation: shake 0.35s ease; }
`;

function ProfileButton({ setPage }) {
  return (
    <button
      className="profile-btn"
      onClick={() => setPage("profile")}
      title="Go to Profile"
    >
      👤
    </button>
  );
}

export default function App() {
  const [region, setRegion] = useState("");
  const [page, setPage] = useState("landing");
  const [risk, setRisk] = useState(null);
  const [submittedRegion, setSubmittedRegion] = useState("");
  const [shake, setShake] = useState(false);
  const [backendConnected, setBackendConnected] = useState(null);
  const [responseRegions, setResponseRegions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handlePredict() {
    if (!region.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    setIsLoading(true);
    setShake(false);
    setBackendConnected(null);

    const requestPayload = { region: region.trim() };

    try {
      const apiUrl = import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/predict`
        : "/api/predict";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) throw new Error(`backend status ${response.status}`);

      const data = await response.json();
      if (!data || typeof data.risk !== "string") throw new Error("invalid backend payload");

      setBackendConnected(true);
      setRisk(data.risk);
      setSubmittedRegion(data.region || requestPayload.region);
      setResponseRegions(Array.isArray(data.regions) ? data.regions : null);
      setPage("dashboard");
    } catch (error) {
      console.error("Backend prediction failed", error);
      setBackendConnected(false);
      setRisk(null);
      setSubmittedRegion(requestPayload.region);
      setResponseRegions(null);
      setPage("dashboard");
    } finally {
      setIsLoading(false);
    }
  }

  const badgeClass =
    risk === "High"   ? "badge badge-high"   :
    risk === "Medium" ? "badge badge-medium" :
    risk === "Low"    ? "badge badge-low"    :
                        "badge badge-none";

  if (page === "landing") return <Landing setPage={setPage} />;
  if (page === "signup")  return <Signup setPage={setPage} />;
  if (page === "login")   return <Login setPage={setPage} />;
  if (page === "profile") return <Profile setPage={setPage} />;

  return (
    <>
      <style>{css}</style>
      <div className="page">
        <ProfileButton setPage={setPage} />

        {page === "input" && (
          <div className="card">
            <div className="header">
              <div className="tag">
                <span className="tag-dot" />
                AI · Epidemiology
              </div>
              <h1 className="title">Epidemic Spread<br /><span>Prediction</span></h1>
              <p className="subtitle">Enter a region to assess outbreak risk</p>
            </div>

            <hr className="divider" />

            <div className={shake ? "shake" : ""}>
              <div className="field">
                <label>Region</label>
                <div className="input-wrap">
                  <span className="input-icon">🌍</span>
                  <input
                    type="text"
                    placeholder="e.g. South Asia"
                    value={region}
                    onChange={(e) => {
                      setRegion(e.target.value);
                      setRisk(null);
                      setBackendConnected(null);
                      setSubmittedRegion("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handlePredict()}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <button className="btn" onClick={handlePredict} disabled={isLoading}>
              {isLoading ? "Loading..." : "Run Prediction"}
            </button>

            <div className="result-row">
              <div className="result-left">
                <span className="result-label">Risk Assessment</span>
                {backendConnected === true && submittedRegion && risk ? (
                  <span className="result-region">{submittedRegion}</span>
                ) : (
                  <span className="result-region">—</span>
                )}
              </div>
              <span className={badgeClass}>
                <span className="badge-dot" />
                {backendConnected === true && risk ? risk : "—"}
              </span>
            </div>

            <div className="chart-box">
              <span className="chart-text">Chart will appear here</span>
            </div>
          </div>
        )}

        {page === "dashboard" && (
          <Dashboard
            region={submittedRegion}
            risk={risk}
            backendConnected={backendConnected}
            regions={responseRegions}
            onBack={() => setPage("input")}
          />
        )}
      </div>
    </>
  );
}
