import React from "react";
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
                        <img src={logo} alt="CraftLink Logo" className="cl-login-header-logo" />
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
            </div>
        </div>
    );
};

export default LoginPage;