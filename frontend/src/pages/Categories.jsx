import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import "../styles/categories.css";

const serviceCategories = [
    {
        title: "Domestic",
        items: [
            { name: "Plumbing", icon: "🔧" },
            { name: "Electrical repairs", icon: "⚡" },
            { name: "Cleaning", icon: "🧹" },
            { name: "Carpentry", icon: "🪚" }
        ]
    },
    {
        title: "Commercial",
        items: [
            { name: "Office setup", icon: "🏢" },
            { name: "CCTV installation", icon: "📹" },
            { name: "Networking", icon: "🌐" }
        ]
    },
    {
        title: "Industrial",
        items: [
            { name: "Welding", icon: "🔥" },
            { name: "Equipment repair", icon: "⚙️" }
        ]
    },
    {
        title: "Professional",
        items: [
            { name: "Digital marketing", icon: "📈" },
            { name: "Tutors", icon: "📚" },
            { name: "Tailoring", icon: "✂️" },
            { name: "Graphic design", icon: "🎨" }
        ]
    }
];

const Categories = () => {
    return (
        <div className="page">
            <Navbar />
            <main className="page-content">
                <div className="categories-header">
                    <h1>Service Categories</h1>
                    <p>Select a category to find the right professional for your needs.</p>
                </div>

                <div className="categories-container">
                    {serviceCategories.map((section, idx) => (
                        <CategoryCard key={idx} title={section.title} items={section.items} />
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Categories;