import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const MovieVotesGraph = ({ movieTitle }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!movieTitle) return;

        fetch(`http://localhost:8080/movies/movie-vote-history/by-title/${encodeURIComponent(movieTitle)}`)
            .then(res => res.json())
            .then(history => {
                console.log("Fetched vote history:", history);
                const formatted = history.map(snap => ({
                    date: new Date(snap.snapshots.createdAt).toLocaleDateString(),
                    votes: snap.votes
                }));
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
