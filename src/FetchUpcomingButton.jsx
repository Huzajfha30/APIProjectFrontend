import React, { useEffect, useState } from "react";
import { CalendarDays, Clapperboard } from "lucide-react";

const UpcomingMovies = () => {
    const [movies, setMovies] = useState([]);
    const [status, setStatus] = useState(null); // status for snapshot POST

    // Henter upcoming movies fra backend
    useEffect(() => {
        fetch("http://localhost:8080/movies/upcoming")
            .then(res => res.json())
            .then(data => setMovies(data.results || []))
            .catch(() => setMovies([]));
    }, []);

    // Henter og gemmer snapshots (knapfunktion)
    const fetchAndSaveUpcoming = async () => {
        setStatus("loading");
        try {
            const res = await fetch("http://localhost:8080/movies/fetch-upcoming", {
                method: "POST",
            });

            if (res.ok) {
                setStatus("success");
            } else {
                setStatus("error");
            }
        } catch (err) {
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-6">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-bold flex items-center gap-3 text-gray-800">
                    <Clapperboard size={40} />
                    Kommende Film
                </h1>
                <button
                    onClick={fetchAndSaveUpcoming}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl transition"
                >
                    + Gem kommende film som snapshot
                </button>
            </div>

            {/* Status visning */}
            {status === "loading" && <p className="text-blue-500 mb-4">Gemmer snapshot...</p>}
            {status === "success" && <p className="text-green-600 mb-4">Snapshot gemt! ✅</p>}
            {status === "error" && <p className="text-red-600 mb-4">Noget gik galt 😢</p>}

            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {movies.map((movie, index) => (
                    <motion.div
                        key={movie.id}
                        className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full h-[400px] object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
                            <div className="flex items-center text-gray-500">
                                <CalendarDays className="w-5 h-5 mr-2" />
                                <span>
                                    {new Date(movie.release_date).toLocaleDateString("da-DK", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
                                    })}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingMovies;
