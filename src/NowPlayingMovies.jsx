import React, { useEffect, useState } from 'react';

const MovieList = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        // Hent filmene fra backend
        fetch('http://localhost:8080/movies/now-playing')
            .then((response) => response.json())
            .then((data) => {
                setMovies(data.results); // Antager at "results" indeholder filmene
            })
            .catch((error) => {
                console.error('Error fetching movies:', error);
            });
    }, []); // Tom array gør det kun til at køre én gang, når komponenten loades

    return (
        <div>
            <h1>Now Playing Movies</h1>
            <ul>
                {movies.map((movie) => (
                    <li key={movie.id}>
                        <h2>{movie.title}</h2>
                        <p>Release Date: {movie.release_date}</p>
                        <p>Vote Average: {movie.vote_average}</p>
                        <p>Vote Count: {movie.vote_count}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MovieList;
