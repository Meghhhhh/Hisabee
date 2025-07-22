import { Link } from "react-router";
import { IoIosArrowBack } from "react-icons/io";
import { useLoginForm } from "../hooks/useLoginForm";

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
        <div className="min-h-screen px-4 py-12 bg-black text-white relative overflow-hidden flex items-center justify-center">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-500/20 to-green-400/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-32 right-20 w-72 h-72 bg-gradient-to-r from-green-400/20 to-cyan-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
            </div>

            {/* Floating green particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full opacity-20 animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>

            {/* Back button */}
            <Link to="/home">
                <IoIosArrowBack
                    size={26}
                    className="absolute top-4 left-4 z-50 backdrop-blur-sm bg-emerald-500/10 rounded-full p-1.5 border border-emerald-400/20 hover:bg-emerald-500/20 transition-all"
                />
            </Link>

            {/* Glassmorphic login card */}
            <form
                onSubmit={handleSubmit}
                className="relative z-10 w-full max-w-md backdrop-blur-sm bg-white/5 rounded-2xl px-8 py-8 border border-white/10 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                    <p className="text-gray-300">
                        Sign in to manage your trip expenses
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 rounded-lg border-l-4 border-red-400 text-white">
                        {error}
                    </div>
                )}

                {/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-emerald-200 mb-1">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-black/40 rounded-lg border border-emerald-400/30 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
                        placeholder="you@example.com"
                    />
                </div>

                {/* Password */}
                <div className="mb-8">
                    <label htmlFor="password" className="block text-sm font-medium text-emerald-200 mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 pr-10 bg-black/40 rounded-lg border border-emerald-400/30 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center text-emerald-400 hover:text-green-300 transition"
                            onClick={() => setShowPassword(!showPassword)}
                            title="Toggle Password Visibility"
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full font-semibold text-white hover:from-emerald-600 hover:to-green-600 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Signing in..." : "Sign In"}
                </button>

                {/* Links */}
                <div className="mt-6 text-center text-sm text-gray-300">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-emerald-400 hover:underline">
                        Sign up
                    </Link>
                </div>
                <div className="mt-2 text-center text-sm text-gray-300">
                    Forgot your password?{" "}
                    <Link to="/forgetpassword" className="text-emerald-400 hover:underline">
                        Reset it here
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
