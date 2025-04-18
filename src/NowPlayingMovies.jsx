import React, { useEffect, useState } from 'react';

const NowPlayingMovies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('release_date');
    const [snapshots, setSnapshots] = useState([]);
    const [selectedSnapshotId, setSelectedSnapshotId] = useState(null);

    // Hent alle snapshots
    const fetchSnapshots = () => {
        fetch('http://localhost:8080/movies/snapshots')
            .then((res) => {
                console.log('Status:', res.status);
                return res.json();
            })
            .then((data) => {
                console.log('Snapshot-data:', data);
                setSnapshots(data);
            })
            .catch((err) => console.error('Fejl ved hentning af snapshots:', err));
    };

    // Hent film baseret på snapshot ID
    const fetchMoviesFromSnapshot = (snapshotId) => {
        setLoading(true);  // Vis loading indikator, indtil vi har data
        fetch(`http://localhost:8080/movies/${snapshotId}`)
            .then((res) => res.json())
            .then((data) => {
                // Hvis data er en liste af film, opdater UI
                if (Array.isArray(data)) {
                    setMovies(data);  // Opdater state med filmene
                } else {
                    console.error('Fejl: Data er ikke en liste');
                    setMovies([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Fejl ved hentning af film:', err);
                setLoading(false);
            });
    };

// Når snapshot ændres, hent filmene
    useEffect(() => {
        if (selectedSnapshotId) {
            fetchMoviesFromSnapshot(selectedSnapshotId);
        }
    }, [selectedSnapshotId]);

    // POST til at hente nyt snapshot fra API
    const handleFetchNewSnapshot = () => {
        fetch('http://localhost:8080/movies/fetch-movies', {
            method: 'POST',
        })
            .then((res) => {
                if (!res.ok) throw new Error('Kunne ikke oprette snapshot');
                return res.json(); // Forventer at få JSON som svar
            })
            .then((data) => {
                // Hvis data ikke bruges, kan du ignorere det eller logge det
                console.log(data); // Hvis du vil se, hvad der er i data

                alert('Nyt snapshot oprettet');
                fetchSnapshots(); // Hent de nyeste snapshots efter oprettelsen
            })
            .catch((err) => {
                console.error(err);
                alert('Fejl ved oprettelse af snapshot');
            });
    };


    // Når komponent loader
    useEffect(() => {
        fetchSnapshots();
    }, []);

    // Hent film når der vælges snapshot
    useEffect(() => {
        if (selectedSnapshotId) {
            fetchMoviesFromSnapshot(selectedSnapshotId);
        }
    }, [selectedSnapshotId]);

    // Sorter film
    const sortedMovies = [...movies].sort((a, b) => {
        if (sortBy === 'release_date') {
            return new Date(b.release_date) - new Date(a.release_date);
        }
        if (sortBy === 'vote_average') {
            return b.vote_average - a.vote_average;
        }
        if (sortBy === 'vote_count') {
            return b.vote_count - a.vote_count;
        }
        return 0;
    });

    return (
        <div>
            <h2>Now Playing Movies in theaters</h2>

            {/* Knappen til at hente nyt snapshot */}
            <button onClick={handleFetchNewSnapshot} style={{ marginBottom: '1rem' }}>
                Hent Nyt Snapshot
            </button>

            {/* Dropdown til snapshots */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="snapshot-select">Vælg snapshot: </label>
                <select
                    id="snapshot-select"
                    value={selectedSnapshotId || ''}
                    onChange={(e) => setSelectedSnapshotId(e.target.value)}
                >
                    {snapshots.map((snap, index) => {
                        const key = snap.id ?? `fallback-${index}`;
                        const label = snap.createdAt
                            ? new Date(snap.createdAt).toLocaleString()
                            : `Snapshot #${index + 1}`;

                        return (
                            <option key={key} value={snap.id}>
                                {label}
                            </option>
                        );
                    })}
                </select>
            </div>

            {/* Sortering */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="sort-select">Sortér efter: </label>
                <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="release_date">Release Date</option>
                    <option value="vote_average">Highest Rating</option>
                    <option value="vote_count">Votes</option>
                </select>
            </div>

            {/* Film liste */}
            {loading ? (
                <p>Indlæser film...</p>
            ) : (
                <ul>
                    {sortedMovies.map((movie) => {
                        // Håndter dato korrekt, hvis den er ugyldig
                        console.log(movie); // Tjek hvad der er i movie
                        const releaseDate = new Date(movie.release_date);
                        const formattedDate = releaseDate instanceof Date && !isNaN(releaseDate)
                            ? releaseDate.toLocaleDateString()
                            : 'Invalid Date'; // Hvis datoen er ugyldig, vis "Invalid Date"

                        // Håndter rating og votes, hvis de er null eller undefined
                        const rating = movie.vote_average != null ? movie.vote_average : 'N/A'; // Hvis rating er null, vis 'N/A'
                        const votes = movie.vote_count != null ? movie.vote_count : 'N/A'; // Hvis votes er null, vis 'N/A'

                        return (
                            <li key={movie.id}>
                                <strong>{movie.title}</strong> – {formattedDate}<br />
                                Rating: {rating} – Votes: {votes}
                            </li>
                        );
                    })}
                </ul>


            )}
        </div>
    );
};

export default NowPlayingMovies;
