import React, { useState } from 'react';
import { useLogContext } from '../context/LogContext';

const Habits = () => {
  const { userHabits, userLogs, addHabit, toggleHabit } = useLogContext();
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' or 'manage'
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todaysLog = userLogs.find(l => l.date === today);
  const completedHabits = todaysLog?.completed_habits || [];

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await addHabit(name, frequency);
      setName('');
      setFrequency('Daily');
    } catch (err) {
      console.error('Error adding habit:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 pt-24 md:pt-28 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Habits & Daily Log</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b border-gray-700 pb-1">
        <button
          onClick={() => setActiveTab('daily')}
          className={`pb-2 px-4 font-semibold text-lg transition-colors ${activeTab === 'daily'
            ? 'border-b-2 border-yellow-400 text-yellow-400'
            : 'text-gray-400 hover:text-gray-200'
            }`}
        >
          ✅ Daily Check-in
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`pb-2 px-4 font-semibold text-lg transition-colors ${activeTab === 'manage'
            ? 'border-b-2 border-yellow-400 text-yellow-400'
            : 'text-gray-400 hover:text-gray-200'
            }`}
        >
          ⚙️ Manage Habits
        </button>
      </div>

      {/* Tab Content */}
      <div className="habit-content">
        {activeTab === 'daily' && (
          <div className="space-y-4">
            {userHabits.length === 0 ? (
              <div className="text-center p-8 bg-gray-800 rounded-xl">
                <p className="text-gray-400">No habits found. Go to "Manage Habits" to create one!</p>
              </div>
            ) : (
              userHabits.map(habit => {
                const isCompleted = completedHabits.includes(habit.id);
                return (
                  <div key={habit.id} className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <div>
                      <h3 className={`font-semibold text-lg ${isCompleted ? 'line-through text-gray-500' : 'text-gray-100'}`}>
                        {habit.name}
                      </h3>
                      <p className="text-sm text-gray-400">{habit.target_frequency}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleHabit(habit.id, today);
                      }}
                      className={`px-4 py-2 rounded-lg font-bold transition-all ${isCompleted
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600'
                        }`}
                    >
                      {isCompleted ? 'Completed' : 'Mark Done'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <form onSubmit={handleAddHabit} className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">Create New Habit</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Habit name (e.g. Drink Water)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-yellow-400 outline-none md:col-span-2"
                  required
                />
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-yellow-400 outline-none"
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <button
                type="submit"
                className="mt-4 w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-300 transition-colors"
                disabled={loading}
              >
                {loading ? 'Adding...' : '+ Add Habit'}
              </button>
            </form>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Your Habits</h3>
              {userHabits.map((habit) => (
                <div key={habit.id} className="flex justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <span>{habit.name}</span>
                  <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">{habit.target_frequency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Habits;
