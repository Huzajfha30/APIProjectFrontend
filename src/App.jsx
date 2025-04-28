import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import UpcomingMovies from "./UpcomingMovies";
import UpcomingSnapshots from "./UpcomingSnapshots";
import NowPlayingMovies from "./NowPlayingMovies";
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
    const [count, setCount] = useState(0);

    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/upcoming">Upcoming Movies</Link></li>
                        <li><Link to="/now-playing">Now Playing Movies</Link></li>
                    </ul>
                </nav>

                <hr />

                <Routes>
                    <Route path="/upcoming" element={<UpcomingMovies />} />
                    <Route path="/now-playing" element={<NowPlayingMovies />} />
                    {/* Tilføj flere ruter her, hvis nødvendigt */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
