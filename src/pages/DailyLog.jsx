import React, { useState } from 'react';

const LOG_STEPS = {
  MOOD_NOTES: 1,
  HABIT_CHECK: 2,
  COMPLETE: 3,
};

const DailyCheckIn = () => {
  const [step, setStep] = useState(LOG_STEPS.MOOD_NOTES);
  const [logData, setLogData] = useState({
    mood: 6,
    energy: 6,
    notes: '',
    habitsCompleted: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock habits data
  const mockHabits = [
    { id: 1, name: 'Morning Exercise', category: 'Wellness' },
    { id: 2, name: 'Drink Water (8 cups)', category: 'Health' },
    { id: 3, name: 'Read for 30 mins', category: 'Learning' },
    { id: 4, name: 'Meditate (10 mins)', category: 'Wellness' },
    { id: 5, name: 'Review Tomorrow\'s Schedule', category: 'Productivity' },
    { id: 6, name: 'Cook Dinner', category: 'Home' },
  ];

  const handleLogChange = (e) => {
    const { name, value } = e.target;
    setLogData((prev) => ({
      ...prev,
      [name]: name === 'mood' || name === 'energy' ? Number(value) : value,
    }));
  };

  const handleHabitToggle = (habitId) => {
    setLogData((prev) => ({
      ...prev,
      habitsCompleted: {
        ...prev.habitsCompleted,
        [habitId]: !prev.habitsCompleted[habitId],
      },
    }));
  };

  const handleStepNext = () => {
    if (step < LOG_STEPS.HABIT_CHECK) {
      setStep((prev) => prev + 1);
    } else if (step === LOG_STEPS.HABIT_CHECK) {
      handleLogSubmit();
    }
  };

  const handleStepBack = () => {
    if (step > LOG_STEPS.MOOD_NOTES) {
      setStep((prev) => prev - 1);
    }
  };

  const handleLogSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500)); 
    setIsSubmitting(false);
    setStep(LOG_STEPS.COMPLETE);
  };

  const getCurrentStepTitle = () => {
    switch (step) {
      case LOG_STEPS.MOOD_NOTES:
        return 'Mood & Reflection';
      case LOG_STEPS.HABIT_CHECK:
        return 'Habit Check-in';
      default:
        return 'Log Complete';
    }
  };

  const Stepper = ({ currentStep }) => {
    const steps = [
      { id: 1, name: 'Mood & Notes', emoji: '✍️' },
      { id: 2, name: 'Habit Check-in', emoji: '✅' },
      { id: 3, name: 'Complete', emoji: '✨' },
    ];

    const progressWidth = ((currentStep - 1) / (steps.length - 1)) * 100;

    return (
      <div className="flex justify-between items-start w-full mb-12 relative">
        <div className="absolute top-1/2 -mt-0.5 h-1 bg-slate-700 w-full rounded-full mx-auto" style={{maxWidth: 'calc(100% - 6rem)'}}>
          <div 
            className="h-full bg-yellow-400 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>
        
        {steps.map((s) => {
          const isActive = s.id === currentStep;
          const isCompleted = s.id < currentStep;

          return (
            <div key={s.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 transition-all duration-300 shadow-md ${
                  isCompleted
                    ? 'bg-yellow-400 border-yellow-400 text-slate-900'
                    : isActive
                    ? 'bg-slate-900 border-yellow-400 text-yellow-400 shadow-yellow-500/30'
                    : 'bg-slate-700 border-slate-700 text-gray-400'
                }`}
              >
                {isCompleted ? '✓' : s.emoji}
              </div>
              <p className={`mt-2 text-sm font-medium transition-colors ${
                isActive ? 'text-yellow-400' : 'text-gray-400'
              } hidden sm:block`}>
                {s.name}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMoodNotes = () => (
    <div className="space-y-8 p-4">
      <div className="bg-slate-800/70 p-6 rounded-xl border border-slate-700 shadow-lg">
        <label className="text-lg font-semibold text-gray-200 mb-4 flex items-center justify-between">
          <span>Current Mood (1=Worst, 10=Best)</span>
          <span className="text-3xl font-extrabold text-yellow-400 tracking-wider">
            {logData.mood}
          </span>
        </label>
        <div className="flex justify-between text-gray-500 text-sm mb-2">
          <span>😟 Low</span>
          <span>😄 High</span>
        </div>
        <input
          type="range"
          name="mood"
          min="1"
          max="10"
          value={logData.mood}
          onChange={handleLogChange}
          className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-400 [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-lg"
        />
      </div>

      <div className="bg-slate-800/70 p-6 rounded-xl border border-slate-700 shadow-lg">
        <label className="text-lg font-semibold text-gray-200 mb-4 flex items-center justify-between">
          <span>Energy Level (1=Drained, 10=Vibrant)</span>
          <span className="text-3xl font-extrabold text-yellow-400 tracking-wider">
            {logData.energy}
          </span>
        </label>
        <div className="flex justify-between text-gray-500 text-sm mb-2">
          <span>😴 Low</span>
          <span>⚡ High</span>
        </div>
        <input
          type="range"
          name="energy"
          min="1"
          max="10"
          value={logData.energy}
          onChange={handleLogChange}
          className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-400 [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-lg"
        />
      </div>

      <div>
        <label className="text-lg font-semibold text-gray-200 mb-3 block">
          Daily Reflection: What went well, and what could be improved?
        </label>
        <textarea
          name="notes"
          value={logData.notes}
          onChange={handleLogChange}
          placeholder="E.g., Finished the complex report. Found 30 mins for reading..."
          rows="5"
          className="w-full px-5 py-4 rounded-xl bg-slate-900/50 border border-slate-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition"
        />
      </div>
    </div>
  );

  const renderHabitCheck = () => (
    <div className="grid grid-cols-1 gap-4 p-4">
      {mockHabits.map((habit) => {
        const isCompleted = !!logData.habitsCompleted[habit.id];
        return (
          <div
            key={habit.id}
            onClick={() => handleHabitToggle(habit.id)}
            className={`flex flex-col p-5 rounded-xl cursor-pointer transition duration-200 ease-in-out shadow-lg 
              ${isCompleted 
                ? 'bg-yellow-400/10 border-l-4 border-yellow-500 text-gray-100 transform scale-[1.005] hover:bg-yellow-400/20'
                : 'bg-slate-800/70 border-l-4 border-slate-700 text-gray-300 hover:bg-slate-700/60'
              }`
            }
          >
            <div className="flex justify-between items-center mb-2">
              <span className={`text-xl font-bold ${isCompleted ? 'text-yellow-400' : 'text-gray-400'}`}>
                {isCompleted ? '✅' : '⚪'}
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500/80">
                {habit.category}
              </span>
            </div>
            <p className={`text-lg font-medium ${isCompleted ? 'line-through opacity-70' : ''}`}>
              {habit.name}
            </p>
          </div>
        );
      })}
    </div>
  );

  const renderComplete = () => (
    <div className="text-center py-12 px-4">
      <h2 className="text-6xl mb-4">🎉</h2>
      <h3 className="text-3xl font-bold text-yellow-400 mb-2">Log Successfully Recorded!</h3>
      <p className="text-gray-400 mb-8 max-w-lg mx-auto">
        Great job reflecting on your progress today. Your insights are now stored in your personalized analytics.
      </p>
      
      <div className="bg-slate-800/70 rounded-xl p-8 mb-10 shadow-xl border border-slate-700/80 max-w-sm mx-auto">
        <h4 className="text-xl font-semibold text-gray-100 mb-4 border-b border-slate-700 pb-2">Day Summary</h4>
        <div className="space-y-3 text-left">
          <p className="text-gray-300 flex justify-between">
            <span className="font-semibold text-gray-200">Mood Rating:</span>
            <span className="text-yellow-400 font-bold">{logData.mood}/10</span>
          </p>
          <p className="text-gray-300 flex justify-between">
            <span className="font-semibold text-gray-200">Energy Level:</span>
            <span className="text-yellow-400 font-bold">{logData.energy}/10</span>
          </p>
          <p className="text-gray-300 flex justify-between">
            <span className="font-semibold text-gray-200">Habits Crushed:</span>
            <span className="text-yellow-400 font-bold">
              {Object.values(logData.habitsCompleted).filter(Boolean).length} / {mockHabits.length}
            </span>
          </p>
          {logData.notes && (
            <p className="pt-3 border-t border-slate-700 text-sm italic text-gray-400">
              "{logData.notes.substring(0, 70)}{logData.notes.length > 70 ? '...' : ''}"
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="px-8 py-3 bg-slate-700 text-gray-100 rounded-xl font-medium hover:bg-slate-600 transition shadow-md hover:shadow-lg">
          View Analytics
        </button>
        <button
          onClick={() => {
            setStep(LOG_STEPS.MOOD_NOTES);
            setLogData({ mood: 6, energy: 6, notes: '', habitsCompleted: {} });
          }}
          className="px-8 py-3 bg-yellow-400 text-slate-900 rounded-xl font-bold hover:bg-yellow-300 transition shadow-lg shadow-yellow-500/30"
        >
          Start New Log
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 font-[Inter]">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pt-24">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-gray-100 mb-2">Daily Check-in</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Log your mood, energy, reflections, and check off your habits for the day.
          </p>
        </div>
        
        {step !== LOG_STEPS.COMPLETE && (
          <div className="relative flex justify-center pb-12">
            <Stepper currentStep={step} />
          </div>
        )}

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-10 shadow-2xl shadow-slate-900/50">
          <div className={`mb-8 ${step === LOG_STEPS.COMPLETE ? 'hidden' : ''}`}>
            <h2 className="text-3xl font-bold text-yellow-400 mb-1">
              {step}. {getCurrentStepTitle()}
            </h2>
            <p className="text-gray-500 text-sm">
              {step === LOG_STEPS.MOOD_NOTES ? 'Rate your well-being and capture key moments.' : 'A quick tally of your consistency today.'}
            </p>
          </div>

          {step === LOG_STEPS.MOOD_NOTES && renderMoodNotes()}
          {step === LOG_STEPS.HABIT_CHECK && renderHabitCheck()}
          {step === LOG_STEPS.COMPLETE && renderComplete()}

          {step !== LOG_STEPS.COMPLETE && (
            <div className="flex flex-col sm:flex-row gap-4 justify-between mt-10 p-4 pt-0 sm:pt-4 sm:p-0">
              <button
                onClick={handleStepBack}
                disabled={step === 1 || isSubmitting}
                className="px-6 py-3 bg-slate-700 text-gray-100 rounded-xl font-medium hover:bg-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md w-full sm:w-auto"
              >
                ← Back
              </button>

              <button
                onClick={handleStepNext}
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-xl font-bold transition shadow-lg w-full sm:w-auto
                  ${isSubmitting
                    ? 'bg-yellow-600 text-white animate-pulse'
                    : 'bg-yellow-400 text-slate-900 hover:bg-yellow-300 shadow-yellow-500/30'
                  }`
                }
              >
                {step === LOG_STEPS.HABIT_CHECK
                  ? isSubmitting
                    ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving Log...
                      </div>
                    )
                    : 'Finish & Submit Log'
                  : 'Next Step →'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DailyCheckIn;