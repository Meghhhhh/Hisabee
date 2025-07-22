import React, { useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData } from "../../../store/slice/userSlice";
import { toast } from "react-toastify";
import axios from "axios";

const EditProfilePage = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: user.name || "",
		email: user.email || "",
		phone: user.phone || "",
		payment_method: user.payment_method || "",
		avatar: user.avatar || "",
		qrCode: user.qrCode || "/Subject2.png",
	});

	const [previewAvatar, setPreviewAvatar] = useState(user.avatar || "");
	const [previewQR, setPreviewQR] = useState(user.qrCode || "/Subject2.png");

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleFileUpload = (field, event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const result = e.target.result;
				if (field === "avatar") {
					setPreviewAvatar(result);
					handleInputChange("avatar", result);
				} else if (field === "qrCode") {
					setPreviewQR(result);
					handleInputChange("qrCode", result);
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async () => {
		const res = await axios.patch(
			`${import.meta.env.VITE_BACKEND_API_URL}/user/update-profile`,
			{
				firstName: formData.name.split(" ")[0],
				lastName: formData.name.split(" ")[1],
				phone_number: formData.phone,
				payment_reference: formData.payment_method,
			},
			{ withCredentials: true }
		);
		dispatch(
			updateUserData({
				firstName: res.data.data.name.split(" ")[0],
				lastName: res.data.data.name.split(" ")[1],
				email: res.data.data.email,
				payment_reference: res.data.data.payment_reference,
				phone_number: res.data.data.phone_number,
			})
		);
		toast.success(res.data.message);
		navigate("/profile");
	};

	return (
		<div className="min-h-screen bg-black text-white relative overflow-hidden px-4 py-10 flex flex-col items-center justify-center">
			{/* Animated background */}
			<div className="absolute inset-0 z-0 pointer-events-none">
				<div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute bottom-32 right-32 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
				{[...Array(12)].map((_, i) => (
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

			<div className="relative z-10 w-full max-w-xl mx-auto">
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-3xl sm:text-4xl font-bold text-white">
							Edit Profile
						</h1>
						<span className="block text-base text-gray-300 font-medium mt-1">
							Update your personal information and payment details
						</span>
					</div>
					<Link to={"/profile"}>
						<button className="p-2 hover:bg-white/10 rounded-full transition">
							<X size={24} />
						</button>
					</Link>
				</div>

				{/* Profile Photo Section */}
				<div className="flex flex-col items-center gap-4 mb-10">
					<div className="relative">
						<img
							src={previewAvatar || "/api/placeholder/200/200"}
							alt="Profile preview"
							className="w-32 h-32 sm:w-40 sm:h-40 rounded-full shadow-2xl border-4 border-white object-cover bg-black"
						/>
						<label className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full cursor-pointer hover:from-blue-600 hover:to-purple-600 transition shadow-lg">
							<Camera size={20} />
							<input
								type="file"
								accept="image/*"
								onChange={(e) => handleFileUpload("avatar", e)}
								className="hidden"
							/>
						</label>
					</div>
					<label className="inline-flex items-center px-4 py-2 bg-white/10 text-white rounded-xl cursor-pointer hover:bg-white/20 transition mt-2">
						<Upload size={16} className="mr-2" />
						Choose File
						<input
							type="file"
							accept="image/*"
							onChange={(e) => handleFileUpload("avatar", e)}
							className="hidden"
						/>
					</label>
				</div>

				{/* Personal Information */}
				<div className="mb-10">
					<h3 className="text-xl font-semibold mb-6 text-white">
						Personal Information
					</h3>
					<div className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Full Name
							</label>
							<input
								type="text"
								value={formData.name}
								onChange={(e) => handleInputChange("name", e.target.value)}
								className="w-full px-4 py-3 border border-white/15 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400/40 focus:border-green-400/40 focus:outline-none transition"
								placeholder="Enter your full name"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Email Address
							</label>
							<input
								type="email"
								value={formData.email}
								onChange={(e) => handleInputChange("email", e.target.value)}
								className="w-full px-4 py-3 border border-white/15 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400/40 focus:border-green-400/40 focus:outline-none transition"
								placeholder="Enter your email"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Phone Number
							</label>
							<input
								type="tel"
								value={formData.phone}
								onChange={(e) => handleInputChange("phone", e.target.value)}
								className="w-full px-4 py-3 border border-white/15 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400/40 focus:border-green-400/40 focus:outline-none transition"
								placeholder="Enter your phone number"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Payment Method
							</label>
							<select
								value={formData.payment_method}
								onChange={(e) =>
									handleInputChange("payment_method", e.target.value)
								}
								className="w-full px-4 py-3 border border-white/15 bg-white/10 rounded-xl text-white focus:ring-2 focus:ring-green-400/40 focus:border-green-400/40 focus:outline-none transition"
							>
								<option value="" className="bg-black text-white">
									Select payment method
								</option>
								<option value="Credit Card" className="bg-black text-white">
									Credit Card
								</option>
								<option value="Debit Card" className="bg-black text-white">
									Debit Card
								</option>
								<option value="PayPal" className="bg-black text-white">
									PayPal
								</option>
								<option value="Bank Transfer" className="bg-black text-white">
									Bank Transfer
								</option>
								<option value="Cash" className="bg-black text-white">
									Cash
								</option>
							</select>
						</div>
					</div>
				</div>

				{/* QR Code Section */}
				<div className="mb-10">
					<h3 className="text-xl font-semibold mb-6 text-white">QR Code</h3>
					<div className="flex flex-col items-center gap-4">
						<div className="relative">
							<img
								src={previewQR}
								alt="QR Code preview"
								className="border-4 border-white h-32 w-32 sm:h-40 sm:w-40 object-cover bg-black"
							/>
							<label className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full cursor-pointer hover:from-blue-600 hover:to-purple-600 transition shadow-lg">
								<Upload size={16} />
								<input
									type="file"
									accept="image/*"
									onChange={(e) => handleFileUpload("qrCode", e)}
									className="hidden"
								/>
							</label>
						</div>
						<label className="inline-flex items-center px-4 py-2 bg-white/10 text-white rounded-xl cursor-pointer hover:bg-white/20 transition mt-2">
							<Upload size={16} className="mr-2" />
							Choose QR Code
							<input
								type="file"
								accept="image/*"
								onChange={(e) => handleFileUpload("qrCode", e)}
								className="hidden"
							/>
						</label>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex justify-end pt-2">
					<button
						type="button"
						onClick={() => handleSubmit()}
						className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-semibold text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-md text-base flex items-center gap-2"
					>
						Save Changes
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditProfilePage;

/* Add fade-in animation */
<style jsx>{`
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.animate-fade-in {
		animation: fade-in 0.7s cubic-bezier(0.4, 0, 0.2, 1) both;
	}
`}</style>;
