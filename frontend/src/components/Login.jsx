import { Link } from 'react-router';
import { IoIosArrowBack } from 'react-icons/io';
import { useLoginForm } from '../hooks/useLoginForm';

const Login = () => {
  const {
    email,
    password,
    showPassword,
    loading,
    error,
    setEmail,
    setPassword,
    setShowPassword,
    handleSubmit,
  } = useLoginForm();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-[#161616] p-4 text-white relative">
      <Link to="/home">
        <IoIosArrowBack className="absolute top-3 left-2" size={30} />
      </Link>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#2a2a2a] rounded-lg shadow-md p-6"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 border-l-4 border-red-500 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            autoComplete="email"
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 pl-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2 pl-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
              title="Toggle Password Visibility"
            >
              {showPassword ? '🙈' : '👁️'}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-2 rounded-md transition-colors"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
