import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import UpcomingMovies from "./UpcomingMovies";
import UpcomingSnapshots from "./UpcomingSnapshots.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/upcoming" element={<UpcomingMovies />} />
                <Route path="/upcoming-snapshots" element={<UpcomingSnapshots />} />
            </Routes>
        </Router>
    );
}

export default App;
