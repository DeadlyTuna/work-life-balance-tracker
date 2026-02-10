import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const LogContext = createContext();
export const useLogContext = () => useContext(LogContext);

// Helper functions for localStorage
const getStorageKey = (userId, type) => `worklife_${userId}_${type}`;

const loadFromStorage = (userId, type) => {
  try {
    const data = localStorage.getItem(getStorageKey(userId, type));
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error loading ${type}:`, error);
    return [];
  }
};

const saveToStorage = (userId, type, data) => {
  try {
    localStorage.setItem(getStorageKey(userId, type), JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${type}:`, error);
  }
};

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const LogProvider = ({ children }) => {
  const { user } = useAuth();
  const [userLogs, setUserLogs] = useState([]);
  const [userHabits, setUserHabits] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isLogsLoading, setIsLogsLoading] = useState(true);
  const [isHabitsLoading, setIsHabitsLoading] = useState(true);

  // Load data when user changes
  useEffect(() => {
    if (!user?.id) {
      setUserLogs([]);
      setUserHabits([]);
      setCalendarEvents([]);
      setIsLogsLoading(false);
      setIsHabitsLoading(false);
      return;
    }

    setIsLogsLoading(true);
    setIsHabitsLoading(true);

    // Load all data from localStorage
    const habits = loadFromStorage(user.id, 'habits');
    const logs = loadFromStorage(user.id, 'logs');
    const completions = loadFromStorage(user.id, 'completions');
    const events = loadFromStorage(user.id, 'events');

    setUserHabits(habits);

    // Merge logs with completions
    const mergedLogsMap = {};

    logs.forEach(log => {
      mergedLogsMap[log.date] = {
        ...log,
        completed_habits: []
      };
    });

    completions.forEach(c => {
      const date = c.completion_date;
      if (!mergedLogsMap[date]) {
        mergedLogsMap[date] = {
          user_id: user.id,
          date: date,
          mood_score: null,
          reflection: '',
          completed_habits: []
        };
      }
      mergedLogsMap[date].completed_habits.push(c.habit_id);
    });

    const mergedLogsArray = Object.values(mergedLogsMap).sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );
    setUserLogs(mergedLogsArray);

    // Process events (convert string dates back to Date objects)
    const formattedEvents = events.map(e => ({
      ...e,
      start: new Date(e.start),
      end: new Date(e.end)
    }));
    setCalendarEvents(formattedEvents);

    setIsLogsLoading(false);
    setIsHabitsLoading(false);
  }, [user]);

  // --- Actions ---

  const addHabit = async (name, frequency) => {
    if (!user?.id) return;

    const newHabit = {
      id: generateId(),
      user_id: user.id,
      name,
      frequency,
      created_at: new Date().toISOString()
    };

    const updatedHabits = [...userHabits, newHabit];
    setUserHabits(updatedHabits);
    saveToStorage(user.id, 'habits', updatedHabits);
  };

  const addLog = async (logData) => {
    if (!user?.id) return;

    const logs = loadFromStorage(user.id, 'logs');
    const existingIndex = logs.findIndex(l => l.date === logData.date);

    if (existingIndex >= 0) {
      // Update existing log
      logs[existingIndex] = {
        ...logs[existingIndex],
        mood_score: logData.mood_score,
        reflection: logData.reflection
      };
    } else {
      // Add new log
      logs.push({
        id: generateId(),
        user_id: user.id,
        date: logData.date,
        mood_score: logData.mood_score,
        reflection: logData.reflection,
        created_at: new Date().toISOString()
      });
    }

    saveToStorage(user.id, 'logs', logs);

    // Optimistic update
    setUserLogs(prev => {
      const index = prev.findIndex(l => l.date === logData.date);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = { ...updated[index], ...logData };
        return updated;
      } else {
        return [{ ...logData, completed_habits: [], user_id: user.id }, ...prev];
      }
    });
  };

  const toggleHabit = async (habitId, date) => {
    if (!user?.id) return;

    const completions = loadFromStorage(user.id, 'completions');
    const existingIndex = completions.findIndex(
      c => c.habit_id === habitId && c.completion_date === date
    );

    if (existingIndex >= 0) {
      // Remove completion
      completions.splice(existingIndex, 1);
    } else {
      // Add completion
      completions.push({
        id: generateId(),
        user_id: user.id,
        habit_id: habitId,
        completion_date: date,
        created_at: new Date().toISOString()
      });
    }

    saveToStorage(user.id, 'completions', completions);

    // Optimistic update
    setUserLogs(prev => {
      const arr = [...prev];
      const index = arr.findIndex(l => l.date === date);
      if (index >= 0) {
        const log = arr[index];
        const completed = log.completed_habits || [];
        if (completed.includes(habitId)) {
          log.completed_habits = completed.filter(id => id !== habitId);
        } else {
          log.completed_habits = [...completed, habitId];
        }
      } else {
        arr.push({
          date,
          user_id: user.id,
          completed_habits: [habitId],
          mood_score: null,
          reflection: ''
        });
      }
      return arr;
    });
  };

  const addEvent = async (event) => {
    if (!user?.id) return;

    const newEvent = {
      id: generateId(),
      user_id: user.id,
      title: event.title,
      start: event.start,
      end: event.end,
      type: event.type,
      created_at: new Date().toISOString()
    };

    const updatedEvents = [...calendarEvents, newEvent];
    setCalendarEvents(updatedEvents);

    // Save to localStorage (convert dates to strings)
    const eventsToSave = updatedEvents.map(e => ({
      ...e,
      start: e.start.toISOString(),
      end: e.end.toISOString()
    }));
    saveToStorage(user.id, 'events', eventsToSave);
  };

  const updateEvent = async (updatedEvent) => {
    if (!user?.id) return;

    const updatedEvents = calendarEvents.map(e =>
      e.id === updatedEvent.id ? updatedEvent : e
    );
    setCalendarEvents(updatedEvents);

    // Save to localStorage
    const eventsToSave = updatedEvents.map(e => ({
      ...e,
      start: e.start.toISOString(),
      end: e.end.toISOString()
    }));
    saveToStorage(user.id, 'events', eventsToSave);
  };

  return (
    <LogContext.Provider value={{
      userLogs,
      userHabits,
      calendarEvents,
      isLogsLoading,
      isHabitsLoading,
      addHabit,
      addLog,
      addEvent,
      updateEvent,
      toggleHabit
    }}>
      {children}
    </LogContext.Provider>
  );
};
