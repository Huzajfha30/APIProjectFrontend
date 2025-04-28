import React from "react"; // <-- Tilføj dette!
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const handleUpcomingClick = () => {
        navigate("/upcoming");
    };

    return (
        <div className="text-center mt-10">
            <h1 className="text-3xl font-bold mb-4">Velkommen til CinemaTracker 🎬</h1>
            <button
                onClick={handleUpcomingClick}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition"
            >
                Se Kommende Film
            </button>
        </div>
    );
};

export default Home;
