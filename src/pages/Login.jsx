import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HiMail, HiLockClosed, HiShieldCheck } from 'react-icons/hi';
import NavybitsText from '../components/NavybitsText';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center auth-background">
      <div className="auth-glow" />
      
      <div className="max-w-md w-full mx-4">
        <div className="auth-form rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome back
            </h2>
            <p className="text-gray-400">
              Sign in to continue to your account
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 text-red-400 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="auth-input-group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input block w-full pl-10 pr-3 py-2 rounded-lg text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiLockClosed className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input block w-full pl-10 pr-3 py-2 rounded-lg text-sm"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-button w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                'Sign in'
              )}
            </button>

            <div className="text-sm text-center">
              <Link 
                to="/register" 
                className="font-medium text-[#4fd1c5] hover:text-[#4299e1] transition-colors duration-200"
              >
                Don't have an account? Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
      
      <NavybitsText />
    </div>
  );
};

export default Login;