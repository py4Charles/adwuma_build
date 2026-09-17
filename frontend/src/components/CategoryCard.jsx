import React from "react";
import ServiceCard from "./ServiceCard.jsx";

const CategoryCard = ({ title, items }) => {
    return (
        <section className="category-section">
            <h3 className="section-title" style={{ fontSize: "1.2rem", paddingBottom: "0.2rem" }}>
                {title}
            </h3>
            <div className="cards-grid">
                {items.map((item, i) => (
                    <ServiceCard
                        key={i}
                        icon={item.icon}
                        name={item.name}
                        linkTo={`/search?service=${encodeURIComponent(item.name.toLowerCase())}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default CategoryCard;