import React, { useEffect, useState } from "react";
import { CalendarDays, Clapperboard } from "lucide-react";

const UpcomingMovies = () => {
    const [movies, setMovies] = useState([]);
    const [snapshots, setSnapshots] = useState([]);
    const [selectedSnapshot, setSelectedSnapshot] = useState("");
    const [loading, setLoading] = useState(false);

    // Hent snapshot-datoer
    const fetchSnapshotDates = async () => {
        try {
            const res = await fetch("http://localhost:8080/movies/upcoming-snapshot-dates");
            const data = await res.json();
            setSnapshots(data);

            if (data.length > 0) {
                const latestId = data[data.length - 1].id;
                setSelectedSnapshot(latestId);
                fetchMoviesForSnapshot(latestId);
            }
        } catch (err) {
            console.error("Fejl ved hentning af snapshots:", err);
        }
    };

    // Hent film for et bestemt snapshot
    const fetchMoviesForSnapshot = async (snapshotId) => {
        try {
            const res = await fetch(`http://localhost:8080/movies/upcoming-snapshots/${snapshotId}`);
            const data = await res.json();

            const mapped = data.map(entry => {
                const movie = entry.movie || {};
                return {
                    tmdbId: movie.tmdbId,
                    title: movie.title,
                    releaseDate: movie.releaseDate,
                    rating: entry.rating,
                    voteCount: entry.voteCount,
                    posterPath: movie.posterPath,
                };
            });

            setMovies(mapped);
        } catch (err) {
            console.error("Fejl ved hentning af film:", err);
        }
    };

    // Slet et snapshot
    const handleDeleteSnapshot = async () => {
        if (!selectedSnapshot) return;

        if (!window.confirm("Er du sikker på, at du vil slette dette snapshot?")) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/movies/upcoming-snapshot/${selectedSnapshot}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Kunne ikke slette snapshot");
            }

            // Opdater snapshot liste og nulstil valg hvis slettet
            await fetchSnapshotDates();
            setSelectedSnapshot("");
            setMovies([]);
        } catch (error) {
            alert(error.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        await fetch("http://localhost:8080/movies/fetch-upcoming", { method: "POST" });
        await fetchSnapshotDates();
        setLoading(false);
    };

    const handleSnapshotChange = (e) => {
        const newId = e.target.value;
        setSelectedSnapshot(newId);
        fetchMoviesForSnapshot(newId);
    };

    useEffect(() => {
        fetchSnapshotDates();
    }, []);

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
                        onChange={handleSnapshotChange}
                        className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm bg-white"
                    >
                        <option value="">Vælg snapshot-dato</option>
                        {snapshots.map(snap => (
                            <option key={snap.id} value={snap.id}>
                                {new Date(snap.createdAt).toLocaleString("da-DK")}
                            </option>
                        ))}
                    </select>

                    {selectedSnapshot && (
                        <button
                            onClick={handleDeleteSnapshot}
                            className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
                            disabled={loading}
                        >
                            {loading ? "Sletter..." : "Slet snapshot"}
                        </button>
                    )}
                </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {movies.length === 0 && (
                    <p className="text-center text-gray-600 col-span-full">
                        Ingen film fundet for det valgte snapshot.
                    </p>
                )}

                {movies.map((movie, index) => (
                    <div
                        key={`${movie.tmdbId}-${index}`}
                        className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                    >
                        <div className="h-[400px] bg-gray-200">
                            {movie.posterPath ? (
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    Ingen billede
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-blue-800">{movie.title}</h2>
                            <div className="flex items-center text-gray-600 text-sm mt-2">
                                <CalendarDays className="w-4 h-4 mr-2" />
                                {new Date(movie.releaseDate).toLocaleDateString("da-DK", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric"
                                })}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
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
