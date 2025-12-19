import React, { useState } from "react";
import { Mail, ArrowLeft, Check, AlertCircle } from "lucide-react";
import { Link } from "react-router";
import { usePasswordReset } from "../hooks/usePasswordReset";

const ForgetPassword = () => {	
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState("");
	const { requestPasswordReset, loading } = usePasswordReset();
	// const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!email) {
			setError("Please enter your email address");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError("Please enter a valid email address");
			return;
		}

		const result = await requestPasswordReset(email);
		if (result.success) {
			setIsSubmitted(true);
		}
	};
}

	// const handleBackToLogin = () => {
	// 	navigate("/signup");
	// };

	if (isSubmitted) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
				{/* Animated background elements */}
				<div className="absolute inset-0">
					<div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
					<div className="absolute bottom-32 right-32 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
				</div>

				<div className="relative z-10 max-w-md w-full mx-auto px-6">
					<div className="backdrop-blur-sm bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl text-center">
						{/* Success Icon */}
						<div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center animate-bounce">
							<Check className="w-10 h-10 text-white" />
						</div>

						<h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
							Check Your Email!
						</h1>

						<p className="text-gray-300 mb-2">
							We've sent a password reset link to:
						</p>
						<p className="text-cyan-400 font-semibold mb-6 break-all">
							{email}
						</p>

						<div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl p-4 mb-6 border border-blue-400/20">
							<p className="text-sm text-gray-300">
								Didn't receive the email? Check your spam folder or click resend
								below.
							</p>
						</div>

						<div className="space-y-4">
							<button
								onClick={handleSubmit}
								disabled={loading}
								className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-semibold text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? "Sending..." : "Resend Email"}
							</button>

							<Link
								to="/signup"
								className="w-full py-3 bg-white/10 rounded-xl font-semibold text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
							>
								<ArrowLeft className="w-4 h-4" />
								<span>Back to Login</span>
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
			{/* Animated background elements */}
			<div className="absolute inset-0">
				<div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute bottom-32 right-32 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
			</div>

			{/* Floating particles */}
			<div className="absolute inset-0 pointer-events-none">
				{[...Array(15)].map((_, i) => (
					<div
						key={i}
						className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-30 animate-pulse"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 3}s`,
							animationDuration: `${2 + Math.random() * 3}s`,
						}}
					/>
				))}
			</div>

			<div className="relative z-10 max-w-md w-full mx-auto px-6">
				<div className="backdrop-blur-sm bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl">
					{/* Header */}
					<div className="text-center mb-8">
						<div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center">
							<Mail className="w-8 h-8 text-white" />
						</div>
						<h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
							Forgot Password?
						</h1>
						<p className="text-gray-300">
							No worries! Enter your email and we'll send you a reset link.
						</p>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-300 mb-2"
							>
								Email Address
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
								<input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Enter your email"
									className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
								/>
							</div>
						</div>

						{error && (
							<div className="flex items-center space-x-2 text-red-400 bg-red-500/20 rounded-lg p-3 border border-red-400/20">
								<AlertCircle className="w-5 h-5" />
								<span className="text-sm">{error}</span>
							</div>
						)}

						<button
							onClick={handleSubmit}
							disabled={loading}
							className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
						>
							{loading ? (
								<>
									<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
									<span>Sending...</span>
								</>
							) : (
								<span>Send Reset Link</span>
							)}
						</button>
					</form>

					{/* Back to login */}
					<div className="mt-6 text-center">
						<Link
							to="/signup"
							className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 flex items-center justify-center space-x-2 mx-auto group"
						>
							<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
							<span>Back to Login</span>
						</Link>
					</div>

					{/* Additional info */}
					<div className="mt-8 p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-400/20">
						<p className="text-sm text-gray-300 text-center">
							<span className="text-cyan-400 font-semibold">💡 Tip:</span> Make
							sure to check your spam folder if you don't see the email in your
							inbox.
						</p>
					</div>
				</div>

				{/* Footer branding */}
				<div className="text-center mt-8">
					<p className="text-gray-500 text-sm">
						Powered by{" "}
						<span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-bold">
							Hisabee
						</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default ForgetPassword;
