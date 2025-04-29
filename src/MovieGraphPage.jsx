import React, { useEffect, useState } from "react";
import MovieVotesGraph from "./MovieVotesGraph";

const MovieGraphPage = () => {
    const [movies, setMovies] = useState([]);
    const [selectedMovieTitle, setSelectedMovieTitle] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/movies/now-playing")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data.results)) {
                    setMovies(data.results);
                } else {
                    console.error("Expected 'results' to be an array", data);
                }
            })
            .catch(err => console.error("Error fetching movies:", err));
    }, []);

    return (
        <div>
            <h1>Choose a Movie</h1>
            <select onChange={(e) => setSelectedMovieTitle(e.target.value)} defaultValue="">
                <option value="" disabled>-- Select a movie --</option>
                {movies.map(movie => (
                    <option key={movie.id} value={movie.title}>
                        {movie.title}
                    </option>
                ))}
            </select>

            {selectedMovieTitle && <MovieVotesGraph movieTitle={selectedMovieTitle} />}
        </div>
    );
};

export default MovieGraphPage;
