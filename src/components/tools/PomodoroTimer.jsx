import React, { useState, useEffect, useRef } from 'react';

// Timer settings (in minutes)
const TIMER_SETTINGS = {
    FOCUS: 25,
    SHORT_BREAK: 5,
    LONG_BREAK: 15,
};

// Timer states
const TIMER_MODES = {
    FOCUS: 'Focus',
    SHORT_BREAK: 'Short Break',
    LONG_BREAK: 'Long Break',
};

const PomodoroTimer = () => {
    const [mode, setMode] = useState(TIMER_MODES.FOCUS);
    const [isRunning, setIsRunning] = useState(false);
    // Convert minutes to seconds for internal use
    const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS.FOCUS * 60);
    const [pomodoroCount, setPomodoroCount] = useState(0);

    const timerRef = useRef(null);

    // --- Time formatting ---
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    // --- Effect for Timer Logic ---
    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timerRef.current);
                        handleTimerEnd();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }

        // Cleanup on unmount
        return () => clearInterval(timerRef.current);
    }, [isRunning, mode]);


    // --- Handlers ---

    const handleTimerEnd = () => {
        setIsRunning(false);
        // Alert the user (in a real app, play a sound or use desktop notification)
        alert(`Time's up! Starting ${mode === TIMER_MODES.FOCUS ? 'a break' : 'Focus'}.`);

        if (mode === TIMER_MODES.FOCUS) {
            setPomodoroCount(prev => prev + 1);
            if ((pomodoroCount + 1) % 4 === 0) {
                setMode(TIMER_MODES.LONG_BREAK);
                setTimeLeft(TIMER_SETTINGS.LONG_BREAK * 60);
            } else {
                setMode(TIMER_MODES.SHORT_BREAK);
                setTimeLeft(TIMER_SETTINGS.SHORT_BREAK * 60);
            }
        } else {
            // After any break, return to focus mode
            setMode(TIMER_MODES.FOCUS);
            setTimeLeft(TIMER_SETTINGS.FOCUS * 60);
        }
    };

    const toggleTimer = () => {
        setIsRunning(prev => !prev);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(TIMER_SETTINGS.FOCUS * 60);
        setMode(TIMER_MODES.FOCUS);
        setPomodoroCount(0);
    };

    const switchMode = (newMode) => {
        setIsRunning(false);
        setMode(newMode);
        setTimeLeft(TIMER_SETTINGS[newMode.split(' ').join('_').toUpperCase()] * 60);
    };

    // Determine dynamic colors for the UI based on mode
    const isFocus = mode === TIMER_MODES.FOCUS;
    const isBreak = mode !== TIMER_MODES.FOCUS;

    return (
        <div className="text-center font-sans">
            <h2 className="text-2xl font-bold mb-4">⏱️ Pomodoro Timer</h2>
            <p className="text-gray-500 mb-6 dark:text-gray-400">
                {isFocus ? "Time to focus and crush those tasks!" : "Great work! Time for a well-deserved break."}
            </p>

            <div className={`p-6 rounded-2xl shadow-xl border backdrop-blur-sm transition-all duration-300 w-full max-w-md mx-auto
                ${isBreak
                    ? 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800'
                    : 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700'
                }`}
            >

                {/* Mode Selector Buttons */}
                <div className="flex justify-center flex-wrap gap-2 mb-8">
                    {Object.values(TIMER_MODES).map((m) => (
                        <button
                            key={m}
                            onClick={() => switchMode(m)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${m === mode
                                    ? 'bg-yellow-400 text-gray-900 shadow-md transform scale-105'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>

                {/* Timer Display */}
                <div className="my-8">
                    <p className="text-lg font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest text-xs mb-2">{mode}</p>
                    <div
                        className={`text-8xl font-black tabular-nums transition-colors duration-500`}
                        style={{ color: isFocus ? '#fbbf24' : '#60a5fa' }} // yellow-400 : blue-400
                    >
                        {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4 mt-8">
                    <button
                        onClick={toggleTimer}
                        className={`w-32 py-3 rounded-xl font-bold text-lg shadow-lg transition-transform transform active:scale-95 ${isRunning
                                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                                : 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
                            }`}
                    >
                        {isRunning ? 'Pause' : (timeLeft === 0 ? 'Start Next' : 'Start')}
                    </button>
                    <button
                        onClick={resetTimer}
                        className="w-32 py-3 rounded-xl font-bold text-lg border-2 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        Reset
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Completed Pomodoros: <span className="font-bold text-yellow-500 text-lg ml-1">{pomodoroCount}</span>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default PomodoroTimer;
