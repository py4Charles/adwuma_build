import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ArtisanCard from "../components/ArtisanCard.jsx";
import "../styles/components.css";
import "../styles/utils.css";

// Extended Mock Data for Artisans
const MOCK_ARTISANS = [
    { id: 1, name: "Kwame Mensah", category: "Domestic", subCategory: "Electrical Repairs", location: "Accra, East Legon", rating: 4.8, distance: "2.1", price: 150 },
    { id: 2, name: "David Osei", category: "Domestic", subCategory: "Plumbing", location: "Osu, Accra", rating: 4.5, distance: "5.4", price: 120 },
    { id: 3, name: "Sarah Addo", category: "Domestic", subCategory: "Cleaning", location: "Tema, Community 1", rating: 4.9, distance: "12.0", price: 100 },
    { id: 4, name: "Francis Baah", category: "Commercial", subCategory: "Electrical Installation", location: "Spintex, Accra", rating: 4.2, distance: "8.5", price: 450 },
    { id: 5, name: "Grace Quaye", category: "Professional", subCategory: "Catering", location: "Cantonments, Accra", rating: 5.0, distance: "3.2", price: 250 },
    { id: 6, name: "Josephine Kusi", category: "Industrial", subCategory: "Mechanical Plumbing", location: "Madina, Accra", rating: 3.8, distance: "7.1", price: 600 },
    { id: 7, name: "Daniel Koomson", category: "Domestic", subCategory: "Plumbing", location: "East Legon, Accra", rating: 4.7, distance: "3.0", price: 150 },
    { id: 8, name: "Abigail Nettey", category: "Domestic", subCategory: "Plumbing", location: "Cantonments, Accra", rating: 5.0, distance: "4.5", price: 200 },
    { id: 9, name: "Clement Appiah", category: "Commercial", subCategory: "HVAC Maintenance", location: "Airport Residential", rating: 4.6, distance: "4.2", price: 350 },
    { id: 10, name: "Linda Mensah", category: "Professional", subCategory: "Accounting", location: "Labone, Accra", rating: 4.9, distance: "6.1", price: 500 },
    { id: 11, name: "Samuel Tetteh", category: "Industrial", subCategory: "Welding & Fabrication", location: "Ashaiman, Tema", rating: 4.3, distance: "15.5", price: 800 },
    { id: 12, name: "Evelyn Boateng", category: "Domestic", subCategory: "Interior Decor", location: "Dzorwulu, Accra", rating: 4.8, distance: "5.0", price: 300 },
];

const CategorySearchResultsPage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialCategory = searchParams.get("service") || "Domestic";

    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [filteredArtisans, setFilteredArtisans] = useState([]);
    const [sortBy, setSortBy] = useState("rating");

    // Custom Filters
    const [minRating, setMinRating] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [maxDistance, setMaxDistance] = useState(50);
    const [selectedLocation, setSelectedLocation] = useState("All");

    const locations = ["All", "Accra", "Tema", "East Legon", "Osu", "Spintex", "Cantonments", "Labone"];

    useEffect(() => {
        let results = MOCK_ARTISANS;

        // 1. Filter by Category (Domestic, Commercial, etc)
        results = results.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase());

        // 2. Filter by Search Query (Name or subCategory)
        if (searchQuery) {
            results = results.filter(a =>
                a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.subCategory.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // 3. By Minimum Rating
        results = results.filter(a => a.rating >= minRating);

        // 4. By Maximum Price
        results = results.filter(a => a.price <= maxPrice);

        // 5. By Max Distance
        results = results.filter(a => parseFloat(a.distance) <= maxDistance);

        // 6. By Location
        if (selectedLocation !== "All") {
            results = results.filter(a => a.location.toLowerCase().includes(selectedLocation.toLowerCase()));
        }

        // Sort logic
        if (sortBy === "rating") {
            results.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === "distance") {
            results.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        } else if (sortBy === "price") {
            results.sort((a, b) => a.price - b.price);
        }

        setFilteredArtisans([...results]);
    }, [searchQuery, activeCategory, sortBy, minRating, maxPrice, maxDistance, selectedLocation]);

    return (
        <div className="page" style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
            <Navbar />

            {/* SEARCH HEADER */}
            <div style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)", padding: "2rem 0" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center", maxWidth: "800px" }}>
                        <div style={{ flex: 1, position: "relative" }}>
                            <input
                                type="text"
                                placeholder={`Search for professionals in ${activeCategory}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "1rem 3rem 1rem 1.5rem",
                                    borderRadius: "12px",
                                    background: "var(--color-bg)",
                                    border: "1px solid var(--color-border)",
                                    color: "white",
                                    fontSize: "1.1rem"
                                }}
                            />
                            <span style={{ position: "absolute", right: "1.2rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-gold)", fontSize: "1.2rem" }}>🔍</span>
                        </div>
                        <button className="btn-primary" style={{ padding: "0.9rem 2rem", borderRadius: "12px" }}>Search Now</button>
                    </div>
                </div>
            </div>

            <main style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '3rem 2rem', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '3rem' }}>

                {/* SIDEBAR FILTERS */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                    <div>
                        <h3 style={{ color: "var(--color-text-main)", fontSize: "1.2rem", marginBottom: "1.5rem" }}>Filter Search</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                            {/* Category Tab Selector */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ color: "var(--color-text-dim)", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase" }}>Category</label>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                    {["Domestic", "Commercial", "Industrial", "Professional"].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            style={{
                                                padding: "8px 14px",
                                                borderRadius: "8px",
                                                background: activeCategory === cat ? "var(--color-gold)" : "var(--color-surface)",
                                                color: activeCategory === cat ? "black" : "var(--color-text-main)",
                                                border: "1px solid" + (activeCategory === cat ? "var(--color-gold)" : "var(--color-border)"),
                                                cursor: "pointer",
                                                fontSize: "0.85rem",
                                                fontWeight: "600"
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <label style={{ color: "var(--color-text-dim)", fontSize: "0.9rem", fontWeight: "600" }}>MAX BUDGET</label>
                                    <span style={{ color: "var(--color-gold)", fontWeight: "bold" }}>GHS {maxPrice}</span>
                                </div>
                                <input
                                    type="range"
                                    min="50"
                                    max="1000"
                                    step="50"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                    style={{ width: "100%", accentColor: "var(--color-gold)" }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
                                    <span>GHS 50</span>
                                    <span>GHS 1000+</span>
                                </div>
                            </div>

                            {/* Location */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ color: "var(--color-text-dim)", fontSize: "0.9rem" }}>LOCATION</label>
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    style={{ background: "var(--color-surface)", color: "var(--color-text-main)", border: "1px solid var(--color-border)", padding: "0.8rem", borderRadius: "8px" }}
                                >
                                    {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                </select>
                            </div>

                            {/* Rating */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <label style={{ color: "var(--color-text-dim)", fontSize: "0.9rem" }}>MINIMUM RATING</label>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    {[4.5, 4.0, 3.5, 0].map(val => (
                                        <label key={val} style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--color-text-muted)", cursor: "pointer" }}>
                                            <input
                                                type="radio"
                                                name="rating"
                                                checked={minRating === val}
                                                onChange={() => setMinRating(val)}
                                                style={{ accentColor: "var(--color-gold)" }}
                                            />
                                            {val === 0 ? "Any Rating" : `${val} Stars & Up`}
                                        </label>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                    <button
                        style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text-dim)", cursor: "pointer" }}
                        onClick={() => {
                            setMaxPrice(1000);
                            setMinRating(0);
                            setSelectedLocation("All");
                            setSearchQuery("");
                        }}
                    >
                        Clear Filters
                    </button>
                </aside>

                {/* RESULTS AREA */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "2rem" }}>
                        <h2 style={{ fontSize: "1.5rem", color: "var(--color-text-main)" }}>
                            Professionals {activeCategory && <span>in <span style={{ color: 'var(--color-gold)' }}>{activeCategory}</span></span>}
                        </h2>

                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <span style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{ background: "transparent", color: "var(--color-text-main)", border: "none", borderBottom: "1px solid var(--color-gold)", padding: "0.3rem", fontSize: "0.9rem", cursor: "pointer", outline: "none" }}
                            >
                                <option value="rating">Rating</option>
                                <option value="distance">Distance</option>
                                <option value="price">Price</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "2rem" }}>
                        {filteredArtisans.length > 0 ? (
                            filteredArtisans.map((artisan) => (
                                <div key={artisan.id} style={{ animation: "fadeIn 0.5s ease-out forwards" }}>
                                    <ArtisanCard
                                        id={artisan.id}
                                        name={artisan.name}
                                        category={artisan.subCategory}
                                        location={artisan.location}
                                        rating={artisan.rating}
                                        price={artisan.price}
                                        distance={artisan.distance}
                                    />
                                </div>
                            ))
                        ) : (
                            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "6rem 2rem", background: "var(--color-surface)", borderRadius: "24px", border: "1px dashed var(--color-border)" }}>
                                <span style={{ fontSize: "3rem", display: "block", marginBottom: "1.5rem" }}>🔍</span>
                                <h3 style={{ color: "var(--color-text-main)", fontSize: "1.5rem", marginBottom: "1rem" }}>No matching professionals found</h3>
                                <p style={{ color: "var(--color-text-dim)", marginBottom: "2rem", maxWidth: "400px", margin: "0 auto 2rem" }}>
                                    Try adjusting your filters or search query to find more artisans in the {activeCategory} category.
                                </p>
                                <button
                                    className="btn-secondary"
                                    onClick={() => { setMaxPrice(1000); setSearchQuery(""); setSelectedLocation("All"); }}
                                    style={{ padding: "0.8rem 2rem" }}
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>
                </section>

            </main>
            <Footer />

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default CategorySearchResultsPage;