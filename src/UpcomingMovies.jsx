import React, { useEffect, useState } from "react";
import { CalendarDays, Clapperboard } from "lucide-react";

const UpcomingMovies = () => {
    const [movies, setMovies] = useState([]);
    const [snapshots, setSnapshots] = useState([]);
    const [selectedSnapshot, setSelectedSnapshot] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchSnapshotDates = async () => {
        try {
            const res = await fetch("http://localhost:8080/movies/upcoming-snapshot-dates");
            const data = await res.json();
            setSnapshots(data);
            if (data.length > 0) {
                setSelectedSnapshot(data[data.length - 1].id);
                fetchMoviesForSnapshot(data[data.length - 1].id);
            }
        } catch (err) {
            console.error("Fejl ved hentning af snapshots:", err);
        }
    };

    const fetchMoviesForSnapshot = async (snapshotId) => {
        try {
            const res = await fetch(`http://localhost:8080/movies/upcoming-snapshots/${snapshotId}`);
            const data = await res.json();
            setMovies(data);
        } catch (err) {
            console.error("Fejl ved hentning af film:", err);
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        await fetch("http://localhost:8080/movies/fetch-upcoming", { method: "POST" });
        await fetchSnapshotDates();
        setLoading(false);
    };

    useEffect(() => {
        fetchSnapshotDates();
    }, []);

    useEffect(() => {
        if (selectedSnapshot) fetchMoviesForSnapshot(selectedSnapshot);
    }, [selectedSnapshot]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 py-12 px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                <h1 className="text-4xl font-extrabold flex items-center gap-4 text-blue-800 mb-4 md:mb-0">
                    <Clapperboard size={40} />
                    Kommende Film Snapshots
                </h1>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleUpdate}
                        className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
                        disabled={loading}
                    >
                        {loading ? "Opdaterer..." : "Opdater"}
                    </button>

                    <select
                        value={selectedSnapshot}
                        onChange={(e) => setSelectedSnapshot(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm bg-white"
                    >
                        <option value="">Vælg snapshot-dato</option>
                        {snapshots.map((snap) => (
                            <option key={snap.id} value={snap.id}>
                                {new Date(snap.createdAt).toLocaleString("da-DK")}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {movies.map((movie) => (
                    <div
                        key={`${movie.tmdbId}-${movie.title}`}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden"
                    >
                        <div className="h-[400px] bg-gray-200 flex justify-center items-center">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.posterPath || ""}`}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.target.style.display = "none")}
                            />
                        </div>
                        <div className="p-5">
                            <h2 className="text-xl font-semibold text-blue-800 mb-2">{movie.title}</h2>
                            <div className="flex items-center text-gray-600 text-sm mb-1">
                                <CalendarDays className="w-4 h-4 mr-2" />
                                {new Date(movie.releaseDate).toLocaleDateString("da-DK", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                ⭐ {movie.rating} | 🗳 {movie.voteCount} stemmer
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingMovies;
