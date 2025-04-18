import React, { useEffect, useState } from 'react';

const NowPlayingMovies = () => {
    const [snapshots, setSnapshots] = useState([]);
    const [selectedSnapshot, setSelectedSnapshot] = useState("");
    const [snapshotMovies, setSnapshotMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortField, setSortField] = useState("title");
    const [sortDirection, setSortDirection] = useState("asc");

    useEffect(() => {
        fetchAllSnapshots();
    }, []);

    const fetchAllSnapshots = () => {
        fetch('http://localhost:8080/movies/snapshot')
            .then((res) => res.json())
            .then((data) => {
                setSnapshots(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                console.error("Error fetching snapshots:", err);
                setSnapshots([]);
            });
    };

    const fetchSnapshotsForNowPlaying = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:8080/movies/fetch-movies", {
                method: "POST",
            });

            if (!response.ok) throw new Error("Failed to fetch and save movies");

            const data = await response.json();
            fetchAllSnapshots();

            if (data && data.id) {
                const snapshotId = data.id.toString();
                setSelectedSnapshot(snapshotId);
                fetchMoviesFromSnapshot(snapshotId);
            }
        } catch (error) {
            alert("Error: " + error.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMoviesFromSnapshot = (snapshotId) => {
        setLoading(true);
        fetch(`http://localhost:8080/movies/snapshot/${snapshotId}`)
            .then(res => res.json())
            .then(data => {
                const extractedMovies = data.map(item => {
                    const movie = item.movie || {};
                    return {
                        id: movie.id,
                        title: movie.title,
                        release_date: movie.releaseDate,
                        vote_average: movie.voteAverage != null ? movie.voteAverage : null, // 👈 håndter null-værdi
                        vote_count: movie.voteCount != null ? movie.voteCount : null // 👈 håndter null-værdi
                    };
                });
                setSnapshotMovies(extractedMovies);
            })
            .catch(err => {
                console.error("Error fetching snapshot movies:", err);
                setSnapshotMovies([]);
            })
            .finally(() => setLoading(false));
    };


    const handleSnapshotChange = (e) => {
        const snapshotId = e.target.value;
        setSelectedSnapshot(snapshotId);

        if (snapshotId) {
            fetchMoviesFromSnapshot(snapshotId);
        } else {
            setSnapshotMovies([]);
        }
    };

    const handleSortChange = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const sortMovies = (movies) => {
        if (!Array.isArray(movies)) return [];

        return [...movies].sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];

            if (sortField === "title") {
                valA = valA || "";
                valB = valB || "";
                return sortDirection === "asc"
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            }

            if (sortField === "release_date") {
                valA = valA ? new Date(valA) : new Date(0);
                valB = valB ? new Date(valB) : new Date(0);
            } else {
                valA = Number(valA || 0);
                valB = Number(valB || 0);
            }

            return sortDirection === "asc" ? valA - valB : valB - valA;
        });
    };

    const sortedSnapshotMovies = sortMovies(snapshotMovies);

    const renderSortButtons = () => (
        <div className="sort-controls">
            <span>Sort by: </span>
            {["title", "release_date", "vote_average", "vote_count"].map(field => (
                <button
                    key={field}
                    onClick={() => handleSortChange(field)}
                    className={sortField === field ? "active" : ""}
                >
                    {field.replace("_", " ").toUpperCase()} {sortField === field && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
            ))}
        </div>
    );

    const renderSnapshotMovies = () => {
        if (loading) return <p>Loading...</p>;
        if (!selectedSnapshot) return <p>No snapshot selected.</p>;
        if (sortedSnapshotMovies.length === 0) return <p>No movies found in this snapshot.</p>;

        const snapshot = snapshots.find(s => s.id.toString() === selectedSnapshot);
        const timestamp = snapshot?.createdAt ? new Date(snapshot.createdAt).toLocaleString() : "";

        return (
            <div>
                <h2>Snapshot #{selectedSnapshot} – {timestamp}</h2>
                <ul>
                    {sortedSnapshotMovies.map(movie => (
                        <li key={movie.id}>
                            <strong>{movie.title}</strong> – {movie.release_date || "Unknown date"}
                            <br />
                            Rating: {movie.vote_average} /10 – Votes: {movie.vote_count}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div>
            <h1>Now Playing Snapshot Viewer</h1>

            <button onClick={fetchSnapshotsForNowPlaying} disabled={loading}>
                {loading ? "Loading..." : "Fetch and Save New Snapshot"}
            </button>

            <div style={{ marginTop: "1rem" }}>
                <label htmlFor="snapshotSelect">Choose Snapshot: </label>
                <select id="snapshotSelect" value={selectedSnapshot} onChange={handleSnapshotChange}>
                    <option value="">-- Select a Snapshot --</option>
                    {snapshots.map(snapshot => (
                        <option key={snapshot.id} value={snapshot.id}>
                            #{snapshot.id} – {new Date(snapshot.createdAt).toLocaleString()}
                        </option>
                    ))}
                </select>
            </div>

            {renderSortButtons()}

            {renderSnapshotMovies()}
        </div>
    );
};

export default NowPlayingMovies;
