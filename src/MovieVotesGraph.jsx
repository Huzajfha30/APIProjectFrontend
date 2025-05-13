import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const MovieVotesGraph = ({ movieTitle }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!movieTitle) return;

        fetch(`http://localhost:8080/movies/movie-vote-history/by-title/${encodeURIComponent(movieTitle)}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(history => {
                console.log("Fetched vote history:", history);

                // Check if history exists and is an array
                if (!history || !Array.isArray(history) || history.length === 0) {
                    console.warn("No vote history data received");
                    setData([]);
                    return;
                }

                // First, log the structure of the first item to debug
                console.log("Example data structure:", history[0]);

                // Try to create formatted data safely
                const formatted = history.map(snap => {
                    // Adapt this based on your actual API response structure
                    const createdAt = snap.snapshots?.createdAt ||
                        snap.snapshot?.createdAt ||
                        snap.createdAt ||
                        new Date().toISOString();

                    const votes = snap.votes || snap.voteCount || 0;

                    return {
                        date: new Date(createdAt).toLocaleDateString(),
                        votes: votes
                    };
                });

                console.log("Formatted data for chart:", formatted);
                setData(formatted);
            })
            .catch(err => console.error("Error fetching vote history:", err));
    }, [movieTitle]);

    return (
        <div>
            <h2>Votes over time</h2>
            <LineChart width={600} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="votes" stroke="#8884d8" />
            </LineChart>
        </div>
    );
};

export default MovieVotesGraph;
