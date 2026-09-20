import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyRequestsPage from "./MyRequestsPage";
import WalletPage from "./WalletPage.jsx";
import ComplaintsPage from "./ComplaintsPage.jsx";
import AccountSettingsPage from "./AccountSettingsPage.jsx";

import logo from "../assets/icon.png";
import "../styles/dashboard.css";
import { authApi, requestsApi, walletApi, notificationsApi } from "../lib/supabase.js";
import { useAuth } from "../context/AuthContext.jsx";

// Artisan category portraits (one per sub-category); fallback for missing
const artisanImages = Object.fromEntries(
    Object.entries(
        import.meta.glob("../assets/artisan-*.png", { eager: true, import: "default" })
    ).map(([path, url]) => [path.replace(/^.*artisan-|\.png$/g, ""), url])
);
const defaultArtisanImage = artisanImages["portrait-profile"] || Object.values(artisanImages)[0];

// Sub-category name -> image slug (filename without prefix/suffix)
const subToImageSlug = {
    "Home Security & Automation": "home-security-automation",
    "Solar Power Systems": "solar-power-systems",
    "Roofing & Waterproofing": "roofing-waterproofing",
    "Advanced Renovation": "advanced-renovation",
    "Borehole & Water Systems": "borehole-water-systems",
    "Corporate Cleaning": "corporate-cleaning",
    "IT & Networking": "it-networking",
    "Commercial HVAC": "commercial-hvac",
    "Access Control": "access-control",
    "Interior Office Design": "interior-office-design",
    "Machine Servicing": "machine-servicing",
    "Industrial Wiring": "industrial-wiring",
    "Welding & Fabrications": "welding-fabrications",
    "Generator Plant Repairs": "generator-plant-repairs",
    "Cold Storage systems": "cold-storage-systems",
    "Architectural Drawing": "architectural-drawing",
    "Survey & Mapping": "survey-mapping",
    "Legal & Notary": "legal-notary",
    "Engineering Consult": "engineering-consult",
    "Financial Auditing": "financial-auditing",
};

// Professional SVG Icons
const Icons = {
    Home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
    Premium: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
    Flex: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
    Wallet: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path></svg>,
    Complaints: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><line x1="9" y1="8" x2="15" y2="8"></line><line x1="9" y1="12" x2="15" y2="12"></line></svg>,
    Account: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1-2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
    Requests: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
    Domestic: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
    Commercial: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="2"></line><line x1="15" y1="22" x2="15" y2="2"></line><line x1="4" y1="18" x2="20" y2="18"></line><line x1="4" y1="14" x2="20" y2="14"></line><line x1="4" y1="10" x2="20" y2="10"></line><line x1="4" y1="6" x2="20" y2="6"></line></svg>,
    Industrial: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20V9l4-2 4 2 4-2 4 2 4-2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"></path><path d="M11 22v-6c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v6"></path></svg>,
    Professional: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [selectedFlexService, setSelectedFlexService] = useState(null);
    const [selectedPremiumCategory, setSelectedPremiumCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState("All Regions");
    const [selectedPriceFilter, setSelectedPriceFilter] = useState("All Prices");
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [selectedArtisanProfile, setSelectedArtisanProfile] = useState(null);
    const [flexSearchQuery, setFlexSearchQuery] = useState("");
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [walletBalance, setWalletBalance] = useState(0);
    const [premiumSearchQuery, setPremiumSearchQuery] = useState("");
    const [filterExp, setFilterExp] = useState("All Experience");
    const [filterRating, setFilterRating] = useState("All Ratings");
    const [sortBy, setSortBy] = useState("Recommended");
    const [visibleArtisans, setVisibleArtisans] = useState(12);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [activeRequestCount, setActiveRequestCount] = useState(0);
    const [completedJobCount, setCompletedJobCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const { user, profile } = useAuth();
    const username = profile?.first_name || profile?.username || "There";

    // Load live stats from Supabase
    useEffect(() => {
        if (!user) return;
        const loadStats = async () => {
            const [{ data: w }, { data: reqs }, { data: notifs }] = await Promise.all([
                walletApi.get(user.id),
                requestsApi.listMine(user.id),
                notificationsApi.listMine(user.id),
            ]);
            if (w) setWalletBalance(Number(w.balance));
            if (reqs) {
                setActiveRequestCount(reqs.filter((r) => ["pending", "in_progress"].includes(r.status)).length);
                setCompletedJobCount(reqs.filter((r) => r.status === "completed").length);
            }
            if (notifs) setNotifications(notifs.map((n) => ({ ...n, unread: !n.is_read })));
        };
        loadStats();
    }, [user]);

    // Reset pagination when filters change
    useEffect(() => {
        setVisibleArtisans(12);
    }, [premiumSearchQuery, selectedRegion, selectedPriceFilter, filterExp, filterRating, verifiedOnly, sortBy, selectedSubCategory]);

    const flexServices = [
        "Catering Services (Chefs, Cooks Etc.)", "Teachers/Tutors", "Digital Marketer",
        "Fashion And Tailoring Services", "Plumbers", "Electricians", "Carpenters",
        "Painters", "AC Repair & Maintenance", "Laundry & Dry Cleaning", "Makeup & Beauty",
        "Automotive Mechanics", "Event Planning", "Gardeners & Landscapers", "Interior Designers"
    ];

    const premiumSubCategories = {
        "Domestic": [
            { name: "Home Security & Automation", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> },
            { name: "Solar Power Systems", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line></svg> },
            { name: "Roofing & Waterproofing", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> },
            { name: "Advanced Renovation", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path></svg> },
            { name: "Borehole & Water Systems", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> }
        ],
        "Commercial": [
            { name: "Corporate Cleaning", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 12H3"></path><path d="M16 6l3 3-3 3"></path><path d="M19 9H11"></path></svg> },
            { name: "IT & Networking", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> },
            { name: "Commercial HVAC", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path><path d="M12 9l3 3-3 3"></path><path d="M9 12h6"></path></svg> },
            { name: "Access Control", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> },
            { name: "Interior Office Design", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 13v8a2 2 0 0 0 2 2h7"></path><path d="M14 21h7a2 2 0 0 0 2-2v-8"></path><path d="M21 3H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"></path></svg> }
        ],
        "Industrial": [
            { name: "Machine Servicing", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1-2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> },
            { name: "Industrial Wiring", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg> },
            { name: "Welding & Fabrications", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path></svg> },
            { name: "Generator Plant Repairs", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg> },
            { name: "Cold Storage systems", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M20 12l-8 8-8-8"></path><path d="M12 4l8 8-8 8"></path></svg> }
        ],
        "Professional": [
            { name: "Architectural Drawing", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3 3m-3-3l-3 3m3-3v12m0 0l3-3m-3 3l-3 3"></path><path d="M18 14h4v4h-4z"></path><path d="M2 14h4v4h-4z"></path></svg> },
            { name: "Survey & Mapping", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg> },
            { name: "Legal & Notary", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"></path><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
            { name: "Engineering Consult", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg> },
            { name: "Financial Auditing", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> }
        ]
    };

    const filteredFlexServices = flexServices.filter(service =>
        service.toLowerCase().includes(flexSearchQuery.toLowerCase())
    );

    // Generator to ensure every sub-category has at least 15-20 artisans
    const generateArtisans = () => {
        const list = [];
        const regions = ["Greater Accra", "Ashanti", "Western", "Central"];
        const areas = ["East Legon", "Kumasi Central", "Osu", "Airport Res.", "Takoradi Harbor", "Cantonments", "Labone", "Dzorwulu", "Spintex", "Ridge", "Sunyani West", "Techiman North"];

        const subToKeyword = {
            // DOMESTIC
            "Home Security & Automation": "technician,security,camera,installing",
            "Solar Power Systems": "solar,installer,technician,rooftop",
            "Roofing & Waterproofing": "roofer,construction,worker,helmet",
            "Advanced Renovation": "carpenter,renovation,contractor,interior",
            "Borehole & Water Systems": "drilling,engineer,water,pumping",

            // COMMERCIAL
            "Corporate Cleaning": "cleaner,commercial,janitor,professional",
            "IT & Networking": "engineer,it,networking,server",
            "Commercial HVAC": "hvac,technician,ac,mechanic",
            "Access Control": "security,locks,technician,gate",
            "Interior Office Design": "architect,designer,office,drawing",

            // INDUSTRIAL
            "Machine Servicing": "mechanic,industrial,factory,servicing",
            "Industrial Wiring": "electrician,industrial,wiring,panel",
            "Welding & Fabrications": "welder,metal,industrial,fabricating",
            "Generator Plant Repairs": "mechanic,generator,engine,industrial",
            "Cold Storage systems": "technician,cooling,refrigeration,industrial",

            // PROFESSIONAL
            "Architectural Drawing": "architect,drawing,blueprint,office",
            "Survey & Mapping": "surveyor,land,mapping,theodolite",
            "Legal & Notary": "lawyer,notary,professional,office",
            "Engineering Consult": "engineer,consultant,blueprint,meeting",
            "Financial Auditing": "accountant,auditor,finance,banking"
        };

        const allSubs = [];
        Object.keys(premiumSubCategories).forEach(cat => {
            premiumSubCategories[cat].forEach(sub => {
                allSubs.push({ name: sub.name, category: cat });
            });
        });

        const maleNames = ["Kofi", "John", "Kwame", "Osei", "Mensah", "Ekow", "Kwesi", "Yaw", "Kobina", "Kwadwo"];
        const femaleNames = ["Ama", "Sarah", "Abena", "Yaa", "Akosua", "Adwoa", "Efua", "Araba", "Afia", "Baaba"];
        const lastNames = ["Annan", "Gyamfi", "Quansah", "Adu", "Baah", "Atta", "Asare", "Owusu", "Boadi", "Koranteng", "Appiah", "Boateng", "Tetteh", "Darko"];

        let idCounter = 1;
        allSubs.forEach(subObj => {
            const subName = subObj.name;
            for (let i = 0; i < 20; i++) {
                const currentId = idCounter++;
                const isFemale = i % 2 === 0;
                const firstName = isFemale ? femaleNames[Math.floor(Math.random() * femaleNames.length)] : maleNames[Math.floor(Math.random() * maleNames.length)];
                const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                const title = ["Engr.", "Dr.", "Pro.", "Master", "Chief"][i % 5];

                const expVal = 3 + (i % 12);
                const rating = (4.0 + (Math.random() * 1.0)).toFixed(1);

                const categoryTag = ["technician", "plumber", "electrician", "contractor", "engineer", "laborer"][i % 6];
                const imageSlug = subToImageSlug[subName];
                const image = artisanImages[imageSlug] || defaultArtisanImage;
                list.push({
                    id: currentId,
                    name: `${title} ${firstName} ${lastName}`,
                    sub: subName,
                    category: subObj.category,
                    image,
                    price: 1500 + Math.floor(Math.random() * 30000),
                    region: regions[Math.floor(Math.random() * regions.length)],
                    area: areas[Math.floor(Math.random() * areas.length)],
                    verified: Math.random() > 0.3,
                    exp: `${expVal} Years`,
                    expVal: expVal,
                    rating: rating,
                    jobs: 40 + Math.floor(Math.random() * 200),
                    bio: `Specialized in premium ${subName} solutions with over ${expVal} years of experience in ${subObj.category} projects. Highly recommended for quality and reliability.`,
                    phone: `+233 ${20 + (i % 10)} ${Math.floor(100 + Math.random() * 899)} ${Math.floor(1000 + Math.random() * 8999)}`,
                    featured: i % 10 === 0,
                    topRated: parseFloat(rating) >= 4.8,
                    fastResponse: Math.random() > 0.5,
                    skills: [`Expert ${subName}`, "High Quality", "Reliable Service", "Prompt Delivery", "Advanced Tools"]
                });
            }
        });
        return list;
    };

    const [mockArtisans] = useState(generateArtisans());
    const [favoriteArtisans, setFavoriteArtisans] = useState([]);

    const toggleFavorite = (id) => {
        setFavoriteArtisans(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    const filteredArtisans = mockArtisans.filter(art => {
        const matchesCategory = selectedPremiumCategory ? art.category === selectedPremiumCategory : true;
        const matchesSubCategory = selectedSubCategory ? art.sub === selectedSubCategory : true;

        const matchesSearch = premiumSearchQuery === "" ||
            art.name.toLowerCase().includes(premiumSearchQuery.toLowerCase()) ||
            art.sub.toLowerCase().includes(premiumSearchQuery.toLowerCase()) ||
            art.region.toLowerCase().includes(premiumSearchQuery.toLowerCase()) ||
            art.area.toLowerCase().includes(premiumSearchQuery.toLowerCase());

        const matchesRegion = selectedRegion === "All Regions" || art.region === selectedRegion;

        const matchesPrice = selectedPriceFilter === "All Prices" ||
            (selectedPriceFilter === "Budget (< 5k)" && art.price < 5000) ||
            (selectedPriceFilter === "Mid Range (5k - 15k)" && art.price >= 5000 && art.price <= 15000) ||
            (selectedPriceFilter === "Luxury (> 15k)" && art.price > 15000);

        const matchesExp = filterExp === "All Experience" ||
            (filterExp === "1-3 Years" && art.expVal >= 1 && art.expVal <= 3) ||
            (filterExp === "3-5 Years" && art.expVal >= 3 && art.expVal <= 5) ||
            (filterExp === "5+ Years" && art.expVal > 5);

        const matchesRating = filterRating === "All Ratings" ||
            (filterRating === "4.0+" && parseFloat(art.rating) >= 4.0) ||
            (filterRating === "4.5+" && parseFloat(art.rating) >= 4.5);

        const matchesVerified = !verifiedOnly || art.verified;

        return matchesCategory && matchesSubCategory && matchesSearch && matchesRegion && matchesPrice && matchesExp && matchesRating && matchesVerified;
    }).sort((a, b) => {
        if (sortBy === "Highest rated") return b.rating - a.rating;
        if (sortBy === "Lowest price") return a.price - b.price;
        if (sortBy === "Most experienced") return b.expVal - a.expVal;
        return 0; // Recommended (Default order)
    });


    const sidebarLinks = [
        { name: "Dashboard", icon: <Icons.Home />, type: "main" },
        { name: "Flex", icon: <Icons.Flex />, type: "main" },
        { name: "Premium", icon: <Icons.Premium />, type: "main" },
        { name: "My Requests", icon: <Icons.Requests />, type: "extended" },
        { name: "Wallet", icon: <Icons.Wallet />, type: "extended" },
        { name: "Complaints", icon: <Icons.Complaints />, type: "extended" }
    ];

    const handleLogout = () => {
        navigate("/");
    };

    const handleNavClick = (name) => {
        if (name === "Log Out") {
            authApi.signOut().then(() => handleLogout());
            return;
        }

        setActiveTab(name);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const markAllRead = async () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
        if (user) await notificationsApi.markAllRead(user.id);
    };

    return (
        <div className="dashboard-layout">
            {/* SIDEBAR NAVIGATION (LEFT SIDE) */}
            <aside className="dashboard-sidebar">
                <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
                    <img src={logo} alt="Adwuma Logo" style={{ width: 'auto', height: '120px', objectFit: 'contain' }} />
                    {/* <span>Adwuma</span> */}
                </Link>

                <nav className="sidebar-menu">
                    <div className="sidebar-label">Main</div>
                    {sidebarLinks.filter(l => l.type === "main").map(link => (
                        <div
                            key={link.name}
                            className={`sidebar-link ${activeTab === link.name ? 'active' : ''}`}
                            onClick={() => handleNavClick(link.name)}
                        >
                            <span>{link.icon}</span> {link.name}
                        </div>
                    ))}

                    <div className="sidebar-label">Extended Features</div>
                    {sidebarLinks.filter(l => l.type === "extended").map(link => (
                        <div
                            key={link.name}
                            className={`sidebar-link ${activeTab === link.name ? 'active' : ''}`}
                            onClick={() => handleNavClick(link.name)}
                        >
                            <span>{link.icon}</span> {link.name}
                        </div>
                    ))}

                    {/* User Account Section at Bottom */}
                    <div style={{ marginTop: 'auto', borderTop: '1px solid var(--color-surface-3)', paddingTop: '20px', position: 'relative' }}>
                        <div
                            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px',
                                borderRadius: '16px',
                                cursor: 'pointer',
                                background: profileMenuOpen ? 'var(--color-text-muted)' : 'transparent',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'var(--color-surface-3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-text-main)',
                                fontWeight: '800',
                                fontSize: '1rem'
                            }}>
                                {username.charAt(0)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ color: 'var(--color-text-main)', fontWeight: 'bold', fontSize: '0.9rem' }}>{username}</div>
                                <div style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem' }}>Customer</div>
                            </div>
                            <div style={{ color: 'var(--color-text-dim)', transform: profileMenuOpen ? 'rotate(180deg)' : 'none', transition: 'all 0.3s ease' }}>
                                ▼
                            </div>
                        </div>

                        {profileMenuOpen && (
                            <div style={{
                                position: 'absolute',
                                bottom: '80px',
                                left: '0',
                                width: '100%',
                                background: 'var(--color-surface-1)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '16px',
                                boxShadow: '0 0px 10px rgba(0,0,0,0.2)',
                                padding: '8px',
                                zIndex: 1000,
                                animation: 'fadeIn 0.2s ease-out'
                            }}>
                                <div
                                    className="sidebar-link"
                                    onClick={() => { handleNavClick("Account"); setProfileMenuOpen(false); }}
                                    style={{ padding: '10px 14px' }}
                                >
                                    <Icons.Account /> Account
                                </div>
                                <div
                                    className="sidebar-link"
                                    onClick={() => { handleNavClick("Settings"); setProfileMenuOpen(false); }}
                                    style={{ padding: '10px 14px' }}
                                >
                                    <Icons.Settings /> Settings
                                </div>
                                <div
                                    className="sidebar-link"
                                    onClick={() => handleLogout()}
                                    style={{ padding: '10px 14px', color: '#ff4d4d' }}
                                >
                                    <Icons.Logout /> Log Out
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="dashboard-main">

                {activeTab === "Dashboard" && (
                    <header id="dashboard" className="welcome-section" style={{ paddingBottom: '3rem' }}>
                        <h1>Welcome back, <span>{username}</span>!</h1>
                        <p className="cl-dashboard__subtitle" style={{ marginBottom: "2rem" }}>Here is a quick overview of your account today.</p>

                        {/* Quick Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>

                            <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'} onClick={() => handleNavClick("My Requests")}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.15)', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icons.Requests />
                                </div>
                                <div>
                                    <p style={{ margin: 0, color: 'var(--color-text-dim)', fontSize: '0.9rem', marginBottom: '4px' }}>Active Requests</p>
                                    <h3 style={{ margin: 0, color: 'var(--color-text-main)', fontSize: '1.8rem' }}>{activeRequestCount}</h3>
                                </div>
                            </div>

                            <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'} onClick={() => handleNavClick("Wallet")}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(76, 175, 80, 0.15)', color: '#4caf50', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                    ₵
                                </div>
                                <div>
                                    <p style={{ margin: 0, color: 'var(--color-text-dim)', fontSize: '0.9rem', marginBottom: '4px' }}>Wallet Balance</p>
                                    <h3 style={{ margin: 0, color: 'var(--color-text-main)', fontSize: '1.6rem' }}>GHS {walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                                </div>
                            </div>

                            <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'} onClick={() => handleNavClick("My Requests")}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(33, 150, 243, 0.15)', color: '#2196f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                    ★
                                </div>
                                <div>
                                    <p style={{ margin: 0, color: 'var(--color-text-dim)', fontSize: '0.9rem', marginBottom: '4px' }}>Completed Jobs</p>
                                    <h3 style={{ margin: 0, color: 'var(--color-text-main)', fontSize: '1.8rem' }}>{completedJobCount}</h3>
                                </div>
                            </div>

                        </div>

                        {/* Additional Features: Notifications & Shortcuts */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>

                            {/* Recent Notifications */}
                            <div style={{ background: 'var(--color-surface)', borderRadius: '16px', border: '1px solid var(--color-border)', padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ margin: 0, color: 'var(--color-text-main)', fontSize: '1.2rem' }}>Recent Activity</h3>
                                    <span
                                        style={{ color: 'var(--color-gold)', fontSize: '0.9rem', cursor: 'pointer' }}
                                        onClick={markAllRead}
                                    >
                                        Mark all read
                                    </span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    {notifications.length > 0 ? (
                                        notifications.map(notif => (
                                            <div
                                                key={notif.id}
                                                style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', opacity: notif.unread ? 1 : 0.6 }}
                                            >
                                                <div style={{
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    background: notif.unread ? 'var(--color-gold)' : 'transparent',
                                                    border: notif.unread ? 'none' : '1px solid var(--color-text-dim)',
                                                    marginTop: '6px',
                                                    flexShrink: 0,
                                                    boxShadow: notif.unread ? '0 0 8px var(--color-gold)' : 'none'
                                                }}></div>
                                                <div>
                                                    <p style={{ margin: '0 0 4px 0', color: 'var(--color-text-main)', fontSize: '0.95rem' }}>{notif.text}</p>
                                                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{notif.time}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem', textAlign: 'center' }}>No recent activity to show.</p>
                                    )}
                                </div>
                                <button
                                    style={{ background: 'transparent', border: 'none', color: 'var(--color-text-main)', width: '100%', marginTop: '1.5rem', cursor: 'pointer', fontSize: '0.9rem', padding: '8px 0', borderTop: '1px solid var(--color-border)' }}
                                    onClick={() => setActiveTab("My Requests")}
                                >
                                    View Activity History
                                </button>
                            </div>



                        </div>
                    </header>
                )}

                {/* AYUDA FLEX SECTION */}
                {activeTab === "Flex" && (
                    <section id="flex" className="flex-section">
                        <h2 className="flex-title">Flex</h2>
                        <p className="flex-subtitle">Make an on-demand request. Type below to begin</p>

                        <div className="flex-search-container">
                            <input
                                type="text"
                                className="flex-input"
                                placeholder="What do you need help with?"
                                value={flexSearchQuery}
                                onChange={(e) => setFlexSearchQuery(e.target.value)}
                            />
                        </div>

                        <span className="service-tags-label">
                            {flexSearchQuery ? `Search results for "${flexSearchQuery}"` : 'Choose service type'}
                        </span>
                        <div className="service-tags-container">
                            {filteredFlexServices.length > 0 ? (
                                filteredFlexServices.map(service => (
                                    <div
                                        key={service}
                                        className={`service-tag ${selectedFlexService === service ? 'active' : ''}`}
                                        onClick={() => setSelectedFlexService(service)}
                                    >
                                        {service}
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: 'var(--color-text-dim)', gridColumn: '1/-1', padding: '20px' }}>
                                    No services found matching your search.
                                </p>
                            )}
                        </div>

                        <button
                            className="proceed-btn"
                            onClick={() => {
                                if (!selectedFlexService) {
                                    alert("Please select a service type first!");
                                    return;
                                }
                                navigate("/flex-request");
                            }}
                        >
                            Proceed with request →
                        </button>
                    </section>
                )}

                {/* AYUDA PREMIUM SECTION */}
                {activeTab === "Premium" && (
                    <section id="premium" className="premium-section" style={{ paddingBottom: '4rem' }}>
                        <h2 className="premium-title">Premium</h2>

                        {!selectedPremiumCategory ? (
                            <>
                                <p className="premium-subtitle">Select a category under which to post a request</p>
                                <div className="premium-grid">
                                    <div className="service-type-card" onClick={() => setSelectedPremiumCategory("Domestic")}>
                                        <div className="icon-box"><Icons.Domestic /></div>
                                        <h3>Domestic</h3>
                                    </div>
                                    <div className="service-type-card" onClick={() => setSelectedPremiumCategory("Commercial")}>
                                        <div className="icon-box"><Icons.Commercial /></div>
                                        <h3>Commercial</h3>
                                    </div>
                                    <div className="service-type-card" onClick={() => setSelectedPremiumCategory("Industrial")}>
                                        <div className="icon-box"><Icons.Industrial /></div>
                                        <h3>Industrial</h3>
                                    </div>
                                    <div className="service-type-card" onClick={() => setSelectedPremiumCategory("Professional")}>
                                        <div className="icon-box"><Icons.Professional /></div>
                                        <h3>Professional</h3>
                                    </div>
                                </div>
                            </>
                        ) : !selectedSubCategory ? (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <button
                                        onClick={() => setSelectedPremiumCategory(null)}
                                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)', padding: '8px 15px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        ← Back
                                    </button>
                                    <p className="premium-subtitle" style={{ margin: 0 }}>Specialized {selectedPremiumCategory} Services</p>
                                </div>

                                <div className="premium-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                                    {premiumSubCategories[selectedPremiumCategory].map(sub => (
                                        <div
                                            key={sub.name}
                                            className="service-type-card"
                                            onClick={() => setSelectedSubCategory(sub.name)}
                                            style={{ height: 'auto', padding: '1.5rem' }}
                                        >
                                            <div className="icon-box" style={{ fontSize: '1.8rem' }}>{sub.icon}</div>
                                            <h3 style={{ fontSize: '1rem', marginTop: '1rem' }}>{sub.name}</h3>
                                            <button style={{
                                                marginTop: '0.5rem',
                                                background: 'var(--color-surface-1)',
                                                border: '1px solid var(--color-blue)',
                                                color: 'var(--color-text-main)',
                                                padding: '6px 12px',
                                                borderRadius: '8px',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                cursor: 'pointer'
                                            }}>
                                                View Professionals
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="premium-marketplace">
                                <div className="marketplace-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                                        <button
                                            onClick={() => setSelectedSubCategory(null)}
                                            className="btn-view-profile"
                                            style={{ width: 'auto', padding: '10px 20px', borderRadius: '14px' }}
                                        >
                                            ← Back to Categories
                                        </button>
                                        <div>
                                            <h2 style={{ margin: 0, fontSize: '2rem', color: 'white' }}>{selectedSubCategory || selectedPremiumCategory} Professionals</h2>
                                            <p style={{ margin: '5px 0 0 0', color: 'var(--color-text-dim)', fontSize: '1rem' }}>Premium verified experts in the {selectedPremiumCategory} sector</p>
                                        </div>
                                    </div>

                                    {/* Search & Filter Container */}
                                    <div className="search-filter-container">
                                        <div className="search-bar-wrapper">
                                            <span className="search-icon">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                            </span>
                                            <input
                                                type="text"
                                                placeholder="Search by name, skill, or location..."
                                                className="marketplace-search-input"
                                                value={premiumSearchQuery}
                                                onChange={(e) => setPremiumSearchQuery(e.target.value)}
                                            />
                                        </div>

                                        <div className="filters-row">
                                            <div className="filter-group">
                                                <label>Region</label>
                                                <select
                                                    className="filter-select"
                                                    value={selectedRegion}
                                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                                >
                                                    <option value="All Regions">All Regions</option>
                                                    <option value="Greater Accra">Greater Accra</option>
                                                    <option value="Ashanti">Ashanti</option>
                                                    <option value="Western">Western</option>
                                                    <option value="Central">Central</option>
                                                </select>
                                            </div>

                                            <div className="filter-group">
                                                <label>Experience</label>
                                                <select
                                                    className="filter-select"
                                                    value={filterExp}
                                                    onChange={(e) => setFilterExp(e.target.value)}
                                                >
                                                    <option value="All Experience">All Experience</option>
                                                    <option value="1-3 Years">1–3 Years</option>
                                                    <option value="3-5 Years">3–5 Years</option>
                                                    <option value="5+ Years">5+ Years</option>
                                                </select>
                                            </div>

                                            <div className="filter-group">
                                                <label>Price Range</label>
                                                <select
                                                    className="filter-select"
                                                    value={selectedPriceFilter}
                                                    onChange={(e) => setSelectedPriceFilter(e.target.value)}
                                                >
                                                    <option value="All Prices">All Prices</option>
                                                    <option value="Budget (< 5k)">Budget {"(< 5k)"}</option>
                                                    <option value="Mid Range (5k - 15k)">Mid Range (5k - 15k)</option>
                                                    <option value="Luxury (> 15k)">Luxury {"(> 15k)"}</option>
                                                </select>
                                            </div>

                                            <div className="filter-group">
                                                <label>Rating</label>
                                                <select
                                                    className="filter-select"
                                                    value={filterRating}
                                                    onChange={(e) => setFilterRating(e.target.value)}
                                                >
                                                    <option value="All Ratings">All Ratings</option>
                                                    <option value="4.0+">4.0★ and above</option>
                                                    <option value="4.5+">4.5★ and above</option>
                                                </select>
                                            </div>

                                            <div className="filter-group">
                                                <label>Sort By</label>
                                                <select
                                                    className="filter-select"
                                                    value={sortBy}
                                                    onChange={(e) => setSortBy(e.target.value)}
                                                >
                                                    <option value="Recommended">Recommended</option>
                                                    <option value="Highest rated">Highest rated</option>
                                                    <option value="Lowest price">Lowest price</option>
                                                    <option value="Most experienced">Most experienced</option>
                                                </select>
                                            </div>

                                            <button
                                                className={`verified-toggle ${verifiedOnly ? 'active' : ''}`}
                                                onClick={() => setVerifiedOnly(!verifiedOnly)}
                                            >
                                                <span style={{ fontSize: '1.1rem' }}>{verifiedOnly ? '✓' : ''}</span>
                                                Verified Artisans
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Artisan Grid */}
                                <div className="premium-artisan-grid">
                                    {filteredArtisans.slice(0, visibleArtisans).map(artisan => (
                                        <div key={artisan.id} className="artisan-card-v2">
                                            <div className="artisan-card-header">
                                                {/* Artisan portrait or initials fallback */}
                                                <div className="artisan-image-v2" style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: artisan.image ? undefined : 'linear-gradient(135deg, #111 0%, #000 100%)',
                                                    fontSize: artisan.image ? undefined : '3.5rem',
                                                    fontWeight: '800',
                                                    color: 'var(--color-gold)',
                                                    borderBottom: '1px solid #222',
                                                    overflow: 'hidden'
                                                }}>
                                                    {artisan.image ? (
                                                        <img src={artisan.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        artisan.name.split(' ').filter(n => !n.includes('.')).map(n => n[0]).join('').substring(0, 2).toUpperCase()
                                                    )}
                                                </div>
                                                <div className="card-overlay-gradient"></div>

                                                <div className="badge-container">
                                                    {artisan.featured && <span className="premium-badge badge-featured">★ Featured</span>}
                                                    {artisan.topRated && <span className="premium-badge badge-top-rated">★ Top Rated</span>}
                                                    {artisan.fastResponse && <span className="premium-badge badge-fast">⚡ Fast Response</span>}
                                                </div>

                                                {artisan.verified && (
                                                    <div className="verified-indicator" title="Verified Professional">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                    </div>
                                                )}

                                                <div
                                                    className="bookmark-icon"
                                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(artisan.id); }}
                                                    style={{ color: favoriteArtisans.includes(artisan.id) ? 'var(--color-gold)' : 'white' }}
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill={favoriteArtisans.includes(artisan.id) ? 'var(--color-gold)' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                                                </div>
                                            </div>

                                            <div className="artisan-card-body">
                                                <div className="artisan-info-main">
                                                    <h3 className="artisan-name-v2">{artisan.name}</h3>
                                                    <div className="artisan-rating-box">
                                                        <span className="rating-value">{artisan.rating}</span>
                                                        <span style={{ fontSize: '0.8rem' }}>★</span>
                                                    </div>
                                                </div>

                                                <div className="artisan-profession">{artisan.sub}</div>

                                                <div className="artisan-meta-row">
                                                    <div className="meta-item">
                                                        <span style={{ color: 'var(--color-gold)' }}>★</span>
                                                        <span>{artisan.expVal} Years Exp.</span>
                                                    </div>
                                                    <div className="meta-item">
                                                        <span>📍</span>
                                                        <span>{artisan.region}</span>
                                                    </div>
                                                </div>

                                                <p className="artisan-description">
                                                    {artisan.bio.split('.')[0]}. Expert in {artisan.sub} with professional tools and guaranteed delivery.
                                                </p>

                                                <div className="price-container-v2">
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span className="price-label">Starting from</span>
                                                        <span className="price-value-v2">GH₵ {artisan.price.toLocaleString()}</span>
                                                    </div>
                                                </div>

                                                <div className="card-actions-v2">
                                                    <button
                                                        className="btn-view-profile"
                                                        onClick={() => setSelectedArtisanProfile(artisan)}
                                                    >
                                                        View Profile
                                                    </button>
                                                    <button
                                                        className="btn-hire-now"
                                                        onClick={() => {
                                                            setSelectedArtisanProfile(artisan);
                                                            // Additional hire logic could go here
                                                        }}
                                                    >
                                                        Hire Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {filteredArtisans.length > visibleArtisans && (
                                    <div className="load-more-container">
                                        <button
                                            className="btn-load-more"
                                            onClick={() => setVisibleArtisans(prev => prev + 12)}
                                        >
                                            Load More Professionals
                                        </button>
                                    </div>
                                )}

                                {filteredArtisans.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--color-surface-2)', borderRadius: '24px', border: '1px dashed var(--color-border)', marginTop: '2rem' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🔍</div>
                                        <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>No professionals found</h3>
                                        <p style={{ color: 'var(--color-text-dim)', maxWidth: '400px', margin: '0 auto 2rem' }}>
                                            We couldn't find any artisans matching your search or filters. Try adjusting them to see more results.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setPremiumSearchQuery("");
                                                setSelectedRegion("All Regions");
                                                setSelectedPriceFilter("All Prices");
                                                setFilterExp("All Experience");
                                                setFilterRating("All Ratings");
                                                setVerifiedOnly(false);
                                            }}
                                            className="btn-load-more"
                                        >
                                            Reset All Filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ARTISAN PROFILE MODAL */}
                        {selectedArtisanProfile && (
                            <div
                                style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                                onClick={() => setSelectedArtisanProfile(null)}
                            >
                                <div
                                    className="modal-content"
                                    style={{ background: 'var(--color-bg)', width: '100%', maxWidth: '600px', borderRadius: '30px', border: '1px solid var(--color-border)', overflow: 'hidden', animation: 'slideUp 0.3s ease' }}
                                    onClick={e => e.stopPropagation()}
                                >
                                    <div style={{ position: 'relative', height: '180px', background: 'var(--color-gold)' }}>
                                        <button
                                            onClick={() => setSelectedArtisanProfile(null)}
                                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'black', color: 'white', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', zIndex: 10 }}
                                        >✕</button>
                                        <div style={{ position: 'absolute', bottom: '-50px', left: '30px', width: '120px', height: '120px', borderRadius: '30px', border: '5px solid var(--color-bg)', overflow: 'hidden', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: '800', color: 'var(--color-gold)' }}>
                                            {selectedArtisanProfile.image ? (
                                                <img src={selectedArtisanProfile.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                selectedArtisanProfile.name.split(' ').filter(n => !n.includes('.')).map(n => n[0]).join('').substring(0, 2).toUpperCase()
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ padding: '70px 30px 30px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{selectedArtisanProfile.name}</h2>
                                                <p style={{ color: 'var(--color-gold)', margin: '5px 0 0', fontWeight: 'bold' }}>Senior {selectedArtisanProfile.sub} Specialist</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--color-gold)' }}>GH₵ {selectedArtisanProfile.price.toLocaleString()}</div>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>PROJECT ESTIMATE</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', margin: '25px 0', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid var(--color-border)' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '1.1rem' }}>{selectedArtisanProfile.rating} ★</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>RATING</div>
                                            </div>
                                            <div style={{ textAlign: 'center', borderLeft: '1px solid #333', borderRight: '1px solid #333' }}>
                                                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>{selectedArtisanProfile.jobs}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>COMPLETED</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>{selectedArtisanProfile.exp}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>EXP.</div>
                                            </div>
                                        </div>

                                        <p style={{ lineHeight: '1.6', color: 'var(--color-text-muted)', marginBottom: '30px' }}>{selectedArtisanProfile.bio}</p>

                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <button
                                                style={{ flex: 1, background: 'var(--color-gold)', color: 'black', border: 'none', padding: '15px', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}
                                                onClick={() => {
                                                    setMessages([{ text: `Hello ${selectedArtisanProfile.name}, I would like to inquire about your ${selectedArtisanProfile.sub} services.`, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
                                                    setActiveTab("Chat");
                                                    setSelectedArtisanProfile(null);
                                                }}
                                            >Hire & Start Chat</button>
                                            <button
                                                style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '15px 25px', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', border: '1px solid var(--color-border)' }}
                                                onClick={() => alert(`Calling ${selectedArtisanProfile.phone}...`)}
                                            >Call Pro</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* MY REQUESTS SECTION */}
                {activeTab === "My Requests" && (
                    <section id="my requests">
                        <MyRequestsPage isEmbedded={true} />
                    </section>
                )}

                {/* WALLET SECTION */}
                {activeTab === "Wallet" && (
                    <section id="wallet">
                        <WalletPage isEmbedded={true} />
                    </section>
                )}

                {/* COMPLAINTS SECTION */}
                {activeTab === "Complaints" && (
                    <section id="complaints">
                        <ComplaintsPage isEmbedded={true} />
                    </section>
                )}

                {/* ACCOUNT SECTION */}
                {activeTab === "Account" && (
                    <section id="account">
                        <AccountSettingsPage isEmbedded={true} initialTab="profile" />
                    </section>
                )}



                {/* CHAT SECTION */}
                {activeTab === "Chat" && (
                    <section id="chat" style={{ height: '70vh', background: 'var(--color-surface)', borderRadius: '20px', border: '1px solid var(--color-border)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-gold)', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>DO</div>
                                <div>
                                    <h4 style={{ margin: 0, color: 'var(--color-text-main)' }}>David Osei</h4>
                                    <span style={{ fontSize: '0.8rem', color: '#4caf50' }}>● Online</span>
                                </div>
                            </div>
                            <button onClick={() => setActiveTab("Dashboard")} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>Close Chat</button>
                        </div>

                        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {messages.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-dim)' }}>
                                    No messages yet. Start a conversation with David Osei.
                                </div>
                            )}
                            {messages.map((msg, i) => (
                                <div key={i} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', background: msg.sender === 'user' ? 'var(--color-gold)' : 'var(--color-bg)', color: msg.sender === 'user' ? 'black' : 'var(--color-text-main)', padding: '12px 16px', borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', maxWidth: '70%', border: msg.sender === 'user' ? 'none' : '1px solid var(--color-border)' }}>
                                    <p style={{ margin: 0, fontSize: '0.95rem' }}>{msg.text}</p>
                                    <span style={{ fontSize: '0.7rem', color: msg.sender === 'user' ? 'rgba(0,0,0,0.5)' : 'var(--color-text-dim)', marginTop: '4px', display: 'block' }}>{msg.time}</span>
                                </div>
                            ))}
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!currentMessage) return;
                                setMessages([...messages, { text: currentMessage, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
                                setCurrentMessage("");
                            }}
                            style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '10px' }}
                        >
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={currentMessage}
                                onChange={(e) => setCurrentMessage(e.target.value)}
                                style={{ flex: 1, background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '30px', padding: '12px 20px', color: 'white' }}
                            />
                            <button type="submit" style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--color-gold)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🚀</button>
                        </form>
                    </section>
                )}

                {/* SETTINGS SECTION */}
                {activeTab === "Settings" && (
                    <section id="settings">
                        <AccountSettingsPage isEmbedded={true} initialTab="security" />
                    </section>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
