import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/otp.css";

const OTP_LENGTH = 6;

const OtpVerificationPage = () => {
    const navigate = useNavigate();
    const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
    const [message, setMessage] = useState("");
    const inputsRef = useRef([]);

    const handleChange = (index, value) => {
        const clean = value.replace(/\D/g, "").slice(-1);
        const next = [...digits];
        next[index] = clean;
        setDigits(next);

        if (clean && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const code = digits.join("");

        if (code.length !== OTP_LENGTH) {
            setMessage(`Enter a ${OTP_LENGTH}-digit code.`);
            return;
        }

        if (code === "123456") {
            setMessage("Success. Redirecting...");
            setTimeout(() => navigate("/dashboard"), 800);
        } else {
            setMessage("Invalid code (demo: try 123456).");
        }
    };

    const handleResend = () => {
        setDigits(Array(OTP_LENGTH).fill(""));
        inputsRef.current[0]?.focus();
        setMessage("A new OTP has been sent.");
    };

    return (
        <div className="page">
            <Navbar />
            <main className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="otp-container">
                    <div className="otp-header">
                        <h1>OTP Verification</h1>
                        <p>Enter the {OTP_LENGTH}-digit code sent to your phone numbers.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="otp-inputs">
                            {digits.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputsRef.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="otp-input"
                                />
                            ))}
                        </div>

                        <div className="otp-message">
                            {message}
                        </div>

                        <button type="submit" className="otp-button">
                            Verify
                        </button>

                        <button
                            type="button"
                            onClick={handleResend}
                            className="otp-resend"
                        >
                            Resend OTP
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default OtpVerificationPage;