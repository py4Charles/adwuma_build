import ArtisanCard from "../components/ArtisanCard";
import RatingStars from "../components/RatingStars";
import ServiceCard from "../components/ServiceCard";
import ArtisanDashboard from "./ArtisanDashboard";
import AccountSettingsPage from "./AccountSettingsPage";
import LiveTrackingPage from "./LiveTrackingPage.jsx";
import OtpVerificationPage from "./OtpVerificationPage.jsx";
import SignupPage from "./SignupPage";
import NotFound from "./NotFound.jsx";

const SandBox = () => {
    return (
        <div style={{ display: "grid", gap: "20px" }}>
            <h2 style={{padding: '20px 10px', display: 'flex', justifyContent: 'middle'}}>Component Playground</h2>


            {/* <LiveTrackingPage/> */}
            <NotFound/>
            {/* <OtpVerificationPage/> */}

        </div>
    );
};

export default SandBox;