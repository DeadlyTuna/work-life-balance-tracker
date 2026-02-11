import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import ProfileSettings from "./pages/ProfileSettings";
import Tools from "./pages/Tools";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Timetable from "./pages/Timetable";
import Navbar from "./components/layouts/Navbar";
import AICheckup from "./pages/AICheckup";
import Analytics from "./pages/Analytics";
import { LogProvider } from "./context/LogContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <LogProvider>
        <ThemeProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/habits" element={<PrivateRoute><Habits /></PrivateRoute>} />
              <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><ProfileSettings /></PrivateRoute>} />
              <Route path="/tools" element={<PrivateRoute><Tools /></PrivateRoute>} />
              <Route path="/ai-checkup" element={<PrivateRoute><AICheckup /></PrivateRoute>} />
              <Route path="/timetable" element={<PrivateRoute><Timetable /></PrivateRoute>} />
              <Route path="*" element={<div className="p-6 text-center">404 - Page Not Found</div>} />
            </Routes>
          </Router>
        </ThemeProvider>
      </LogProvider>
    </AuthProvider>
  );
}

export default App;
