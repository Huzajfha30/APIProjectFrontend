import React, { useEffect, useState } from 'react';

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [snapshots, setSnapshots] = useState([]);
    const [selectedSnapshot, setSelectedSnapshot] = useState("");
    const [snapshotMovies, setSnapshotMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortField, setSortField] = useState("title"); // Default sort field
    const [sortDirection, setSortDirection] = useState("asc"); // Default sort direction

    // Hent filmene fra backend
    useEffect(() => {
        fetch('http://localhost:8080/movies/now-playing')
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched movies:", data);
                setMovies(data.results);
            })
            .catch((error) => {
                console.error('Error fetching movies:', error);
            });

        // Load all available snapshots when component mounts
        fetchAllSnapshots();
    }, []);

    // Hent alle tilgængelige snapshots
    const fetchAllSnapshots = () => {
        fetch('http://localhost:8080/movies/snapshots')
            .then((response) => response.json())
            .then((data) => {
                console.log("All snapshots:", data);
                setSnapshots(data);
            })
            .catch((error) => {
                console.error('Error fetching snapshots:', error);
            });
    };

    // Hent snapshots for de nuværende "now-playing" film
    const fetchSnapshotsForNowPlaying = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:8080/movies/fetch-movies", {
                method: "POST",
            });

            if (!response.ok) {
                console.error("Failed to fetch and save movies: ", response);
                throw new Error("Failed to fetch and save movies");
            }

            const data = await response.json();
            console.log("Snapshot created:", data);

            // Opdater listen af snapshots
            fetchAllSnapshots();
            // Automatisk vælg den nye snapshot
            setSelectedSnapshot(data.id.toString());
            fetchMoviesFromSnapshot(data.id);
        } catch (error) {
            console.error("Error saving movies:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch movies from a specific snapshot
    const fetchMoviesFromSnapshot = (snapshotId) => {
        setLoading(true);
        fetch(`http://localhost:8080/movies/${snapshotId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Snapshot movies:", data);
                setSnapshotMovies(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching snapshot movies:', error);
                setLoading(false);
            });
    };

    // Håndterer ændring i dropdown-menuen
    const handleSnapshotChange = (event) => {
        const snapshotId = event.target.value;
        setSelectedSnapshot(snapshotId);

        if (snapshotId) {
            fetchMoviesFromSnapshot(snapshotId);
        } else {
            setSnapshotMovies([]);
        }
    };

    // Handle sorting change
    const handleSortChange = (field) => {
        // If clicking the same field, toggle direction
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            // New field, default to ascending
            setSortField(field);
            setSortDirection("asc");
        }
    };

    // Sort function for movies
    const sortMovies = (moviesToSort) => {
        if (!moviesToSort) return [];

        return [...moviesToSort].sort((a, b) => {
            let valueA, valueB;

            if (sortField === "title") {
                valueA = a.title || "";
                valueB = b.title || "";
                return sortDirection === "asc"
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            }
            else if (sortField === "vote_average" || sortField === "vote_count") {
                valueA = Number(a[sortField] || 0);
                valueB = Number(b[sortField] || 0);
            }
            else if (sortField === "release_date") {
                valueA = a.release_date ? new Date(a.release_date) : new Date(0);
                valueB = b.release_date ? new Date(b.release_date) : new Date(0);
            }

            if (valueA === valueB) return 0;

            if (sortDirection === "asc") {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });
    };

    // Get sorted movies
    const sortedSnapshotMovies = sortMovies(snapshotMovies);
    const sortedMovies = sortMovies(movies);

    // Helper to render sort buttons
    const renderSortButtons = () => (
        <div className="sort-controls">
            <span>Sort by: </span>
            <button
                onClick={() => handleSortChange("title")}
                className={sortField === "title" ? "active" : ""}
            >
                Title {sortField === "title" && (sortDirection === "asc" ? "↑" : "↓")}
            </button>
            <button
                onClick={() => handleSortChange("release_date")}
                className={sortField === "release_date" ? "active" : ""}
            >
                Release Date {sortField === "release_date" && (sortDirection === "asc" ? "↑" : "↓")}
            </button>
            <button
                onClick={() => handleSortChange("vote_average")}
                className={sortField === "vote_average" ? "active" : ""}
            >
                Rating {sortField === "vote_average" && (sortDirection === "asc" ? "↑" : "↓")}
            </button>
            <button
                onClick={() => handleSortChange("vote_count")}
                className={sortField === "vote_count" ? "active" : ""}
            >
                Votes {sortField === "vote_count" && (sortDirection === "asc" ? "↑" : "↓")}
            </button>
        </div>
    );

    return (
        <div>
            <h1>Now Playing Movies</h1>
            <button
                onClick={fetchSnapshotsForNowPlaying}
                disabled={loading}
            >
                {loading ? "Loading..." : "Fetch and Save Movies"}
            </button>

            <h2>Saved Snapshots</h2>
            <select onChange={handleSnapshotChange} value={selectedSnapshot}>
                <option value="">Select a Snapshot</option>
                {snapshots.map((snapshot) => (
                    <option key={snapshot.id} value={snapshot.id}>
                        Snapshot from {new Date(snapshot.createdAt).toLocaleString()}
                    </option>
                ))}
            </select>

            {loading && <p>Loading...</p>}

            {renderSortButtons()}

            {selectedSnapshot && sortedSnapshotMovies.length > 0 && (
                <div>
                    <h3>Movies from Selected Snapshot</h3>
                    <ul>
                        {sortedSnapshotMovies.map((movie) => (
                            <li key={movie.id}>
                                <strong>{movie.title}</strong> – {movie.release_date}
                                <br />
                                Rating: {movie.vote_average || 'N/A'} {movie.vote_average ? '/10' : ''} – Votes: {movie.vote_count || 0}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <h2>Current Movies</h2>
            <ul>
                {sortedMovies.map((movie) => (
                    <li key={movie.id}>
                        <strong>{movie.title}</strong> – {movie.release_date}
                        <br />
                        Rating: {movie.vote_average || 'N/A'} {movie.vote_average ? '/10' : ''} – Votes: {movie.vote_count || 0}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MovieList;