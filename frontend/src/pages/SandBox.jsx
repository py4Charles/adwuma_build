import ArtisanCard from "../components/ArtisanCard";
import RatingStars from "../components/RatingStars";
import ServiceCard from "../components/ServiceCard";
import ArtisanDashboard from "./ArtisanDashboard";
import AccountSettingsPage from "./AccountSettingsPage";
import SignupPage from "./SignupPage";

const SandBox = () => {
    return (
        <div style={{ padding: "40px", display: "grid", gap: "20px" }}>
            <h2>Component Playground</h2>


            <AccountSettingsPage />

        </div>
    );
};

export default SandBox;