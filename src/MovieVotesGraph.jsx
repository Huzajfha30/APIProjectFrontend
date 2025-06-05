import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const UpcomingMoviesCountGraph = () => {
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Hent alle snapshots (med dato)
            const snapshotRes = await fetch("http://localhost:8080/movies/upcoming-snapshot-dates");
            const snapshots = await snapshotRes.json();

            // Sorter snapshots efter createdAt stigende
            snapshots.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            const labels = snapshots.map(s => new Date(s.createdAt).toLocaleDateString());

            // For hvert snapshot hent antal film i snapshot
            const counts = [];

            for (const snap of snapshots) {
                const res = await fetch(`http://localhost:8080/movies/upcoming-snapshots/${snap.id}`);
                const movies = await res.json();
                counts.push(movies.length);  // antal film i snapshot
            }

            const datasets = [
                {
                    label: "Antal film i snapshot",
                    data: counts,
                    borderColor: "#007bff",
                    backgroundColor: "#007bff",
                    fill: false,
                    tension: 0.2,
                },
            ];

            setChartData({ labels, datasets });
        } catch (e) {
            console.error("Fejl ved hentning af data:", e);
            setChartData(null);
        }
        setLoading(false);
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <p>Indlæser data...</p>;
    if (!chartData) return <p>Ingen data tilgængelig.</p>;

    return (
        <div>
            <h2>Antal kommende film pr. snapshot over tid</h2>
            <Line data={chartData} />
        </div>
    );
};

export default UpcomingMoviesCountGraph;
