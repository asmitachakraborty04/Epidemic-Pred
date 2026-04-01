import { useEffect, useState } from "react";
import axios from "axios";
import Landing from "./Landing";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Signup from "./Signup";
import Profile from "./Profile";

const USERS_STORAGE_KEY = "outbreakx.users";
const CURRENT_USER_STORAGE_KEY = "outbreakx.currentUserEmail";

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function loadStoredUsers() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to parse stored users", error);
    return [];
  }
}

function loadStoredCurrentUserEmail() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(CURRENT_USER_STORAGE_KEY) || "";
}

function formatDateTime(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

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

  .field input.input-error {
    border-color: rgba(248,113,113,0.65);
    background: rgba(248,113,113,0.08);
    box-shadow: 0 0 0 3px rgba(248,113,113,0.12);
  }

  .field-error {
    margin-top: 8px;
    font-size: 12px;
    color: #fca5a5;
    line-height: 1.35;
  }

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

  .btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    filter: none;
    transform: none;
    box-shadow: 0 4px 14px rgba(99,102,241,0.2);
  }

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

  .toast-stack {
    position: fixed;
    top: 18px;
    right: 18px;
    z-index: 600;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: min(92vw, 380px);
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(12,16,27,0.95);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 12px 12px 12px 14px;
    color: #e2e8f0;
    box-shadow: 0 12px 30px rgba(0,0,0,0.45);
    animation: toast-in 0.25s ease;
    backdrop-filter: blur(8px);
  }

  .toast-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .toast-message {
    flex: 1;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.35;
  }

  .toast-close {
    width: 22px;
    height: 22px;
    border: none;
    border-radius: 8px;
    background: rgba(255,255,255,0.08);
    color: #cbd5e1;
    cursor: pointer;
    font-size: 12px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }

  .toast-close:hover {
    background: rgba(255,255,255,0.16);
  }

  .toast-success {
    border-color: rgba(74,222,128,0.35);
  }
  .toast-success .toast-dot {
    background: #4ade80;
    box-shadow: 0 0 10px rgba(74,222,128,0.55);
  }

  .toast-error {
    border-color: rgba(248,113,113,0.35);
  }
  .toast-error .toast-dot {
    background: #f87171;
    box-shadow: 0 0 10px rgba(248,113,113,0.55);
  }

  .toast-info {
    border-color: rgba(96,165,250,0.35);
  }
  .toast-info .toast-dot {
    background: #60a5fa;
    box-shadow: 0 0 10px rgba(96,165,250,0.55);
  }

  @keyframes toast-in {
    from { opacity: 0; transform: translateY(-6px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
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

function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`} role="status">
          <span className="toast-dot" />
          <span className="toast-message">{toast.message}</span>
          <button
            className="toast-close"
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
          >
            x
          </button>
        </div>
      ))}
    </div>
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
  const [regionError, setRegionError] = useState("");
  const [toasts, setToasts] = useState([]);
  const [users, setUsers] = useState(() => loadStoredUsers());
  const [currentUserEmail, setCurrentUserEmail] = useState(() => loadStoredCurrentUserEmail());

  const currentUser = users.find((user) => user.email === currentUserEmail) || null;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (currentUserEmail) {
      window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, currentUserEmail);
    } else {
      window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  }, [currentUserEmail]);

  useEffect(() => {
    if (!currentUserEmail) {
      return;
    }

    const exists = users.some((user) => user.email === currentUserEmail);
    if (!exists) {
      setCurrentUserEmail("");
    }
  }, [users, currentUserEmail]);

  function removeToast(toastId) {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  }

  function addToast(message, type = "info") {
    const toastId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id: toastId, message, type }]);
    setTimeout(() => removeToast(toastId), 3200);
  }

  function signupUser({ name, email, password }) {
    const normalizedEmail = normalizeEmail(email);

    const existingUser = users.find((user) => user.email === normalizedEmail);
    if (existingUser) {
      return {
        ok: false,
        field: "email",
        error: "An account already exists with this email.",
      };
    }

    const nextUser = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      region: "Not selected",
      lastPrediction: "No predictions yet",
      accountStatus: "Active",
      predictionsCount: 0,
      lastLogin: formatDateTime(),
    };

    setUsers((prev) => [...prev, nextUser]);
    setCurrentUserEmail(normalizedEmail);
    return { ok: true };
  }

  function loginUser({ email, password }) {
    const normalizedEmail = normalizeEmail(email);
    const existingUser = users.find((user) => user.email === normalizedEmail);

    if (!existingUser) {
      return {
        ok: false,
        field: "email",
        error: "No account found for this email. Please sign up first.",
      };
    }

    if (existingUser.password !== password) {
      return {
        ok: false,
        field: "password",
        error: "Incorrect password.",
      };
    }

    setCurrentUserEmail(normalizedEmail);
    setUsers((prev) =>
      prev.map((user) =>
        user.email === normalizedEmail
          ? {
              ...user,
              accountStatus: "Active",
              lastLogin: formatDateTime(),
            }
          : user,
      ),
    );

    return { ok: true };
  }

  function requestPasswordReset(email) {
    const normalizedEmail = normalizeEmail(email);
    const existingUser = users.find((user) => user.email === normalizedEmail);

    if (!existingUser) {
      return {
        ok: false,
        error: "No account found for this email.",
      };
    }

    return { ok: true };
  }

  function resetPassword({ email, password }) {
    const normalizedEmail = normalizeEmail(email);
    let wasUpdated = false;

    setUsers((prev) =>
      prev.map((user) => {
        if (user.email === normalizedEmail) {
          wasUpdated = true;
          return { ...user, password };
        }

        return user;
      }),
    );

    if (!wasUpdated) {
      return {
        ok: false,
        error: "Unable to reset password for this account.",
      };
    }

    return { ok: true };
  }

  function updateCurrentUserProfile({ name, email }) {
    if (!currentUserEmail) {
      return { ok: false, error: "No active session found." };
    }

    const normalizedEmail = normalizeEmail(email);
    const duplicateUser = users.find(
      (user) => user.email === normalizedEmail && user.email !== currentUserEmail,
    );

    if (duplicateUser) {
      return {
        ok: false,
        field: "email",
        error: "An account already exists with this email.",
      };
    }

    setUsers((prev) =>
      prev.map((user) => {
        if (user.email !== currentUserEmail) {
          return user;
        }

        return {
          ...user,
          name: name.trim(),
          email: normalizedEmail,
        };
      }),
    );
    setCurrentUserEmail(normalizedEmail);

    return { ok: true };
  }

  function logoutCurrentUser() {
    if (currentUserEmail) {
      setUsers((prev) =>
        prev.map((user) =>
          user.email === currentUserEmail
            ? {
                ...user,
                accountStatus: "Signed Out",
              }
            : user,
        ),
      );
    }

    setCurrentUserEmail("");
    setPage("landing");
    addToast("You have been signed out.", "info");
  }

  async function handlePredict() {
    if (!region.trim()) {
      setRegionError("Please enter a region to run prediction.");
      setShake(true);
      setTimeout(() => setShake(false), 400);
      addToast("Region is required before running prediction.", "error");
      return;
    }

    setIsLoading(true);
    setShake(false);
    setRegionError("");
    setBackendConnected(null);

    const requestPayload = { region: region.trim() };

    try {
      const apiUrl = import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/predict`
        : "/api/predict";
      const { data } = await axios.post(apiUrl, requestPayload, {
        headers: { "Content-Type": "application/json" },
      });
      if (!data || typeof data.risk !== "string") throw new Error("invalid backend payload");

      setBackendConnected(true);
      setRisk(data.risk);
      const resolvedRegion = data.region || requestPayload.region;
      setSubmittedRegion(resolvedRegion);
      setResponseRegions(Array.isArray(data.regions) ? data.regions : null);

      if (currentUserEmail) {
        setUsers((prev) =>
          prev.map((user) =>
            user.email === currentUserEmail
              ? {
                  ...user,
                  region: resolvedRegion,
                  lastPrediction: data.risk,
                  predictionsCount: (user.predictionsCount || 0) + 1,
                }
              : user,
          ),
        );
      }

      addToast(`Prediction ready for ${resolvedRegion}.`, "success");
      setPage("dashboard");
    } catch (error) {
      console.error("Backend prediction failed", error);
      setBackendConnected(false);
      setRisk(null);
      setSubmittedRegion(requestPayload.region);
      setResponseRegions(null);

      if (currentUserEmail) {
        setUsers((prev) =>
          prev.map((user) =>
            user.email === currentUserEmail
              ? {
                  ...user,
                  region: requestPayload.region,
                  lastPrediction: "Unavailable",
                  predictionsCount: (user.predictionsCount || 0) + 1,
                }
              : user,
          ),
        );
      }

      addToast("Backend unavailable. Showing fallback dashboard.", "error");
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

  let pageContent;

  if (page === "landing") {
    pageContent = <Landing setPage={setPage} />;
  } else if (page === "signup") {
    pageContent = <Signup setPage={setPage} onNotify={addToast} onSignup={signupUser} />;
  } else if (page === "login") {
    pageContent = (
      <Login
        setPage={setPage}
        onNotify={addToast}
        onLogin={loginUser}
        onRequestPasswordReset={requestPasswordReset}
        onResetPassword={resetPassword}
      />
    );
  } else if (page === "profile") {
    pageContent = (
      <Profile
        setPage={setPage}
        currentUser={currentUser}
        onNotify={addToast}
        onSaveProfile={updateCurrentUserProfile}
        onLogout={logoutCurrentUser}
      />
    );
  } else {
    pageContent = (
      <div className="page">
        <ProfileButton setPage={setPage} />

        {page === "input" && (
          <div className="card">
            <div className="header">
              <div className="tag">
                <span className="tag-dot" />
                AI · Epidemiology
              </div>
              <h1 className="title">OutbreakX</h1>
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
                    className={regionError ? "input-error" : ""}
                    onChange={(e) => {
                      setRegion(e.target.value);
                      setRisk(null);
                      setBackendConnected(null);
                      setSubmittedRegion("");
                      setRegionError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handlePredict()}
                    disabled={isLoading}
                  />
                </div>
                {regionError && <p className="field-error">{regionError}</p>}
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
    );
  }

  return (
    <>
      <style>{css}</style>
      <ToastStack toasts={toasts} onDismiss={removeToast} />
      {pageContent}
    </>
  );
}
