import React, { useState } from 'react';
// Import all necessary pages and components
import Navbar from './components/Navbar.jsx'; 
// NOTE: The Sidebar component is no longer imported or used for the top navigation layout.

// Import actual pages
import Dashboard from './pages/Dashboard.jsx';
import Habits from './pages/Habits.jsx'; 

// Placeholder Components for routing
const DailyLog = () => <div className="content"><h1 className="dashboard-main-title">Daily Log Page</h1><p className='text-secondary'>Daily Log Form goes here.</p></div>;
const Reminders = () => <div className="content"><h1 className="dashboard-main-title">Reminders Page</h1><p className='text-secondary'>Reminders List goes here.</p></div>;
const PomodoroTimer = () => <div className="content"><h1 className="dashboard-main-title">Pomodoro Timer Page</h1><p className='text-secondary'>Timer controls go here.</p></div>;
const Analytics = () => <div className="content"><h1 className="dashboard-main-title">Analytics Page</h1><p className='text-secondary'>Charts and reports go here.</p></div>;


const App = () => {
  // Initialize with 'Dashboard'
  const [currentPage, setCurrentPage] = useState('Dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        // The Dashboard page expects a setPage prop to navigate to the DailyLog
        return <Dashboard setPage={setCurrentPage} />;
      case 'DailyLog':
        return <DailyLog />;
      case 'Habits':
        return <Habits />;
      case 'Reminders':
        return <Reminders />;
      case 'PomodoroTimer':
        return <PomodoroTimer />;
      case 'Analytics':
        return <Analytics />;
      default:
        return <Dashboard setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-color-dark-bg">
      {/* Navbar component (sticky header with all navigation links) */}
      <Navbar currentPage={currentPage} setPage={setCurrentPage} />
      
      {/* Main Content Area */}
      <div className="app-container">
          {/* The 'content' div inside the app-container handles max-width and centering */}
          {renderPage()}
      </div>
    </div>
  );
};

export default App;
