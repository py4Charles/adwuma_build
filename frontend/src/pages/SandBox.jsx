import ArtisanCard from "../components/ArtisanCard";
import RatingStars from "../components/RatingStars";

const SandBox = () => {
    return (
        <div style={{ padding: "40px", display: "grid", gap: "20px" }}>
            <h2>Component Playground</h2>

            <ArtisanCard
                id={1}
                name="Ama Owusu"
                category="Tailor"
                location="Kumasi"
                rating={4.8}
                price={180}
                distance={1.2} />
            
            <ArtisanCard
                id={2}
                name="Kofi Boateng"
                category="Electrician"
                location="Tema"
                rating={3.5}
                price={400}
                distance={1.2} />
            
            <RatingStars/>
        </div>
    );
};

export default SandBox;