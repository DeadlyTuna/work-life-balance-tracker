import React, { useState } from 'react';
import { useLogContext } from '../context/LogContext';
import { useTheme } from '../context/ThemeContext';

const Analytics = () => {
    const { userHabits, userLogs, toggleHabit, addLog } = useLogContext();
    const { darkMode } = useTheme();

    const [step, setStep] = useState(1); // 1: Mood Questions, 2: Habits, 3: AI Analysis
    const [moodAnswers, setMoodAnswers] = useState({
        energy: 50,
        stress: 50,
        happiness: 50,
        productivity: 50,
        sleepQuality: 50
    });
    const [aiData, setAiData] = useState({
        workHours: 8,
        restHours: 2,
        sleepHours: 7,
        exerciseHours: 1,
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const today = new Date().toISOString().split('T')[0];
    const todaysLog = userLogs.find(l => l.date === today);
    const completedHabits = todaysLog?.completed_habits || [];

    // Mood Questions
    const moodQuestions = [
        { key: 'energy', label: 'How energetic do you feel today?', emoji: '⚡', min: 'Exhausted', max: 'Energized' },
        { key: 'stress', label: 'What is your stress level?', emoji: '😰', min: 'Calm', max: 'Overwhelmed' },
        { key: 'happiness', label: 'How happy are you feeling?', emoji: '😊', min: 'Sad', max: 'Joyful' },
        { key: 'productivity', label: 'How productive were you today?', emoji: '📈', min: 'Unproductive', max: 'Very Productive' },
        { key: 'sleepQuality', label: 'How well did you sleep last night?', emoji: '😴', min: 'Terrible', max: 'Excellent' }
    ];

    const handleMoodChange = (key, value) => {
        setMoodAnswers(prev => ({ ...prev, [key]: parseInt(value) }));
    };

    const handleAiChange = (e) => {
        const { name, value } = e.target;
        setAiData(prev => ({ ...prev, [name]: parseFloat(value) }));
    };

    const calculateMoodScore = () => {
        const { energy, stress, happiness, productivity, sleepQuality } = moodAnswers;
        // Invert stress (lower stress = better)
        const invertedStress = 101 - stress;
        // Average of 5 questions (each 1-100)
        return Math.round((energy + invertedStress + happiness + productivity + sleepQuality) / 5);
    };

    const calculateAIScore = () => {
        setLoading(true);
        setTimeout(() => {
            const { workHours, restHours, sleepHours, exerciseHours } = aiData;

            let mentalScore = (
                (sleepHours * 0.35) +
                (restHours * 0.25) +
                (exerciseHours * 0.30) -
                (workHours * 0.20)
            ) * 20;

            mentalScore += 30;
            if (mentalScore > 100) mentalScore = 100;
            if (mentalScore < 0) mentalScore = 0;

            let lifespan = 75;
            lifespan += Math.min(exerciseHours * 1.5, 10);
            if (sleepHours >= 7 && sleepHours <= 9) lifespan += 5;
            if (sleepHours < 5) lifespan -= 5;
            if (workHours > 9) lifespan -= (workHours - 9) * 1.5;
            if (restHours > 5) lifespan -= 2;

            // Normalize lifespan to 0-100 scale (assuming 50-90 range)
            const normalizedLifespan = Math.min(Math.max(((lifespan - 50) / 40) * 100, 0), 100);

            // Calculate overall mood score as average of all three criteria
            const moodQuestionsScore = calculateMoodScore();
            const overallMoodScore = Math.round((moodQuestionsScore + mentalScore + normalizedLifespan) / 3);

            setResult({
                moodQuestionsScore: moodQuestionsScore,
                mentalScore: Math.round(mentalScore),
                lifespan: Math.round(lifespan),
                overallMoodScore: overallMoodScore,
                feedback: generateFeedback(overallMoodScore),
                improvements: generateImprovements(workHours, restHours, sleepHours, exerciseHours)
            });
            setLoading(false);
        }, 1500);
    };

    const generateFeedback = (score) => {
        if (score > 80) return "You have an excellent balance! Your habits are supporting strong mental health and longevity.";
        if (score > 60) return "You're doing well, but there's room for improvement. Consider adjusting your work-rest ratio.";
        if (score > 40) return "Your balance is fair. Try to prioritize more sleep or exercise to boost your score.";
        return "Your habits might be leading to burnout. It's critical to reduce work hours or increase rest and sleep.";
    };

    const generateImprovements = (work, rest, sleep, exercise) => {
        const tips = [];
        if (sleep < 7) tips.push("😴 Increase sleep to at least 7 hours for better recovery.");
        if (sleep > 9) tips.push("⏰ Oversleeping can make you groggy. Try to stick to 7-9 hours.");
        if (exercise < 0.5) tips.push("🏃‍♂️ Add at least 30 mins of daily movement to boost mood.");
        if (work > 9) tips.push("🛑 Reduce daily work hours to prevent long-term burnout.");
        if (rest < 2) tips.push("🧘‍♀️ Schedule more downtime to disconnect and recharge.");
        if (tips.length === 0) tips.push("🌟 Keep up the great work! You're crushing it.");
        return tips;
    };

    const handleComplete = async () => {
        const moodScore = calculateMoodScore();
        await addLog({
            date: today,
            mood_score: moodScore,
            reflection: `Energy: ${moodAnswers.energy}, Stress: ${moodAnswers.stress}, Happiness: ${moodAnswers.happiness}, Productivity: ${moodAnswers.productivity}, Sleep: ${moodAnswers.sleepQuality}`
        });
        calculateAIScore();
        setStep(3);
    };

    return (
        <div className={`min-h-screen p-6 pt-24 md:pt-28 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold mb-2">📊 Daily Wellness Check-In</h1>
                    <p className="text-lg opacity-70">Track your mood, habits, and get AI-powered insights</p>
                </div>

                {/* Progress Indicator */}
                <div className="flex justify-center items-center mb-8 space-x-4">
                    {[1, 2, 3].map(s => (
                        <div key={s} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                                : 'bg-gray-700 text-gray-400'
                                }`}>
                                {s}
                            </div>
                            {s < 3 && <div className={`w-16 h-1 ${step > s ? 'bg-indigo-500' : 'bg-gray-700'}`} />}
                        </div>
                    ))}
                </div>

                {/* Step 1: Mood Questions */}
                {step === 1 && (
                    <div className={`rounded-3xl shadow-2xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <h2 className="text-2xl font-bold mb-6 text-center">How are you feeling today?</h2>
                        <div className="space-y-6">
                            {moodQuestions.map(q => (
                                <div key={q.key} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-lg font-semibold">
                                            {q.emoji} {q.label}
                                        </label>
                                        <span className="text-2xl font-bold text-indigo-400">{moodAnswers[q.key]}/100</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={moodAnswers[q.key]}
                                        onChange={(e) => handleMoodChange(q.key, e.target.value)}
                                        className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                    <div className="flex justify-between text-xs opacity-60">
                                        <span>{q.min}</span>
                                        <span>{q.max}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setStep(2)}
                            className="mt-8 w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white shadow-lg transform transition-all hover:scale-[1.02]"
                        >
                            Next: Track Habits →
                        </button>
                    </div>
                )}

                {/* Step 2: Habits */}
                {step === 2 && (
                    <div className={`rounded-3xl shadow-2xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <h2 className="text-2xl font-bold mb-6 text-center">Today's Habits</h2>
                        <div className="space-y-4 mb-8">
                            {userHabits.length === 0 ? (
                                <div className="text-center p-8 bg-gray-700/30 rounded-xl">
                                    <p className="text-gray-400">No habits found. Create habits in the Habits page!</p>
                                </div>
                            ) : (
                                userHabits.map(habit => {
                                    const isCompleted = completedHabits.includes(habit.id);
                                    return (
                                        <div key={habit.id} className="flex items-center justify-between bg-gray-700/30 p-4 rounded-xl border border-gray-600">
                                            <div>
                                                <h3 className={`font-semibold text-lg ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                                                    {habit.name}
                                                </h3>
                                                <p className="text-sm text-gray-400">{habit.frequency}</p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleHabit(habit.id, today);
                                                }}
                                                className={`px-6 py-2 rounded-lg font-bold transition-all ${isCompleted
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                                    : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                                                    }`}
                                            >
                                                {isCompleted ? '✓ Done' : 'Mark Done'}
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 py-4 rounded-xl font-bold text-lg bg-gray-700 hover:bg-gray-600 text-white"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={handleComplete}
                                className="flex-1 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white shadow-lg transform transition-all hover:scale-[1.02]"
                            >
                                Get AI Analysis →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: AI Analysis */}
                {step === 3 && (
                    <div className={`rounded-3xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
                            <h2 className="text-3xl font-extrabold text-white mb-2">🤖 AI Health Analysis</h2>
                            <p className="text-indigo-100">Powered by our custom wellness algorithm</p>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Input Form */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold border-b border-gray-700 pb-2">Your Daily Habits</h3>
                                {[
                                    { label: 'Avg Work Hours', name: 'workHours', min: 0, max: 16 },
                                    { label: 'Avg Rest Hours', name: 'restHours', min: 0, max: 16 },
                                    { label: 'Avg Sleep Hours', name: 'sleepHours', min: 0, max: 12 },
                                    { label: 'Avg Exercise Hours', name: 'exerciseHours', min: 0, max: 6 },
                                ].map((field) => (
                                    <div key={field.name}>
                                        <div className="flex justify-between mb-1">
                                            <label className="text-sm font-medium opacity-80">{field.label}</label>
                                            <span className="font-bold text-indigo-400">{aiData[field.name]}h</span>
                                        </div>
                                        <input
                                            type="range"
                                            name={field.name}
                                            min={field.min}
                                            max={field.max}
                                            step="0.5"
                                            value={aiData[field.name]}
                                            onChange={handleAiChange}
                                            className="w-full accent-indigo-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={calculateAIScore}
                                    disabled={loading}
                                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all hover:scale-[1.02] ${loading
                                        ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                                        : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white'
                                        }`}
                                >
                                    {loading ? 'Analyzing...' : '🔍 Recalculate'}
                                </button>
                            </div>

                            {/* Results */}
                            <div className="flex flex-col justify-center">
                                {!result ? (
                                    <div className="text-center opacity-50 space-y-4">
                                        <div className="text-6xl">📊</div>
                                        <h3 className="text-xl font-semibold">Calculating...</h3>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Mood Score */}
                                        <div className="text-center">
                                            <h3 className="text-sm uppercase tracking-widest opacity-70 mb-2">Your Mood Score</h3>
                                            <div className="relative inline-flex items-center justify-center">
                                                <svg className="w-32 h-32 transform -rotate-90">
                                                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-700 opacity-20" />
                                                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent"
                                                        strokeDasharray={352}
                                                        strokeDashoffset={352 - (352 * calculateMoodScore()) / 100}
                                                        className="text-yellow-500 transition-all duration-1000"
                                                    />
                                                </svg>
                                                <span className="absolute text-4xl font-black">{calculateMoodScore()}/100</span>
                                            </div>
                                        </div>

                                        {/* Mental Health Score */}
                                        <div className="bg-gray-900/10 dark:bg-white/5 p-4 rounded-2xl border border-gray-700/30">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-semibold opacity-70">Mental Health Score</span>
                                                <span className="text-2xl font-bold text-indigo-400">{result.mentalScore}/100</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <div className="bg-indigo-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${result.mentalScore}%` }}></div>
                                            </div>
                                        </div>

                                        {/* Lifespan */}
                                        <div className="bg-gray-900/10 dark:bg-white/5 p-4 rounded-2xl border border-gray-700/30">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-semibold opacity-70">Estimated Lifespan</span>
                                                <span className="text-2xl font-bold text-purple-400">{result.lifespan} <span className="text-sm text-gray-500">years</span></span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min(result.lifespan, 100)}%` }}></div>
                                            </div>
                                        </div>

                                        {/* Feedback */}
                                        <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/30">
                                            <h4 className="font-bold text-indigo-400 mb-2">💡 AI Insights</h4>
                                            <p className="italic text-sm leading-relaxed opacity-90 mb-3">"{result.feedback}"</p>
                                            <div className="bg-white/5 rounded-xl p-3">
                                                <h5 className="font-semibold text-xs uppercase tracking-wider opacity-70 mb-2">Suggested Improvements</h5>
                                                <ul className="space-y-1">
                                                    {result.improvements.map((tip, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-xs">
                                                            <span>•</span>
                                                            <span>{tip}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 bg-gray-700/20 flex gap-4">
                            <button
                                onClick={() => setStep(2)}
                                className="flex-1 py-3 rounded-xl font-bold bg-gray-700 hover:bg-gray-600 text-white"
                            >
                                ← Back to Habits
                            </button>
                            <button
                                onClick={() => {
                                    setStep(1);
                                    setResult(null);
                                }}
                                className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white"
                            >
                                Start New Check-In
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;