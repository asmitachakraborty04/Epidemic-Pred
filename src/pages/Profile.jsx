import { useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .profile-page {
    min-height: 100vh;
    width: 100%;
    background: #080c14;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 48px 16px 64px;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  /* Ambient glows */
  .profile-page::before {
    content: '';
    position: fixed;
    top: -200px; left: -200px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 65%);
    pointer-events: none;
  }
  .profile-page::after {
    content: '';
    position: fixed;
    bottom: -200px; right: -150px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 65%);
    pointer-events: none;
  }

  .profile-container {
    width: 100%;
    max-width: 780px;
    position: relative;
    z-index: 1;
    animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Page title ── */
  .page-title-row {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 32px;
  }

  .page-title-badge {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #818cf8;
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.22);
    border-radius: 20px;
    padding: 5px 14px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .pulse-dot {
    width: 6px; height: 6px;
    background: #818cf8;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.35; transform: scale(0.7); }
  }

  .page-title {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: #f0f4ff;
    letter-spacing: -0.5px;
  }

  /* ── Hero card (avatar + name + email) ── */
  .hero-card {
    background: #0e1422;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 24px;
    padding: 36px 36px 32px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 28px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03) inset;
    position: relative;
    overflow: hidden;
  }

  .hero-card::before {
    content: '';
    position: absolute;
    top: 0; left: 12%; right: 12%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent);
  }

  /* Subtle horizontal scan line */
  .hero-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 31px,
      rgba(255,255,255,0.012) 32px
    );
    pointer-events: none;
  }

  .avatar-wrap {
    position: relative;
    flex-shrink: 0;
  }

  .avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4f46e5 0%, #818cf8 50%, #ec4899 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-size: 32px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -1px;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.35), 0 8px 24px rgba(79,70,229,0.45);
  }

  .avatar-ring {
    position: absolute;
    inset: -5px;
    border-radius: 50%;
    border: 1.5px solid rgba(99,102,241,0.3);
    animation: spin 8s linear infinite;
    border-top-color: #818cf8;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .hero-info { flex: 1; min-width: 0; }

  .hero-name {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #f0f4ff;
    letter-spacing: -0.3px;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hero-email {
    font-size: 13.5px;
    color: #4b5f80;
    font-weight: 400;
    margin-bottom: 14px;
  }

  .hero-role-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    color: #4ade80;
    background: rgba(74,222,128,0.08);
    border: 1px solid rgba(74,222,128,0.2);
    border-radius: 20px;
    padding: 4px 12px;
  }

  .hero-role-tag-dot {
    width: 5px; height: 5px;
    background: #4ade80;
    border-radius: 50%;
  }

  /* ── Info cards grid ── */
  .info-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 20px;
  }

  @media (max-width: 600px) {
    .info-grid { grid-template-columns: 1fr; }
    .hero-card { flex-direction: column; text-align: center; align-items: center; }
    .hero-info { display: flex; flex-direction: column; align-items: center; }
    .hero-name { white-space: normal; }
  }

  .info-card {
    background: #0e1422;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 18px;
    padding: 22px 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  }

  .info-card:hover {
    border-color: rgba(99,102,241,0.28);
    transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1) inset;
  }

  .info-card-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px;
    margin-bottom: 14px;
  }

  .icon-purple { background: rgba(99,102,241,0.14); }
  .icon-amber  { background: rgba(251,191,36,0.12); }
  .icon-green  { background: rgba(74,222,128,0.10); }

  .info-card-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #35456a;
    margin-bottom: 6px;
  }

  .info-card-value {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #c8d4f0;
    line-height: 1.3;
  }

  .status-active {
    color: #4ade80;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .status-active::before {
    content: '';
    width: 7px; height: 7px;
    background: #4ade80;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(74,222,128,0.6);
  }

  /* ── Stats row ── */
  .stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }

  .stat-card {
    background: #0e1422;
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 18px;
    padding: 22px 24px;
    box-shadow: 0 8px 28px rgba(0,0,0,0.35);
    display: flex;
    align-items: center;
    gap: 18px;
    transition: border-color 0.2s;
  }

  .stat-card:hover { border-color: rgba(255,255,255,0.1); }

  .stat-number {
    font-family: 'Syne', sans-serif;
    font-size: 34px;
    font-weight: 800;
    color: #818cf8;
    line-height: 1;
    letter-spacing: -1px;
  }

  .stat-right { display: flex; flex-direction: column; gap: 3px; }

  .stat-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #35456a;
  }

  .stat-sub {
    font-size: 12.5px;
    color: #4b5f80;
    font-weight: 400;
  }

  /* ── Buttons ── */
  .btn-row {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
  }

  .btn {
    flex: 1;
    min-width: 140px;
    padding: 15px 24px;
    border-radius: 14px;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: transform 0.18s, box-shadow 0.18s, background 0.18s, border-color 0.18s;
    border: none;
    position: relative;
    overflow: hidden;
  }

  .btn:active { transform: scale(0.97); }

  .btn-primary {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: #fff;
    box-shadow: 0 6px 24px rgba(99,102,241,0.4);
  }

  .btn-primary::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%);
    border-radius: 14px;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(99,102,241,0.55);
    filter: brightness(1.1);
  }

  .btn-outline {
    background: transparent;
    color: #f87171;
    border: 1.5px solid rgba(248,113,113,0.28);
    box-shadow: none;
  }

  .btn-outline:hover {
    background: rgba(248,113,113,0.07);
    border-color: rgba(248,113,113,0.55);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(248,113,113,0.15);
  }

  /* Divider */
  .section-divider {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.05);
    margin: 20px 0;
  }
`;

const USER = {
  name: "Alex Mercer",
  initials: "AM",
  email: "alex.mercer@epidemicai.io",
  region: "South Asia",
  lastPrediction: "High Risk",
  accountStatus: "Active",
  predictionsCount: 24,
  lastLogin: "Today, 09:42 AM",
};

function InfoCard({ icon, iconClass, label, value, isStatus }) {
  return (
    <div className="info-card">
      <div className={`info-card-icon ${iconClass}`}>{icon}</div>
      <div className="info-card-label">{label}</div>
      {isStatus ? (
        <div className="info-card-value status-active">{value}</div>
      ) : (
        <div className="info-card-value">{value}</div>
      )}
    </div>
  );
}

export default function Profile({ setPage }) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(USER.name);
  const [email, setEmail] = useState(USER.email);
  const [draft, setDraft] = useState({ name: USER.name, email: USER.email });

  function handleEdit() {
    setDraft({ name, email });
    setEditMode(true);
  }

  function handleSave() {
    setName(draft.name || name);
    setEmail(draft.email || email);
    setEditMode(false);
  }

  function handleLogout() {
    if (typeof setPage === "function") setPage("landing");
    else alert("Logging out…");
  }

  return (
    <>
      <style>{css}</style>
      <div className="profile-page">
        <div className="profile-container">

          {/* Title */}
          <div className="page-title-row">
            <div className="page-title-badge">
              <span className="pulse-dot" />
              OutbreakX
            </div>
          </div>
          <h1 className="page-title" style={{ marginBottom: 28 }}>User Profile</h1>

          {/* Hero card */}
          <div className="hero-card">
            <div className="avatar-wrap">
              <div className="avatar">
                {name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="avatar-ring" />
            </div>

            <div className="hero-info">
              {editMode ? (
                <>
                  <input
                    value={draft.name}
                    onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(99,102,241,0.4)",
                      borderRadius: 10,
                      color: "#f0f4ff",
                      fontSize: 17,
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      padding: "8px 12px",
                      width: "100%",
                      outline: "none",
                      marginBottom: 8,
                    }}
                  />
                  <input
                    value={draft.email}
                    onChange={e => setDraft(d => ({ ...d, email: e.target.value }))}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10,
                      color: "#6b80a0",
                      fontSize: 13,
                      fontFamily: "'DM Sans', sans-serif",
                      padding: "7px 12px",
                      width: "100%",
                      outline: "none",
                      marginBottom: 12,
                    }}
                  />
                </>
              ) : (
                <>
                  <div className="hero-name">{name}</div>
                  <div className="hero-email">{email}</div>
                </>
              )}
              <div className="hero-role-tag">
                <span className="hero-role-tag-dot" />
                User
              </div>
            </div>
          </div>

          {/* Info cards */}
          <div className="info-grid">
            <InfoCard
              icon="🌍"
              iconClass="icon-purple"
              label="Region Selected"
              value={USER.region}
            />
            <InfoCard
              icon="⚠️"
              iconClass="icon-amber"
              label="Last Prediction"
              value={USER.lastPrediction}
            />
            <InfoCard
              icon="✦"
              iconClass="icon-green"
              label="Account Status"
              value={USER.accountStatus}
              isStatus
            />
          </div>

          {/* Stats */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-number">{USER.predictionsCount}</div>
              <div className="stat-right">
                <div className="stat-label">Predictions Made</div>
                <div className="stat-sub">Since account creation</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ fontSize: 20, letterSpacing: "-0.5px", lineHeight: 1.2 }}>
                {USER.lastLogin}
              </div>
              <div className="stat-right">
                <div className="stat-label">Last Login</div>
                <div className="stat-sub">Session active</div>
              </div>
            </div>
          </div>

          <hr className="section-divider" />

          {/* Buttons */}
          <div className="btn-row">
            {editMode ? (
              <>
                <button className="btn btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="btn btn-outline" style={{ color: "#94a3b8", borderColor: "rgba(148,163,184,0.25)" }} onClick={() => setEditMode(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-primary" onClick={handleEdit}>
                  Edit Profile
                </button>
                <button className="btn btn-outline" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
