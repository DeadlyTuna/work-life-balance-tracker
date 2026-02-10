import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login, user, loading } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loadingAuth, setLoadingAuth] = React.useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoadingAuth(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAuth(false);
    }
  };

  React.useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-yellow-400">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4
      ${darkMode
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300'}`}
    >
      <div className={`w-full max-w-md rounded-3xl p-10 shadow-2xl text-center backdrop-blur-md border border-white/10
        ${darkMode
          ? 'bg-gray-800/70 text-yellow-400'
          : 'bg-white/70 text-gray-900'}`}
      >
        <div className="mb-8">
          <span className="text-6xl">⚖️</span>
        </div>

        <h1 className="text-4xl font-extrabold mb-4">
          Welcome to Libra
        </h1>
        <p className="text-gray-400 mb-10 text-lg">
          Your personal sanctuary for balance and growth.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className={`w-full p-3 rounded-xl border outline-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-yellow-400' : 'bg-gray-50 border-gray-300 focus:border-yellow-500'
              }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={`w-full p-3 rounded-xl border outline-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-yellow-400' : 'bg-gray-50 border-gray-300 focus:border-yellow-500'
              }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loadingAuth}
            className={`w-full py-3 rounded-xl font-bold shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${darkMode
              ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
              : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
          >
            {loadingAuth ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-sm">
          Don't have an account?{' '}
          <a href="/signup" className="text-yellow-400 font-bold hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
