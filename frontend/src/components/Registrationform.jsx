import { Link } from "react-router";
import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import useFormHandler from "../hooks/useFormHandler";
import useRegisterUser from "../hooks/useRegister";

const Registration = () => {
	const { register, loading } = useRegisterUser();
	const [showPassword, setShowPassword] = useState(false);
	const { formData, handleChange, errors, validateForm } = useFormHandler(
		{
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		(data) => {
			const errs = {};
			if (!data.firstName.trim()) errs.firstName = "First name is required";
			if (!data.lastName.trim()) errs.lastName = "Last name is required";
			if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
				errs.email = "Invalid email";
			if (!data.password || data.password.length < 6)
				errs.password = "Min 6 characters";
			if (data.password !== data.confirmPassword)
				errs.confirmPassword = "Passwords do not match";
			return errs;
		}
	);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) register(formData);
	};

	return (
		<div className="min-h-screen px-4 py-12 bg-black text-white relative overflow-hidden flex items-center justify-center">
			{/* Animated background */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-500/20 to-green-400/20 rounded-full blur-2xl animate-pulse" />
				<div className="absolute bottom-32 right-20 w-72 h-72 bg-gradient-to-r from-green-400/20 to-cyan-400/20 rounded-full blur-2xl animate-pulse delay-1000" />
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

			{/* Glassmorphic register card */}
			<form
				onSubmit={handleSubmit}
				className="relative z-10 w-full max-w-md backdrop-blur-sm bg-white/5 rounded-2xl px-8 py-8 border border-white/10 shadow-2xl"
			>
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
						Create Account
					</h1>
					<p className="text-gray-300">Join us today and start your journey</p>
				</div>

				{/* Grid of first/last name */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<div>
						<label
							htmlFor="firstName"
							className="block text-sm font-medium text-emerald-200 mb-1"
						>
							First Name
						</label>
						<input
							id="firstName"
							name="firstName"
							type="text"
							value={formData.firstName}
							onChange={handleChange}
							className="w-full px-4 py-3 bg-black/40 rounded-lg border border-emerald-400/30 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
							placeholder="John"
						/>
						{errors.firstName && (
							<p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
						)}
					</div>
					<div>
						<label
							htmlFor="lastName"
							className="block text-sm font-medium text-emerald-200 mb-1"
						>
							Last Name
						</label>
						<input
							id="lastName"
							name="lastName"
							type="text"
							value={formData.lastName}
							onChange={handleChange}
							className="w-full px-4 py-3 bg-black/40 rounded-lg border border-emerald-400/30 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
							placeholder="Doe"
						/>
						{errors.lastName && (
							<p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
						)}
					</div>
				</div>

				{/* Email */}
				<div className="mb-4">
					<label
						htmlFor="email"
						className="block text-sm font-medium text-emerald-200 mb-1"
					>
						Email Address
					</label>
					<div className="relative">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
						<input
							id="email"
							name="email"
							type="email"
							value={formData.email}
							onChange={handleChange}
							className="pl-10 w-full px-4 py-3 bg-black/40 rounded-lg border border-emerald-400/30 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
							placeholder="you@example.com"
						/>
					</div>
					{errors.email && (
						<p className="mt-1 text-sm text-red-400">{errors.email}</p>
					)}
				</div>

				{/* Password */}
				<div className="mb-4">
					<label
						htmlFor="password"
						className="block text-sm font-medium text-emerald-200 mb-1"
					>
						Password
					</label>
					<div className="relative">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
						<input
							id="password"
							name="password"
							type={showPassword ? "text" : "password"}
							value={formData.password}
							onChange={handleChange}
							className="pl-10 w-full px-4 py-3 bg-black/40 rounded-lg border border-emerald-400/30 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
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
					{errors.password && (
						<p className="mt-1 text-sm text-red-400">{errors.password}</p>
					)}
				</div>

				{/* Confirm Password */}
				<div className="mb-6">
					<label
						htmlFor="confirmPassword"
						className="block text-sm font-medium text-emerald-200 mb-1"
					>
						Confirm Password
					</label>
					<div className="relative">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
						<input
							id="confirmPassword"
							name="confirmPassword"
							type={showPassword ? "text" : "password"}
							value={formData.confirmPassword}
							onChange={handleChange}
							className="pl-10 w-full px-4 py-3 bg-black/40 rounded-lg border border-emerald-400/30 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
							placeholder="••••••••"
						/>
					</div>
					{errors.confirmPassword && (
						<p className="mt-1 text-sm text-red-400">
							{errors.confirmPassword}
						</p>
					)}
				</div>

				{/* Register button */}
				<button
					type="submit"
					disabled={loading}
					className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full font-semibold text-white hover:from-emerald-600 hover:to-green-600 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{loading ? (
						<span className="flex items-center justify-center gap-2">
							<svg
								className="animate-spin h-4 w-4 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
							Creating Account...
						</span>
					) : (
						"Create Account"
					)}
				</button>

				{/* Login link */}
				<div className="mt-6 text-center">
					<span className="text-sm text-gray-300">
						Already have an account?{" "}
						<Link
							to="/signup"
							className="text-emerald-400 hover:underline hover:text-green-300 transition"
						>
							Sign in
						</Link>
					</span>
				</div>
			</form>
		</div>
	);
};

export default Registration;
