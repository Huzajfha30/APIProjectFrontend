import React, { useEffect, useState } from "react";
import { CalendarDays, Clapperboard } from "lucide-react";
import axios from "axios";

const UpcomingSnapshots = () => {
    const [snapshots, setSnapshots] = useState([]);
    const [selectedSnapshotId, setSelectedSnapshotId] = useState("");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    // Hent snapshot-datoer
    const fetchSnapshotDates = async () => {
        try {
            const res = await axios.get("http://localhost:8080/movies/upcoming-snapshot-dates");
            setSnapshots(res.data);

            if (res.data.length > 0) {
                const latestId = res.data[res.data.length - 1].id;
                setSelectedSnapshotId(latestId);
                fetchMoviesForSnapshot(latestId);
            }
        } catch (err) {
            console.error("Fejl ved hentning af snapshot-datoer:", err);
        }
    };

    // Hent film for valgt snapshot
    const fetchMoviesForSnapshot = async (snapshotId) => {
        try {
            const res = await axios.get(`http://localhost:8080/movies/upcoming-snapshots/${snapshotId}`);
            const data = res.data.map(snapshot => {
                const movie = snapshot.movie || {};
                return {
                    title: movie.title,
                    releaseDate: movie.releaseDate,
                    rating: snapshot.rating,
                    voteCount: snapshot.voteCount,
                    posterPath: movie.posterPath,
                    tmdbId: movie.tmdbId
                };
            });

            setMovies(data);
        } catch (err) {
            console.error("Fejl ved hentning af film:", err);
        }
    };

    // Hent nyt snapshot (POST)
    const handleFetchNewSnapshot = async () => {
        setLoading(true);
        try {
            await axios.post("http://localhost:8080/movies/fetch-upcoming");
            await fetchSnapshotDates();
        } catch (err) {
            console.error("Fejl ved hentning af nye film:", err);
        } finally {
            setLoading(false);
        }
    };

    // Snapshot ændres manuelt
    const handleSnapshotChange = (e) => {
        const id = e.target.value;
        setSelectedSnapshotId(id);
        fetchMoviesForSnapshot(id);
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

                <div className="flex gap-4 items-center">
                    <button
                        onClick={handleFetchNewSnapshot}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                        disabled={loading}
                    >
                        {loading ? "Opdaterer..." : "Hent nyt snapshot"}
                    </button>

                    <select
                        className="px-4 py-2 rounded-lg border border-gray-300 shadow"
                        value={selectedSnapshotId}
                        onChange={handleSnapshotChange}
                    >
                        <option value="">Vælg snapshot-dato</option>
                        {snapshots.map(snap => (
                            <option key={snap.id} value={snap.id}>
                                {new Date(snap.createdAt).toLocaleString("da-DK")}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies.map((movie, index) => (
                    <div
                        key={movie.tmdbId ? `${movie.tmdbId}-${index}` : index}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
                    >
                        <div className="h-[400px] bg-gray-200 flex items-center justify-center">
                            {movie.posterPath ? (
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                                    alt={movie.title}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <span className="text-gray-500">Ingen plakat</span>
                            )}
                        </div>
                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-blue-800 mb-2">{movie.title}</h2>
                            <div className="flex items-center text-sm text-gray-600">
                                <CalendarDays className="w-4 h-4 mr-2" />
                                {new Date(movie.releaseDate).toLocaleDateString("da-DK", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric"
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

export default UpcomingSnapshots;
