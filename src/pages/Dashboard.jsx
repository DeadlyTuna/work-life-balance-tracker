import React, { useMemo } from 'react';
import { useLogContext } from '../context/LogContext'; // FIXED: was '../App'
import { Link } from 'react-router-dom';

// Enhanced App Logo with gradient
const AppLogo = ({ size = 64 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-yellow-400 drop-shadow-lg"
    >
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
        </defs>
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="url(#logoGradient)" fillOpacity="0.3" />
        <path d="M12 6.5L18 9.5V14.5L12 17.5L6 14.5V9.5L12 6.5Z" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 2V6.5" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 9.5L22 7M2 7L6 9.5M22 17L18 14.5M2 17L6 14.5" stroke="url(#logoGradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Dashboard = () => {
    const { userLogs, userHabits, isLogsLoading, isHabitsLoading, logsError, habitsError } = useLogContext();

    const {
        logCount,
        habitCount,
        hasLoggedToday,
        currentStreak,
        recentMoodAverage,
    } = useMemo(() => {
        const todayString = new Date().toLocaleDateString();
        const loggedToday = userLogs.some(log => log.date === todayString);
        const countLogs = userLogs.length;
        const countHabits = userHabits.length;
        const mockStreak = loggedToday ? 5 : 0;

        const recentLogs = userLogs.slice(-5);
        const totalMood = recentLogs.reduce((sum, log) => sum + (log.mood_score || 0), 0);
        const avgMood = recentLogs.length > 0 ? (totalMood / recentLogs.length).toFixed(1) : 'N/A';

        return {
            logCount: countLogs,
            habitCount: countHabits,
            hasLoggedToday: loggedToday,
            currentStreak: mockStreak,
            recentMoodAverage: avgMood,
        };
    }, [userLogs, userHabits]);

    if (isLogsLoading || isHabitsLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-xl text-gray-300 font-semibold">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    if (logsError || habitsError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
                <div className="text-center bg-red-900/20 border border-red-500 rounded-2xl p-8 max-w-md">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold mb-2 text-red-400">Error Loading Data</h2>
                    <p className="text-gray-300">There was an issue fetching your data. Please try refreshing.</p>
                </div>
            </div>
        );
    }

    const getMoodEmoji = (mood) => {
        if (mood >= 8) return '😊';
        if (mood >= 6) return '😌';
        if (mood >= 4) return '😐';
        return '😔';
    };

    const getMoodMessage = (mood) => {
        if (mood >= 8) return 'You\'re doing amazing!';
        if (mood >= 6) return 'Keep up the balanced vibes';
        if (mood >= 4) return 'Small steps forward';
        return 'Remember to be kind to yourself';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-24 md:pt-28 pb-12 px-4 sm:px-6 lg:px-8">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Hero Header */}
                <header className="text-center mb-16">
                    <div className="inline-flex items-center justify-center space-x-3 mb-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 backdrop-blur-sm shadow-xl">
                        <AppLogo size={32} />
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-400 tracking-wider">LIBRA</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 mb-4 tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Your personal sanctuary for growth, reflection, and balance
                    </p>

                    {/* Primary Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/habits"
                            className={`group relative px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-yellow-500/50 flex items-center justify-center min-w-[220px] ${hasLoggedToday
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900'
                                }`}
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                {hasLoggedToday ? (
                                    <>
                                        <span className="text-2xl">✅</span>
                                        <span>Check-in Complete</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-2xl">✨</span>
                                        <span>Daily Check-in</span>
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                        </Link>

                        <Link
                            to="/habits"
                            className="group px-10 py-5 bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm text-gray-200 font-bold rounded-2xl shadow-xl border-2 border-gray-600/50 hover:border-yellow-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 min-w-[220px]"
                        >
                            <span className="text-2xl">🎯</span>
                            <span>Manage Habits</span>
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        {
                            title: "Journal Entries",
                            count: logCount,
                            unit: "reflections",
                            icon: "📖",
                            gradient: "from-blue-500/20 to-cyan-500/20",
                            border: "border-blue-500/30",
                            iconBg: "bg-blue-500/10"
                        },
                        {
                            title: "Active Habits",
                            count: habitCount,
                            unit: "routines",
                            icon: "🎯",
                            gradient: "from-purple-500/20 to-pink-500/20",
                            border: "border-purple-500/30",
                            iconBg: "bg-purple-500/10"
                        },
                        {
                            title: "Current Streak",
                            count: currentStreak,
                            unit: "days strong",
                            icon: "🔥",
                            gradient: "from-orange-500/20 to-red-500/20",
                            border: "border-orange-500/30",
                            iconBg: "bg-orange-500/10"
                        },
                    ].map((metric, index) => (
                        <div
                            key={index}
                            className={`group relative bg-gradient-to-br ${metric.gradient} backdrop-blur-sm p-8 rounded-2xl text-center border ${metric.border} shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative z-10">
                                <div className={`inline-flex items-center justify-center w-16 h-16 ${metric.iconBg} rounded-2xl mb-4 text-4xl transform group-hover:rotate-12 transition-transform duration-300`}>
                                    {metric.icon}
                                </div>
                                <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400 mb-2">
                                    {metric.count}
                                </p>
                                <p className="text-sm text-gray-300 uppercase tracking-wider font-bold mb-1">{metric.title}</p>
                                <p className="text-xs text-gray-500">{metric.unit}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Insights & Quick Actions Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Mood Insights */}
                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm p-8 rounded-2xl border border-indigo-500/30 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-2xl">
                                💡
                            </div>
                            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
                                Mood Insights
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-gray-400 text-sm uppercase tracking-wide font-semibold">Recent Average</span>
                                    <span className="text-5xl">{getMoodEmoji(parseFloat(recentMoodAverage))}</span>
                                </div>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-4xl font-black text-yellow-400">{recentMoodAverage}</span>
                                    <span className="text-gray-500 text-lg">/10</span>
                                </div>
                                <p className="text-gray-300 text-sm italic">"{getMoodMessage(parseFloat(recentMoodAverage))}"</p>
                            </div>

                            <Link
                                to="/analytics"
                                className="group flex items-center justify-between w-full bg-gradient-to-r from-yellow-500/10 to-amber-500/10 hover:from-yellow-500/20 hover:to-amber-500/20 text-yellow-400 px-6 py-4 rounded-xl font-semibold border border-yellow-500/30 transition-all duration-300"
                            >
                                <span>Explore Detailed Analytics</span>
                                <span className="transform group-hover:translate-x-2 transition-transform text-xl">→</span>
                            </Link>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm p-8 rounded-2xl border border-emerald-500/30 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-2xl">
                                ⚡
                            </div>
                            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
                                Quick Actions
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {[
                                { icon: '⏰', label: 'Set Reminder', path: '/reminders' },
                                { icon: '🍅', label: 'Pomodoro Timer', path: '/pomodoro-timer' },
                                { icon: '📊', label: 'View Analytics', path: '/analytics' },
                                { icon: '⚙️', label: 'Settings', path: '/settings' },
                            ].map((action, idx) => (
                                <Link
                                    key={idx}
                                    to={action.path}
                                    className="group flex items-center gap-4 bg-gray-800/50 hover:bg-gray-700/50 px-6 py-4 rounded-xl border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300"
                                >
                                    <span className="text-2xl transform group-hover:scale-110 transition-transform">{action.icon}</span>
                                    <span className="text-gray-300 font-medium flex-1">{action.label}</span>
                                    <span className="text-gray-600 group-hover:text-yellow-400 transform group-hover:translate-x-1 transition-all">→</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Motivational Footer */}
                <div className="mt-12 text-center">
                    <div className="inline-block bg-gradient-to-r from-yellow-500/10 to-amber-500/10 backdrop-blur-sm px-8 py-4 rounded-full border border-yellow-500/30">
                        <p className="text-gray-400 italic">
                            "Balance is not something you find, it's something you create." ✨
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;