import { useState } from "react";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#050d1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    overflow: "hidden",
    position: "relative",
  },
  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(0,200,150,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,150,0.04) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
    pointerEvents: "none",
  },
  glow1: {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(0,200,130,0.10) 0%, transparent 70%)",
    top: "10%",
    left: "15%",
    filter: "blur(30px)",
    pointerEvents: "none",
  },
  glow2: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(0,120,255,0.08) 0%, transparent 70%)",
    bottom: "10%",
    right: "10%",
    filter: "blur(40px)",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    zIndex: 1,
    background: "rgba(10, 20, 35, 0.85)",
    border: "1px solid rgba(0, 200, 140, 0.18)",
    borderRadius: 24,
    padding: "64px 56px 56px",
    maxWidth: 600,
    width: "90%",
    textAlign: "center",
    boxShadow:
      "0 0 60px rgba(0,200,130,0.07), 0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
    backdropFilter: "blur(16px)",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(0,200,130,0.10)",
    border: "1px solid rgba(0,200,130,0.25)",
    borderRadius: 999,
    padding: "6px 16px",
    marginBottom: 32,
    fontSize: 12,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#00c885",
    fontFamily: "'Courier New', monospace",
  },
  pulse: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#00c885",
    boxShadow: "0 0 6px #00c885",
    animation: "pulse 2s ease-in-out infinite",
  },
  title: {
    fontSize: "clamp(28px, 5vw, 46px)",
    fontWeight: 700,
    color: "#f0f6f2",
    lineHeight: 1.18,
    marginBottom: 20,
    letterSpacing: "-0.02em",
  },
  titleAccent: {
    background: "linear-gradient(135deg, #00e89a, #00aaff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: 17,
    color: "#7a9ab0",
    lineHeight: 1.7,
    marginBottom: 48,
    maxWidth: 440,
    margin: "0 auto 48px",
    fontFamily: "'Georgia', serif",
    fontStyle: "italic",
  },
  divider: {
    width: 48,
    height: 2,
    background: "linear-gradient(90deg, transparent, #00c885, transparent)",
    margin: "0 auto 36px",
    borderRadius: 2,
  },
  statsRow: {
    display: "flex",
    justifyContent: "center",
    gap: 32,
    marginBottom: 48,
  },
  stat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  statNum: {
    fontSize: 22,
    fontWeight: 700,
    color: "#e8f5ef",
    fontFamily: "'Courier New', monospace",
    letterSpacing: "0.04em",
  },
  statLabel: {
    fontSize: 11,
    color: "#4a7060",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  statDot: {
    width: 1,
    background: "rgba(0,200,130,0.15)",
    alignSelf: "stretch",
    margin: "4px 0",
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    background: "linear-gradient(135deg, #00c885 0%, #00a0e0 100%)",
    color: "#020e18",
    border: "none",
    borderRadius: 12,
    padding: "16px 40px",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.03em",
    transition: "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
    boxShadow: "0 4px 24px rgba(0,200,130,0.30)",
    fontFamily: "'Georgia', serif",
  },
  buttonArrow: {
    fontSize: 18,
    transition: "transform 0.2s ease",
  },
  footer: {
    marginTop: 40,
    fontSize: 12,
    color: "#2e4a3e",
    letterSpacing: "0.08em",
    fontFamily: "'Courier New', monospace",
  },
};

const keyframes = `
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.85); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .card-anim { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) both; }
  .badge-anim { animation: fadeUp 0.5s 0.1s cubic-bezier(.22,1,.36,1) both; }
  .title-anim { animation: fadeUp 0.6s 0.2s cubic-bezier(.22,1,.36,1) both; }
  .sub-anim   { animation: fadeUp 0.6s 0.35s cubic-bezier(.22,1,.36,1) both; }
  .stats-anim { animation: fadeUp 0.6s 0.45s cubic-bezier(.22,1,.36,1) both; }
  .btn-anim   { animation: fadeUp 0.6s 0.55s cubic-bezier(.22,1,.36,1) both; }
`;

export default function Landing({ setPage }) {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.page}>
        <div style={styles.grid} />
        <div style={styles.glow1} />
        <div style={styles.glow2} />

        <div style={styles.card} className="card-anim">
          {/* Badge */}
          <div style={styles.badge} className="badge-anim">
            <div style={styles.pulse} />
            AI-Powered Analysis
          </div>

          {/* Title */}
          <h1 style={styles.title} className="title-anim">
            Epidemic Spread<br />
            <span style={styles.titleAccent}>Prediction</span>
          </h1>

          {/* Divider */}
          <div style={styles.divider} />

          {/* Subtitle */}
          <p style={styles.subtitle} className="sub-anim">
            AI-powered system to analyze and predict epidemic spread risk
          </p>

          {/* Stats */}
          <div style={styles.statsRow} className="stats-anim">
            <div style={styles.stat}>
              <span style={styles.statNum}>98.2%</span>
              <span style={styles.statLabel}>Accuracy</span>
            </div>
            <div style={{ ...styles.statDot }} />
            <div style={styles.stat}>
              <span style={styles.statNum}>72h</span>
              <span style={styles.statLabel}>Forecast</span>
            </div>
            <div style={{ ...styles.statDot }} />
            <div style={styles.stat}>
              <span style={styles.statNum}>180+</span>
              <span style={styles.statLabel}>Regions</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="btn-anim">
            <button
              style={{
                ...styles.button,
                ...(hovered
                  ? {
                      transform: "translateY(-3px) scale(1.03)",
                      boxShadow: "0 8px 36px rgba(0,200,130,0.45)",
                      opacity: 0.95,
                    }
                  : {}),
              }}
              onClick={() => setPage?.("signup")}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              Start Analysis
              <span
                style={{
                  ...styles.buttonArrow,
                  transform: hovered ? "translateX(4px)" : "translateX(0)",
                  transition: "transform 0.2s ease",
                }}
              >
                →
              </span>
            </button>
          </div>

          <p style={styles.footer}>v2.4.1 · MODEL: ESP-TRANSFORMER · STATUS: ONLINE</p>
        </div>
      </div>
    </>
  );
}