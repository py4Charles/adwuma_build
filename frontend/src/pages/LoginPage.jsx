import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/icon.png"
import "../styles/login.css"

const LoginPage = () => {
    const navigate = useNavigate();
    const [accountType, setAccountType] = useState("customer");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { data, error: authError } = await authApi.signIn({ email, password });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        const role = data?.user?.user_metadata?.role || accountType;
        setLoading(false);

        if (role === "provider") {
            navigate("/provider-dashboard");
        } else {
            navigate("/dashboard");
        }
    };
    return (
        <div className="cl-login-page">
            <div className="cl-login-card">
                <div className="cl-login-header">
                    <div className="cl-login-logo-wrapper">
                        <img src={logo} alt="Adwuma Logo" className="cl-login-header-logo" />
                        <div className="cl-login-logo">Adwuma</div>
                    </div>
                    <h1 className="cl-login-title">Welcome Back</h1>
                    <p className="cl-login-subtitle">Sign in to continue to your account</p>
                </div>

                <div className="cl-login-toggle" style={{ marginBottom: "24px" }}>
                    <button
                        type="button"
                        className={`cl-login-toggle__option ${accountType === "customer" ? "cl-login-toggle__option--active" : ""}`}
                        onClick={() => setAccountType("customer")}
                    >
                        Customer
                    </button>
                    <button
                        type="button"
                        className={`cl-login-toggle__option ${accountType === "provider" ? "cl-login-toggle__option--active" : ""}`}
                        onClick={() => setAccountType("provider")}
                    >
                        Service Provider
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="cl-login-form">
                    {error && (
                        <div style={{ background: "rgba(244,67,54,0.1)", border: "1px solid #f44336", color: "#f44336", padding: "12px 16px", borderRadius: "10px", marginBottom: "16px", fontSize: "0.9rem" }}>
                            {error}
                        </div>
                    )}

                    <label className="cl-login-label">
                        Email Address
                        <input
                            type="email"
                            className="cl-login-input"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>

                    <label className="cl-login-label">
                        Password
                        <input
                            type="password"
                            className="cl-login-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>

                    <button
                        type="submit"
                        className="cl-login-button"
                        style={{ marginTop: "10px", opacity: loading ? 0.7 : 1 }}
                        disabled={loading}
                    >
                        {loading ? "Signing in…" : "Sign In"}
                    </button>

                    <p style={{ textAlign: "center", marginTop: "24px", color: "var(--color-text-dim)", fontSize: "0.95rem" }}>
                        Don&apos;t have an account?{" "}
                        <span
                            onClick={() => navigate("/signup")}
                            style={{ color: "var(--color-gold)", cursor: "pointer", fontWeight: "600"}}
                        >
                            Sign Up
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;