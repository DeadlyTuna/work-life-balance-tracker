import React from 'react';
import { useLogContext } from '../context/LogContext';

// Mock Component for Charts (Replace with actual library like Chart.js or Recharts)
const MockChart = ({ title }) => (
    <div className="chart-wrapper flex items-center justify-center bg-background-color/50 rounded-lg border border-border-color">
        <p className="text-text-secondary text-center">
            [ Placeholder for a {title} Chart ]
            <br />
            (Integrate your Chart Library here: Chart.js, Recharts, etc.)
        </p>
    </div>
);


const Analytics = () => {
    const { userLogs, isLogsLoading, logsError } = useLogContext();

    if (isLogsLoading) {
        return <div className="content text-center p-20 text-xl">Loading your analytics...</div>;
    }

    if (logsError) {
        return <div className="content text-center p-20 text-accent-color-1">Error fetching log data for analytics.</div>;
    }

    if (!userLogs || userLogs.length < 5) {
        return (
            <div className="content text-center p-10">
                <h1 className="dashboard-main-title">📈 Analytics Overview</h1>
                <div className="dashboard-section p-8">
                    <h2 className="text-xl font-bold mb-4">Not Enough Data Yet</h2>
                    <p className="text-lg text-text-secondary mb-6">
                        You need at least **5 daily logs** to generate meaningful charts and insights.
                    </p>
                    <Link to="/log" className="cta-button w-64 mx-auto">
                        Submit Your First Daily Log →
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="content pt-24 md:pt-28 px-6">
            <h1 className="text-3xl font-bold">📈 Analytics Overview</h1>
            <p className="text-text-secondary mb-8">
                A visual summary of your progress, mood, and productivity trends.
            </p>

            <div className="grid grid-cols-1 gap-6">

                {/* Mood & Energy Trend */}
                <div className="chart-container-card">
                    <h2>Mood & Energy Trend (Last 30 Days)</h2>
                    <MockChart title="Line Chart" />
                </div>

                {/* Habit Completion Rate */}
                <div className="chart-container-card">
                    <h2>Habit Completion Rate by Category</h2>
                    <MockChart title="Doughnut Chart" />
                </div>

                {/* Productivity Score Distribution */}
                <div className="chart-container-card">
                    <h2>Productivity Score Distribution</h2>
                    <MockChart title="Bar Chart" />
                </div>

            </div>

            <div className="analytics-footer">
                Data last updated: {new Date().toLocaleTimeString()}
            </div>
        </div>
    );
};

export default Analytics;