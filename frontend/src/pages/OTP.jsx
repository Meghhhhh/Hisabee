import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logoImg } from "../constants/index1";
import { CiMobile1 } from "react-icons/ci";
import axios from "axios";

const OTP = () => {
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const [timer, setTimer] = useState(300); // 5 minutes in seconds
	const [canResend, setCanResend] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e, index) => {
		const value = e.target.value;
		if (!/^\d*$/.test(value)) return;

		const newOtp = [...otp];
		newOtp[index] = value.slice(-1);
		setOtp(newOtp);

		if (value && index < 5) {
			document.getElementById(`otp-${index + 1}`).focus();
		}
	};

	const resendOtp = async () => {
		try {
			await axios.post(
				`${import.meta.env.VITE_BACKEND_API_URL}/user/resend-otp`,
				{
					email: localStorage.getItem("email"),
				}
			);
			toast.success("Email sent successfully!");
			setTimer(300);
			setCanResend(false);
		} catch (err) {
			toast.error("Failed to send email! Error: ", err);
		}
	};

	const handleVerify = async () => {
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_BACKEND_API_URL}/user/verify-otp`,
				{
					email: localStorage.getItem("email"),
					otp: otp.join(""),
				}
			);
			if (response.status < 300) {
				toast.success("OTP verified successfully, please login to continue", {
					autoClose: 3000,
				});
				localStorage.removeItem("email");
				setTimeout(() => {
					navigate("/signup");
				}, 2000);
			} else {
				toast.error("Failed to send OTP", {
					autoClose: 5000,
				});
			}
			setCanResend(false);
		} catch (err) {
			toast.error("Failed to verify email! Error: ", err);
		}
	};

	useEffect(() => {
		// Start timer countdown
		if (timer > 0) {
			const interval = setInterval(() => {
				setTimer((prev) => prev - 1);
			}, 1000);

			return () => clearInterval(interval);
		} else {
			setCanResend(true);
		}
	}, [timer]);

	const formatTime = () => {
		const mins = Math.floor(timer / 60)
			.toString()
			.padStart(2, "0");
		const secs = (timer % 60).toString().padStart(2, "0");
		return `${mins}:${secs}`;
	};

	return (
		<div className="min-h-screen px-4 py-12 bg-black text-white relative overflow-hidden">
			{/* Animated green gradient circles */}
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

			{/* Logo */}
			<Link to="/home" className="absolute top-4 left-4 z-50">
				<img
					src={logoImg}
					alt="logo-hisabee"
					width={37}
					height={25}
					className="backdrop-blur-sm bg-emerald-500/10 rounded-sm p-1 border border-emerald-400/20 hover:bg-emerald-500/20 transition-all"
				/>
			</Link>

			{/* Glassmorphic OTP container */}
			<div className="relative z-10 w-full min-h-[90vh] flex items-center justify-center">
				<div className="w-full max-w-xl backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-10 shadow-2xl">
					{/* Title */}
					<div className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent text-center">
						OTP Verification
					</div>
					<p className="text-gray-300 text-center mb-8">
						Enter the code sent to your email
						<CiMobile1 className="ml-2 inline" size={24} />
					</p>

					{/* OTP Input boxes */}
					<div className="backdrop-blur-sm bg-black/40 rounded-xl border border-emerald-400/30 px-6 py-8 flex justify-center">
						<div className="flex items-center gap-3">
							{otp.map((digit, index) => (
								<input
									key={index}
									id={`otp-${index}`}
									type="text"
									value={digit}
									onChange={(e) => handleChange(e, index)}
									maxLength="1"
									className="w-14 h-16 text-2xl font-medium bg-black/50 border-b-2 border-emerald-400/50 text-emerald-300 text-center focus:outline-none focus:border-emerald-400/80 transition"
								/>
							))}
						</div>
					</div>

					{/* Timer */}
					<div className="mt-4 text-gray-300 text-center">
						Time remaining:{" "}
						<span className="font-bold text-emerald-400">{formatTime()}</span>
					</div>

					{/* Verify button */}
					<div className="mt-6 flex justify-center">
						<button
							onClick={handleVerify}
							className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full font-semibold text-white hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg hover:shadow-emerald-500/30"
						>
							Verify
						</button>
					</div>

					{/* Resend OTP link */}
					<div className="mt-6 text-center text-gray-300">
						Didn't get the email?{" "}
						{canResend ? (
							<button
								onClick={resendOtp}
								className="text-emerald-400 hover:underline hover:text-green-300 transition"
							>
								Resend
							</button>
						) : (
							<span className="text-gray-400">
								Resend available after timer ends
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default OTP;
