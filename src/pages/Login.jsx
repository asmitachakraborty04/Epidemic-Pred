import { useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .esp-root {
    min-height: 100vh;
    background: #080c12;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* Animated background grid */
  .esp-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,80,80,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,80,80,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    animation: gridDrift 20s linear infinite;
  }

  @keyframes gridDrift {
    0% { transform: translateY(0); }
    100% { transform: translateY(48px); }
  }

  /* Glow blobs */
  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.18;
    pointer-events: none;
  }
  .blob-red {
    width: 500px; height: 500px;
    background: radial-gradient(circle, #ff3c3c, transparent 70%);
    top: -120px; left: -100px;
    animation: floatA 12s ease-in-out infinite;
  }
  .blob-orange {
    width: 350px; height: 350px;
    background: radial-gradient(circle, #ff7a00, transparent 70%);
    bottom: -80px; right: -60px;
    animation: floatB 15s ease-in-out infinite;
  }

  @keyframes floatA {
    0%, 100% { transform: translate(0,0); }
    50% { transform: translate(40px, 30px); }
  }
  @keyframes floatB {
    0%, 100% { transform: translate(0,0); }
    50% { transform: translate(-30px, -40px); }
  }

  /* Card */
  .card {
    position: relative;
    z-index: 10;
    background: rgba(12, 16, 24, 0.85);
    border: 1px solid rgba(255, 80, 80, 0.15);
    border-radius: 24px;
    padding: 48px 44px;
    width: 100%;
    max-width: 440px;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.03),
      0 24px 80px rgba(0,0,0,0.7),
      0 0 60px rgba(255,50,50,0.06);
    backdrop-filter: blur(20px);
    animation: cardIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(32px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Header badge */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 60, 60, 0.12);
    border: 1px solid rgba(255, 60, 60, 0.2);
    border-radius: 100px;
    padding: 4px 12px;
    font-size: 11px;
    font-weight: 500;
    color: #ff6b6b;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  .badge-dot {
    width: 6px; height: 6px;
    background: #ff3c3c;
    border-radius: 50%;
    animation: pulse 1.8s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }

  /* Title */
  .title {
    font-family: 'Syne', sans-serif;
    font-size: 30px;
    font-weight: 800;
    color: #f0f2f5;
    line-height: 1.1;
    margin-bottom: 6px;
    letter-spacing: -0.5px;
  }

  .subtitle {
    font-size: 13.5px;
    color: rgba(180, 190, 210, 0.55);
    margin-bottom: 32px;
    line-height: 1.5;
  }

  /* View transition wrapper */
  .view {
    animation: viewIn 0.35s ease both;
  }

  @keyframes viewIn {
    from { opacity: 0; transform: translateX(16px); }
    to { opacity: 1; transform: translateX(0); }
  }

  /* Form */
  .field {
    margin-bottom: 16px;
  }

  .field label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: rgba(180, 190, 210, 0.7);
    margin-bottom: 8px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .field input {
    width: 100%;
    padding: 13px 16px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    color: #e8ecf4;
    font-size: 14.5px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }

  .field input::placeholder {
    color: rgba(180, 190, 210, 0.28);
  }

  .field input:focus {
    border-color: rgba(255, 80, 80, 0.5);
    background: rgba(255, 255, 255, 0.06);
    box-shadow: 0 0 0 3px rgba(255, 60, 60, 0.1);
  }

  .field input.input-error {
    border-color: rgba(248, 113, 113, 0.65);
    background: rgba(248, 113, 113, 0.09);
    box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.12);
  }

  .field-error {
    margin-top: 7px;
    font-size: 12px;
    color: #fca5a5;
    line-height: 1.35;
  }

  /* Forgot row */
  .forgot-row {
    display: flex;
    justify-content: flex-end;
    margin-top: -6px;
    margin-bottom: 24px;
  }

  /* Primary button */
  .btn-primary {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #ff3c3c, #ff7a00);
    border: none;
    border-radius: 12px;
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 24px rgba(255, 60, 60, 0.3);
    position: relative;
    overflow: hidden;
  }

  .btn-primary::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(255, 60, 60, 0.45);
    opacity: 0.95;
  }

  .btn-primary:hover::after {
    opacity: 1;
  }

  .btn-primary:active {
    transform: translateY(0);
  }

  /* Divider */
  .divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.06);
    margin: 24px 0;
  }

  /* Footer text */
  .footer-text {
    text-align: center;
    font-size: 13.5px;
    color: rgba(180, 190, 210, 0.45);
  }

  /* Link button */
  .link-btn {
    background: none;
    border: none;
    color: #ff7a5c;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    padding: 0;
    text-decoration: none;
    transition: color 0.2s;
    font-weight: 500;
  }

  .link-btn:hover {
    color: #ff3c3c;
    text-decoration: underline;
  }

  .link-btn.inline {
    font-size: 13.5px;
  }

  /* Back link */
  .back-link {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 20px;
    justify-content: center;
  }

  /* Hint text */
  .hint-text {
    font-size: 13px;
    color: rgba(180, 190, 210, 0.4);
    line-height: 1.55;
    margin-bottom: 24px;
  }

  /* Logo mark */
  .logo-mark {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 28px;
  }

  .logo-icon {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, #ff3c3c, #ff7a00);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(255,60,60,0.35);
    flex-shrink: 0;
  }

  .logo-text {
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(200, 210, 230, 0.6);
    line-height: 1.2;
  }
`;

function VirusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

export default function Login({
  setPage,
  onNotify,
  onLogin,
  onRequestPasswordReset,
  onResetPassword,
}) {
  const [view, setView] = useState("login"); // "login" | "forgot" | "reset"
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetForm, setResetForm] = useState({ password: "", confirmPassword: "" });
  const [loginErrors, setLoginErrors] = useState({});
  const [forgotError, setForgotError] = useState("");
  const [resetErrors, setResetErrors] = useState({});

  function handleViewChange(nextView) {
    setView(nextView);
    setLoginErrors({});
    setForgotError("");
    setResetErrors({});
  }

  function handleLoginSubmit() {
    const nextErrors = {};

    if (!loginForm.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(loginForm.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!loginForm.password.trim()) {
      nextErrors.password = "Password is required.";
    }

    setLoginErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      onNotify?.("Please correct the highlighted login fields.", "error");
      return;
    }

    const loginResult = onLogin?.({
      email: loginForm.email.trim(),
      password: loginForm.password,
    });

    if (!loginResult?.ok) {
      const fieldName = loginResult?.field === "password" ? "password" : "email";
      setLoginErrors((prev) => ({
        ...prev,
        [fieldName]: loginResult?.error || "Invalid credentials.",
      }));
      onNotify?.(loginResult?.error || "Invalid credentials.", "error");
      return;
    }

    onNotify?.("Sign-in successful.", "success");
    setPage("input");
  }

  function handleForgotSubmit() {
    if (!forgotEmail.trim()) {
      setForgotError("Email is required.");
      onNotify?.("Please enter the email address associated with your account.", "error");
      return;
    }

    if (!EMAIL_REGEX.test(forgotEmail.trim())) {
      setForgotError("Please enter a valid email address.");
      onNotify?.("Unable to send a reset request. Please enter a valid email address.", "error");
      return;
    }

    const forgotResult = onRequestPasswordReset?.(forgotEmail.trim());
    if (!forgotResult?.ok) {
      setForgotError(forgotResult?.error || "No account found for this email.");
      onNotify?.(forgotResult?.error || "No account found for this email.", "error");
      return;
    }

    setForgotError("");
    onNotify?.("Email verified. Please set a new password.", "info");
    handleViewChange("reset");
  }

  function handleResetSubmit() {
    const nextErrors = {};

    if (!resetForm.password.trim()) {
      nextErrors.password = "New password is required.";
    } else if (resetForm.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (!resetForm.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Please confirm your new password.";
    } else if (resetForm.password !== resetForm.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setResetErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      onNotify?.("Please correct the highlighted password reset fields.", "error");
      return;
    }

    if (!forgotEmail.trim()) {
      onNotify?.("Please begin the password reset process by entering your email.", "error");
      handleViewChange("forgot");
      return;
    }

    const resetResult = onResetPassword?.({
      email: forgotEmail.trim(),
      password: resetForm.password,
    });
    if (!resetResult?.ok) {
      setResetErrors({ password: resetResult?.error || "Password reset failed." });
      onNotify?.(resetResult?.error || "Password reset failed.", "error");
      return;
    }

    onNotify?.("Password updated successfully. Please sign in.", "success");
    setResetForm({ password: "", confirmPassword: "" });
    setLoginForm((prev) => ({ ...prev, password: "" }));
    handleViewChange("login");
  }

  return (
    <>
      <style>{styles}</style>
      <div className="esp-root">
        <div className="blob blob-red" />
        <div className="blob blob-orange" />

        <div className="card">
          {/* Logo */}
          <div className="logo-mark">
            <div className="logo-icon"><VirusIcon /></div>
            <div className="logo-text">OutbreakX</div>
          </div>
          <div className="back-link">
            <button className="link-btn" onClick={() => setPage("landing")} type="button">
              <ArrowLeft /> Back
            </button>
          </div>

          {/* ── LOGIN VIEW ── */}
          {view === "login" && (
            <div className="view" key="login">
              <div className="badge">
                <span className="badge-dot" />
                AI-Powered System
              </div>
              <div className="title">Welcome Back</div>
              <div className="subtitle">Sign in to access the prediction dashboard.</div>

              <div className="field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={loginForm.email}
                  className={loginErrors.email ? "input-error" : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLoginForm((prev) => ({ ...prev, email: value }));
                    if (loginErrors.email) {
                      setLoginErrors((prev) => ({ ...prev, email: "" }));
                    }
                  }}
                />
                {loginErrors.email && <p className="field-error">{loginErrors.email}</p>}
              </div>

              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  className={loginErrors.password ? "input-error" : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLoginForm((prev) => ({ ...prev, password: value }));
                    if (loginErrors.password) {
                      setLoginErrors((prev) => ({ ...prev, password: "" }));
                    }
                  }}
                />
                {loginErrors.password && <p className="field-error">{loginErrors.password}</p>}
              </div>

              <div className="forgot-row">
                <button className="link-btn" onClick={() => handleViewChange("forgot")} type="button">
                  Forgot Password?
                </button>
              </div>

              <button className="btn-primary" type="button" onClick={handleLoginSubmit}>
                Log In
              </button>

              <div className="divider" />

              <div className="footer-text">
                Don't have an account?{" "}
                <button
                  className="link-btn inline"
                  onClick={() => setPage("signup")}
                  type="button"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}

          {/* ── FORGOT PASSWORD VIEW ── */}
          {view === "forgot" && (
            <div className="view" key="forgot">
              <div className="badge">
                <span className="badge-dot" />
                Account Recovery
              </div>
              <div className="title">Forgot Password</div>
              <div className="subtitle">We'll send a reset link to your inbox.</div>

              <p className="hint-text">
                Enter the email address associated with your account and we'll email you a password reset link.
              </p>

              <div className="field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={forgotEmail}
                  className={forgotError ? "input-error" : ""}
                  onChange={(e) => {
                    setForgotEmail(e.target.value);
                    if (forgotError) {
                      setForgotError("");
                    }
                  }}
                />
                {forgotError && <p className="field-error">{forgotError}</p>}
              </div>

              <button className="btn-primary" type="button" style={{ marginTop: 8 }} onClick={handleForgotSubmit}>
                Send Reset Link
              </button>

              <div className="back-link">
                <button
                  className="link-btn"
                  onClick={() => handleViewChange("login")}
                  style={{ display: "flex", alignItems: "center", gap: 5 }}
                  type="button"
                >
                  <ArrowLeft /> Back to Login
                </button>
              </div>
            </div>
          )}

          {/* ── RESET PASSWORD VIEW ── */}
          {view === "reset" && (
            <div className="view" key="reset">
              <div className="badge">
                <span className="badge-dot" />
                Set New Password
              </div>
              <div className="title">Reset Password</div>
              <div className="subtitle">Choose a strong new password below.</div>

              <div className="field">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={resetForm.password}
                  className={resetErrors.password ? "input-error" : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setResetForm((prev) => ({ ...prev, password: value }));
                    if (resetErrors.password) {
                      setResetErrors((prev) => ({ ...prev, password: "" }));
                    }
                  }}
                />
                {resetErrors.password && <p className="field-error">{resetErrors.password}</p>}
              </div>

              <div className="field">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={resetForm.confirmPassword}
                  className={resetErrors.confirmPassword ? "input-error" : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setResetForm((prev) => ({ ...prev, confirmPassword: value }));
                    if (resetErrors.confirmPassword) {
                      setResetErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }
                  }}
                />
                {resetErrors.confirmPassword && <p className="field-error">{resetErrors.confirmPassword}</p>}
              </div>

              <button className="btn-primary" type="button" style={{ marginTop: 8 }} onClick={handleResetSubmit}>
                Reset Password
              </button>

              <div className="back-link">
                <button
                  className="link-btn"
                  onClick={() => handleViewChange("login")}
                  style={{ display: "flex", alignItems: "center", gap: 5 }}
                  type="button"
                >
                  <ArrowLeft /> Back to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}