import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/icon.png";
import "../styles/login.css";

const SignupPage = () => {
    const navigate = useNavigate();
    const [accountType, setAccountType] = useState("customer");
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        const { error: authError } = await authApi.signUp({
            email: formData.email,
            password: formData.password,
            username: formData.username,
            role: accountType,
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        setLoading(false);
        // Supabase sends a confirmation email — redirect to login with message
        navigate("/login", { state: { message: "Check your email to confirm your account, then log in!" } });

    };
    return (
        <div className="cl-login-page">
            <div className="cl-login-card">
                <div className="cl-login-header">
                    <div className="cl-login-logo-wrapper">
                        <img src={logo} alt="CraftLink Logo" className="cl-login-header-logo" />
                        <div className="cl-login-logo">Adwuma</div>
                    </div>
                    <h1 className="cl-login-title">Create Account</h1>
                    <p className="cl-login-subtitle">Join Adwuma and find the best artisans</p>
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
                        Provider
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="cl-login-form">
                    {error && (
                        <div style={{ background: "rgba(244,67,54,0.1)", border: "1px solid #f44336", color: "#f44336", padding: "12px 16px", borderRadius: "10px", marginBottom: "16px", fontSize: "0.9rem" }}>
                            {error}
                        </div>
                    )}

                    <label className="cl-login-label">
                        Username
                        <input
                            type="text"
                            name="username"
                            className="cl-login-input"
                            placeholder="johndoe123"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="cl-login-label">
                        Email Address
                        <input
                            type="email"
                            name="email"
                            className="cl-login-input"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="cl-login-label">
                        Password
                        <input
                            type="password"
                            name="password"
                            className="cl-login-input"
                            placeholder="Min. 6 characters"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="cl-login-label">
                        Confirm Password
                        <input
                            type="password"
                            name="confirmPassword"
                            className="cl-login-input"
                            placeholder="Min. 6 characters"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <button
                        type="submit"
                        className="cl-login-button"
                        style={{ marginTop: "20px", opacity: loading ? 0.7 : 1 }}
                        disabled={loading}
                    >
                        {loading ? "Creating Account…" : "Create Account"}
                    </button>

                    <p style={{ textAlign: "center", marginTop: "24px", color: "var(--color-text-dim)", fontSize: "0.95rem" }}>
                        Already have an account?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            style={{ color: "var(--color-gold)", cursor: "pointer", fontWeight: "600" }}
                        >
                            Log In
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;