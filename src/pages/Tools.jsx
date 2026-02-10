import React from 'react';
import { useTheme } from '../context/ThemeContext';
import PomodoroTimer from '../components/tools/PomodoroTimer';

const Tools = () => {
    const { darkMode } = useTheme();

    return (
        <div className={`min-h-screen p-6 pt-24 pb-24 md:p-10 md:pt-28 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
            }`}>
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                        <span className="text-yellow-400">Toolkit</span> 🛠️
                    </h1>
                    <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Utilities to boost your productivity.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Tool 1: Pomodoro Timer */}
                    <div className={`p-8 rounded-3xl shadow-2xl ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
                        }`}>
                        <PomodoroTimer />
                    </div>

                    {/* Tool 2: Placeholder / Study Music */}
                    <div className={`p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
                        }`}>
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-6 rounded-full mb-6">
                            <span className="text-5xl">🎧</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-3">Study Music</h2>
                        <p className={`mb-6 max-w-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Curated lo-fi beats and ambient sounds to help you stay focused during your study sessions.
                        </p>
                        <button className="px-6 py-3 rounded-xl bg-purple-500 text-white font-bold shadow-lg hover:bg-purple-600 transition-all transform hover:-translate-y-1 opacity-50 cursor-not-allowed" disabled>
                            Coming Soon
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tools;
