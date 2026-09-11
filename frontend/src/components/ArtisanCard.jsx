import React from "react";
import { Link } from "react-router-dom";
import RatingStars from "./RatingStars.jsx";
import "../styles/component.css"

const ArtisanCard = ({ id, name, category, location, rating, image, price, distance }) => {
    return (
        <div className="artisan-card">
            <div className="artisan-header">
                <div className="artisan-avatar">
                    {image ? <img src={image} alt={name} /> : <span>{name.charAt(0)}</span>}
                </div>
                <div className="artisan-info">
                    <h3>{name}</h3>
                    <p className="artisan-category">{category}</p>
                    <p className="artisan-location">{location} {distance && <span style={{ color: 'var(--color-text-muted)', fontSize: ').85rem' }}>({distance}km)</span>}</p>
                    <div style={{display: 'flex', justifyContent:'space-between', alignItems: 'center', marginTop: '4px'}}>
                        <RatingStars value={rating} />
                        {price && <span style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>GHS {price}</span>}
                    </div>
                </div>
            </div>
        </div>      
    );
};