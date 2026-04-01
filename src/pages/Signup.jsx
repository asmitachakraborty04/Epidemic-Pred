import { useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(ellipse at 60% 20%, #0f2027 0%, #090e1a 60%, #000 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "20px",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "20px",
    padding: "44px 40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
    backdropFilter: "blur(18px)",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(56,189,248,0.12)",
    border: "1px solid rgba(56,189,248,0.25)",
    color: "#38bdf8",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    borderRadius: "999px",
    padding: "4px 12px",
    marginBottom: "18px",
  },
  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#38bdf8",
    boxShadow: "0 0 6px #38bdf8",
    animation: "pulse 2s infinite",
  },
  title: {
    color: "#f1f5f9",
    fontSize: "28px",
    fontWeight: 700,
    margin: "0 0 6px 0",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "14px",
    margin: "0 0 32px 0",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "24px",
  },
  label: {
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: 500,
    marginBottom: "6px",
    display: "block",
  },
  inputWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  icon: {
    position: "absolute",
    left: "14px",
    color: "#475569",
    fontSize: "16px",
    pointerEvents: "none",
    lineHeight: 1,
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#e2e8f0",
    fontSize: "14px",
    padding: "11px 14px 11px 40px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  },
  inputError: {
    borderColor: "rgba(248,113,113,0.75)",
    background: "rgba(248,113,113,0.08)",
    boxShadow: "0 0 0 3px rgba(248,113,113,0.12)",
  },
  errorText: {
    marginTop: "6px",
    color: "#fca5a5",
    fontSize: "12px",
    lineHeight: 1.35,
  },
  helperText: {
    marginTop: "6px",
    color: "#64748b",
    fontSize: "12px",
  },
  button: {
    width: "100%",
    background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "15px",
    letterSpacing: "0.02em",
    border: "none",
    borderRadius: "10px",
    padding: "13px",
    cursor: "pointer",
    transition: "opacity 0.2s, transform 0.15s, box-shadow 0.2s",
    boxShadow: "0 4px 20px rgba(14,165,233,0.35)",
  },
  footer: {
    textAlign: "center",
    marginTop: "22px",
    color: "#475569",
    fontSize: "13.5px",
  },
  link: {
    color: "#38bdf8",
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
    marginLeft: "4px",
  },
};

export default function Signup({ setPage, onNotify, onSignup }) {
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const focusStyle = (name) =>
    focused === name
      ? { borderColor: "rgba(14,165,233,0.6)", boxShadow: "0 0 0 3px rgba(14,165,233,0.12)" }
      : {};

  function inputStyle(name) {
    return {
      ...styles.input,
      ...focusStyle(name),
      ...(errors[name] ? styles.inputError : {}),
    };
  }

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  async function handleSignup() {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Full name is required.";
    } else if (form.name.trim().length < 2) {
      nextErrors.name = "Name must be at least 2 characters.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      nextErrors.password = "Include at least one uppercase letter and one number.";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      onNotify?.("Please correct the highlighted signup fields.", "error");
      return;
    }

    const signupResult = await onSignup?.({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    if (!signupResult?.ok) {
      const fieldName = signupResult?.field === "name" ? "name" : "email";
      setErrors((prev) => ({
        ...prev,
        [fieldName]: signupResult?.error || "Unable to create account.",
      }));
      onNotify?.(signupResult?.error || "Unable to create account.", "error");
      return;
    }

    onNotify?.("Your account has been created successfully.", "success");
    setPage("input");
  }

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <div style={styles.card}>
        {/* Badge */}
        <div style={styles.badge}>
          <span style={styles.dot} />
          OutbreakX
        </div>

        {/* Heading */}
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Join to access AI-powered outbreak analytics</p>

        {/* Back to Landing */}
        <div style={{ marginBottom: 12, textAlign: 'center' }}>
          <button
            style={{
              ...styles.link,
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
            type="button"
            onClick={() => setPage("landing")}
          >
            ← Back to Landing
          </button>
        </div>

        {/* Fields */}
        <div style={styles.fieldGroup}>
          {/* Full Name */}
          <div>
            <label style={styles.label}>Full Name</label>
            <div style={styles.inputWrap}>
              <span style={styles.icon}>👤</span>
              <input
                type="text"
                placeholder="Jane Doe"
                style={inputStyle("name")}
                value={form.name}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>
            {errors.name && <p style={styles.errorText}>{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrap}>
              <span style={styles.icon}>✉️</span>
              <input
                type="email"
                placeholder="jane@example.com"
                style={inputStyle("email")}
                value={form.email}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>
            {errors.email && <p style={styles.errorText}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrap}>
              <span style={styles.icon}>🔒</span>
              <input
                type="password"
                placeholder="••••••••"
                style={inputStyle("password")}
                value={form.password}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                onChange={(e) => updateField("password", e.target.value)}
              />
            </div>
            {errors.password ? (
              <p style={styles.errorText}>{errors.password}</p>
            ) : (
              <p style={styles.helperText}>Use at least 8 characters, 1 uppercase letter, and 1 number.</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label style={styles.label}>Confirm Password</label>
            <div style={styles.inputWrap}>
              <span style={styles.icon}>✅</span>
              <input
                type="password"
                placeholder="••••••••"
                style={inputStyle("confirmPassword")}
                value={form.confirmPassword}
                onFocus={() => setFocused("confirmPassword")}
                onBlur={() => setFocused(null)}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
              />
            </div>
            {errors.confirmPassword && <p style={styles.errorText}>{errors.confirmPassword}</p>}
          </div>
        </div>

        {/* Sign Up Button */}
        <button
          style={{
            ...styles.button,
            opacity: hover ? 0.88 : 1,
            transform: hover ? "translateY(-1px)" : "translateY(0)",
            boxShadow: hover
              ? "0 8px 28px rgba(14,165,233,0.5)"
              : styles.button.boxShadow,
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          type="button"
          onClick={handleSignup}
        >
          Sign Up →
        </button>

        {/* Footer */}
        <p style={styles.footer}>
          Already have an account?
          <button
            style={{ ...styles.link, border: 'none', background: 'none', padding: 0 }}
            type="button"
            onClick={() => setPage("login")}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}