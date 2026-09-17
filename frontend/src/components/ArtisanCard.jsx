import { Link } from "react-router-dom";
import RatingStars from "./RatingStars.jsx";
import "../styles/components.css"

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
          <p className="artisan-location">{location && <p>📍 {location}</p>} {distance && <span style={{color: 'var(--color-text-muted)', fontSize: '0.85rem'}}>({distance}km)</span>}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
            <RatingStars value={rating} />
            {price && <span style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>GHS {price}</span>}
          </div>
        </div>
      </div>
      <div className="artisan-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <Link to={`/artisans/${id}`} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>View Profile</Link>
        <Link to={`/service-request?artisan=${encodeURIComponent(name)}`} className="btn-primary" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>Book Now</Link>
        <Link to={`/chat/new?artisan=${encodeURIComponent(name)}`} className="btn-secondary" style={{ gridColumn: 'span 2', padding: '8px 12px', fontSize: '0.9rem', background: 'rgba(212, 175, 55, 0.05)' }}>💬 Chat with Professional</Link>
      </div>
    </div>
  );
};

export default ArtisanCard;