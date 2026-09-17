import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

import { useAuth } from "../context/AuthContext.jsx";
import { reviewsApi } from "../lib/supabase.js";
import "../styles/components.css";

const InteractiveStars = ({ rating, setRating }) => (
    <div style={{ display: "flex", gap: "8px", fontSize: "2rem", cursor: "pointer" }}>
        {[1, 2, 3, 4, 5].map((star) => (
            <span
                key={star}
                onClick={() => setRating(star)}
                style={{ color: rating >= star ? "#d4af37" : "#333", transition: "color 0.2s" }}
            >
                ★
            </span>
        ))}
    </div>
);

const ReviewPage = () => {
    const { artisanId } = useParams();
    const [searchParams] = useSearchParams();
    const requestId = searchParams.get("request");

    const { user } = useAuth();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) { setError("Please select a star rating."); return; }
        if (!user) { setError("You must be logged in to leave a review."); return; }

        setSubmitting(true);
        setError("");

        const { error: reviewError } = await reviewsApi.create({
            requestId: requestId || null,
            customerId: user.id,
            artisanId,
            rating,
            comment,
        });

        setSubmitting(false);
        if (reviewError) {
            setError(reviewError.message);
        } else {
            navigate("/dashboard");
        }
    };

    return (
        <div className="page">
            <Navbar />
            <main className="page-content" style={{ maxWidth: "600px" }}>
                <div className="page-header">
                    <h1 className="page-title">Leave a Review</h1>
                    <p className="page-subtitle">Share your experience to help others find the best artisans.</p>
                </div>

                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div style={{ background: "rgba(244,67,54,0.1)", border: "1px solid #f44336", color: "#f44336", padding: "12px 16px", borderRadius: "10px", marginBottom: "16px", fontSize: "0.9rem" }}>
                                {error}
                            </div>
                        )}

                        <div className="form-group" style={{ textAlign: "center", padding: "20px 0" }}>
                            <label className="form-label" style={{ fontSize: "1.2rem", color: "#fff" }}>
                                Rate your experience
                            </label>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <InteractiveStars rating={rating} setRating={setRating} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Write your review</label>
                            <textarea
                                className="form-textarea"
                                placeholder="Tell us what went well, how the communication was, and what could be better..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: "100%", marginTop: "16px", opacity: submitting ? 0.7 : 1 }}
                            disabled={submitting}
                        >
                            {submitting ? "Submitting…" : "Submit Review"}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ReviewPage;