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

                // Log the structure of the first item to debug
                console.log("Example data structure:", history[0]);

                // Format data with proper date handling
                const formatted = history.map(snap => {
                    const createdAt = snap.snapshots?.createdAt ||
                        snap.snapshot?.createdAt ||
                        snap.createdAt ||
                        new Date().toISOString();

                    const votes = snap.votes || snap.voteCount || 0;

                    // Store the actual Date object for sorting
                    return {
                        rawDate: new Date(createdAt),
                        date: new Date(createdAt).toLocaleDateString(),
                        votes: votes
                    };
                });

                // Sort by date (oldest to newest) so newest appears on right
                const sortedData = formatted.sort((a, b) => a.rawDate - b.rawDate);

                // Remove the rawDate property before setting state
                const cleanData = sortedData.map(({rawDate, ...rest}) => rest);

                console.log("Sorted data for chart:", cleanData);
                setData(cleanData);
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