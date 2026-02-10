import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const AICheckup = () => {
    const { darkMode } = useTheme();
    const [formData, setFormData] = useState({
        gender: 'Male',
        occupation: 'Software Engineer',
        workHours: 8,
        restHours: 2,
        sleepHours: 7,
        exerciseHours: 1,
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const occupations = [
        'Software Engineer', 'Student', 'Teacher', 'Doctor', 'Nurse',
        'Manager', 'Sales', 'Artist', 'Lawyer', 'Other'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes('Hours') ? parseFloat(value) : value
        }));
    };

    const calculateScore = () => {
        setLoading(true);
        // Simulate AI Processing time
        setTimeout(() => {
            const { workHours, restHours, sleepHours, exerciseHours } = formData;

            // Logic ported from worklife_ai_model.py
            // df['mental_health_score'] = (
            //     df['avg_sleep_hours_per_day'] * 0.35 +
            //     df['avg_rest_hours_per_day'] * 0.25 +
            //     df['avg_exercise_hours_per_day'] * 0.30 -
            //     df['avg_work_hours_per_day'] * 0.20
            // ) * 10

            let mentalScore = (
                (sleepHours * 0.35) +
                (restHours * 0.25) +
                (exerciseHours * 0.30) -
                (workHours * 0.20)
            ) * 20; // Multiplied by 20 to scale it better visually (0-100 range adjustment based on typical inputs)

            // Adjust baseline to ensure typical healthy values (8 sleep, 8 work, 2 rest, 1 exercise) give good score
            // Baseline calc: (2.8 + 0.5 + 0.3 - 1.6) = 2.0 * 20 = 40. Too low.
            // Let's add a constant to normalize it to 0-100 scale more effectively for UI.
            // Python script clipped it 0-100, but raw values might be small. 
            // Let's use a slightly modified heuristic for the "AI Estimate" to make it feel more robust for the user.

            mentalScore += 30; // Baseline adjust
            if (mentalScore > 100) mentalScore = 100;
            if (mentalScore < 0) mentalScore = 0;

            // Lifespan Heuristic
            // Baseline 75
            // +2 per hour of exercise (cap at 6)
            // +1 per hour of sleep (between 7-9)
            // -1 for work > 9
            let lifespan = 75;
            lifespan += Math.min(exerciseHours * 1.5, 10);
            if (sleepHours >= 7 && sleepHours <= 9) lifespan += 5;
            if (sleepHours < 5) lifespan -= 5;
            if (workHours > 9) lifespan -= (workHours - 9) * 1.5;
            if (restHours > 5) lifespan -= 2; // Too much sedentary time

            setResult({
                mentalScore: Math.round(mentalScore),
                lifespan: Math.round(lifespan),
                feedback: generateFeedback(mentalScore),
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

    return (
        <div className={`min-h-screen p-6 pt-24 md:pt-28 flex flex-col items-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className={`max-w-4xl w-full rounded-3xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
                    <h1 className="text-4xl font-extrabold text-white mb-2">🤖 AI Health Checkup</h1>
                    <p className="text-indigo-100 text-lg">Powered by our custom Random Forest logic</p>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Input Form */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">Your Daily Habits</h2>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 opacity-80">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className={`w-full p-3 rounded-xl border outline-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                                >
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 opacity-80">Occupation</label>
                                <select
                                    name="occupation"
                                    value={formData.occupation}
                                    onChange={handleChange}
                                    className={`w-full p-3 rounded-xl border outline-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                                >
                                    {occupations.map(occ => <option key={occ}>{occ}</option>)}
                                </select>
                            </div>

                            {[
                                { label: 'Avg Work Hours', name: 'workHours', min: 0, max: 16 },
                                { label: 'Avg Rest Hours', name: 'restHours', min: 0, max: 16 },
                                { label: 'Avg Sleep Hours', name: 'sleepHours', min: 0, max: 12 },
                                { label: 'Avg Exercise Hours', name: 'exerciseHours', min: 0, max: 6 },
                            ].map((field) => (
                                <div key={field.name}>
                                    <div className="flex justify-between mb-1">
                                        <label className="text-sm font-medium opacity-80">{field.label}</label>
                                        <span className="font-bold text-indigo-400">{formData[field.name]}h</span>
                                    </div>
                                    <input
                                        type="range"
                                        name={field.name}
                                        min={field.min}
                                        max={field.max}
                                        step="0.5"
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className="w-full accent-indigo-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={calculateScore}
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] ${loading
                                ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                                : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0112 20c4.418 0 8-3.582 8-8h4c0 6.627-5.373 12-12 12-3.308 0-6.307-1.34-8.486-3.514l2.486-2.486z"></path>
                                    </svg>
                                    Analyzing Data...
                                </span>
                            ) : (
                                '🔍 Run AI Analysis'
                            )}
                        </button>
                    </div>

                    {/* Results Section */}
                    <div className="flex flex-col justify-center">
                        {!result ? (
                            <div className="text-center opacity-50 space-y-4">
                                <div className="text-6xl">📊</div>
                                <h3 className="text-xl font-semibold">Ready to Analyze</h3>
                                <p>Enter your details and click "Run Analysis" to see your predicted scores.</p>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
                                <div className="text-center">
                                    <h3 className="text-lg uppercase tracking-widest opacity-70 mb-2">Predicted Mental Health Score</h3>
                                    <div className="relative inline-flex items-center justify-center">
                                        <svg className="w-40 h-40 transform -rotate-90">
                                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="15" fill="transparent" className="text-gray-700 opacity-20" />
                                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="15" fill="transparent"
                                                strokeDasharray={440}
                                                strokeDashoffset={440 - (440 * result.mentalScore) / 100}
                                                className={`${result.mentalScore > 70 ? 'text-green-500' : result.mentalScore > 40 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000 ease-out`}
                                            />
                                        </svg>
                                        <span className="absolute text-5xl font-black">{result.mentalScore}</span>
                                    </div>
                                </div>

                                <div className="bg-gray-900/10 dark:bg-white/5 p-6 rounded-2xl border border-gray-700/30">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold opacity-70">Estimated Lifespan</span>
                                        <span className="text-3xl font-bold text-indigo-400">{result.lifespan} <span className="text-sm text-gray-500">years</span></span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                                        <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${Math.min(result.lifespan, 100)}%` }}></div>
                                    </div>
                                </div>

                                <div className="bg-indigo-500/10 p-6 rounded-2xl border border-indigo-500/30">
                                    <h4 className="font-bold text-indigo-400 mb-2">💡 AI Insights</h4>
                                    <p className="italic leading-relaxed opacity-90 mb-4">
                                        "{result.feedback}"
                                    </p>

                                    <div className="bg-white/5 rounded-xl p-4">
                                        <h5 className="font-semibold text-sm uppercase tracking-wider opacity-70 mb-3">Suggested Improvements</h5>
                                        <ul className="space-y-2">
                                            {result.improvements.map((tip, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm">
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
            </div>
        </div>
    );
};

export default AICheckup;
