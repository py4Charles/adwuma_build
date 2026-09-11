import React from "react";

const RatingStars = ( value= 0, count= 5) => {
  const stars = Array.from({ length: count }, (_, i) => i + 1);
  return (
    <span className="rating-stars">
      {stars.map((star) => (
        <span key={star}>{value >= star ? "★" : "☆"}</span>
      ))}
    </span>
  );
};

export default RatingStars;
