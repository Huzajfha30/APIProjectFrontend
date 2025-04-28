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
                        <li><Link to="/upcoming-snapshots">Upcoming Snapshots</Link></li>
                    </ul>
                </nav>

                <hr />

                <Routes>
                    <Route path="/" element={
                        <div>
                            {/* Dette er din gamle Vite + React landing page */}
                            <div>
                                <a href="https://vite.dev" target="_blank">
                                    <img src={viteLogo} className="logo" alt="Vite logo" />
                                </a>
                                <a href="https://react.dev" target="_blank">
                                    <img src={reactLogo} className="logo react" alt="React logo" />
                                </a>
                            </div>
                            <h1>Vite + React</h1>
                            <div className="card">
                                <button onClick={() => setCount((count) => count + 1)}>
                                    count is {count}
                                </button>
                                <p>Edit <code>src/App.jsx</code> and save to test HMR</p>
                            </div>
                            <p className="read-the-docs">
                                Click on the Vite and React logos to learn more
                            </p>

                            {/* Din NowPlayingMovies vises på forsiden */}
                            <NowPlayingMovies />
                        </div>
                    } />

                    <Route path="/upcoming" element={<UpcomingMovies />} />
                    <Route path="/upcoming-snapshots" element={<UpcomingSnapshots />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
