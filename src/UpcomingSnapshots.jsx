import React, { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays, Clapperboard } from "lucide-react";

const UpcomingSnapshots = () => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchSnapshots = () => {
        axios.get("http://localhost:8080/movies/upcoming-snapshots")
            .then(res => setMovies(res.data))
            .catch(err => console.error("Fejl ved hentning af snapshots:", err));
    };

    const handleFetchUpcomingClick = () => {
        setIsLoading(true);
        axios.post("http://localhost:8080/movies/fetch-upcoming")
            .then(() => {
                fetchSnapshots(); // henter opdateret liste
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Fejl ved fetch:", err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchSnapshots(); // Hent data ved page load
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold flex items-center gap-2 text-gray-800">
                    <Clapperboard size={40} /> Kommende Film Snapshots
                </h1>
                <button
                    onClick={handleFetchUpcomingClick}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    disabled={isLoading}
                >
                    {isLoading ? "Henter..." : "Hent nye kommende film"}
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {movies.map(movie => (
                    <div key={movie.id} className="bg-white rounded-xl shadow p-4">
                        <h2 className="text-xl font-semibold">{movie.title}</h2>
                        <div className="flex items-center text-gray-600 mt-2">
                            <CalendarDays className="w-5 h-5 mr-2" />
                            {new Date(movie.releaseDate).toLocaleDateString("da-DK")}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            ⭐ {movie.rating} – {movie.voteCount} stemmer
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingSnapshots;
