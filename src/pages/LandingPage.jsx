import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const LandingPage = () => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-yellow-400"
          : "bg-gradient-to-br from-gray-50 via-gray-100 to-white text-gray-900"
      } transition-colors duration-500`}
    >
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center flex-grow text-center px-6 py-20">
        <h1
          className={`text-5xl sm:text-7xl font-extrabold mb-6 ${
            darkMode
              ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500"
              : "text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-400"
          }`}
        >
          Balance Your Work & Life
        </h1>

        <p
          className={`max-w-2xl mx-auto text-lg sm:text-xl mb-10 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          WLBA helps you stay organized, mindful, and productive.  
          Track habits, manage your time, and reflect daily — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className={`px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 ${
              darkMode
                ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                : "bg-gray-900 text-yellow-400 hover:bg-gray-800"
            }`}
          >
            Get Started
          </Link>

          <a
            href="#features"
            className={`px-8 py-4 text-lg font-semibold rounded-xl border ${
              darkMode
                ? "border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900"
                : "border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-yellow-400"
            } transition-all transform hover:scale-105`}
          >
            Learn More
          </a>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12">
          Why Choose WLBA?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              icon: "🧘‍♀️",
              title: "Daily Reflection",
              desc: "Take a few moments to reflect, realign, and reset your focus every day.",
            },
            {
              icon: "🎯",
              title: "Habit Tracking",
              desc: "Build routines that stick with personalized progress tracking.",
            },
            {
              icon: "⏰",
              title: "Pomodoro Timer",
              desc: "Stay productive with built-in focus timers and reminders.",
            },
          ].map((f, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-8 shadow-xl backdrop-blur-sm transition transform hover:-translate-y-1 hover:shadow-2xl ${
                darkMode
                  ? "bg-gray-800/70 border border-yellow-400/30"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`py-8 text-center text-sm ${
          darkMode ? "text-gray-500" : "text-gray-600"
        }`}
      >
        <p>
          © {new Date().getFullYear()} WLBA — Work Life Balance App. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
