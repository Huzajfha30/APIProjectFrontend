import React, {  } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import UpcomingMovies from "./UpcomingMovies";
import UpcomingSnapshots from "./UpcomingSnapshots";
import NowPlayingMovies from "./NowPlayingMovies";
import MovieGraphPage from "./MovieGraphPage";

import './App.css';

function App() {


    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/upcoming">Upcoming Movies</Link></li>
                        <li><Link to="/now-playing">Now Playing Movies</Link></li>
                        <li><Link to="/movie-graph">Movies History Graph</Link></li>
                    </ul>
                </nav>

                <hr />

                <Routes>
                    <Route path="/upcoming" element={<UpcomingMovies />} />
                    <Route path="/now-playing" element={<NowPlayingMovies />} />
                    <Route path="/movie-graph" element={<MovieGraphPage/>} />
                    {/* Tilføj flere ruter her, hvis nødvendigt */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
