import React, { useState } from "react";
import { Camera, Upload, X } from "lucide-react";

const EditProfilePage = ({ user, onSave, onCancel }) => {
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

	const handleSubmit = (e) => {
		e.preventDefault();
		onSave(formData);
	};

	return (
		<div className="font-[Montserrat] relative max-w-4xl mx-auto p-6">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-4xl font-bold">Edit Profile</h1>
				<button
					onClick={onCancel}
					className="p-2 hover:bg-gray-100 rounded-full transition"
				>
					<X size={24} />
				</button>
			</div>

			<div className="space-y-8">
				{/* Profile Photo Section */}
				<div className="flex items-center space-x-6">
					<div className="relative">
						<img
							src={previewAvatar || "/api/placeholder/200/200"}
							alt="Profile preview"
							className="w-52 h-52 rounded-full shadow-2xl border-4 border-black object-cover"
						/>
						<label className="absolute bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-lg">
							<Camera size={20} />
							<input
								type="file"
								accept="image/*"
								onChange={(e) => handleFileUpload("avatar", e)}
								className="hidden"
							/>
						</label>
					</div>
					<div>
						<h3 className="text-xl font-semibold mb-2">Profile Photo</h3>
						<p className="text-gray-500 mb-4">Upload a new profile picture</p>
						<label className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl cursor-pointer hover:bg-gray-200 transition">
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
				</div>

				{/* Personal Information */}
				<div className="bg-gray-50 rounded-2xl p-6">
					<h3 className="text-xl font-semibold mb-6">Personal Information</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Full Name
							</label>
							<input
								type="text"
								value={formData.name}
								onChange={(e) => handleInputChange("name", e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
								placeholder="Enter your full name"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Email Address
							</label>
							<input
								type="email"
								value={formData.email}
								onChange={(e) => handleInputChange("email", e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
								placeholder="Enter your email"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Phone Number
							</label>
							<input
								type="tel"
								value={formData.phone}
								onChange={(e) => handleInputChange("phone", e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
								placeholder="Enter your phone number"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Payment Method
							</label>
							<select
								value={formData.payment_method}
								onChange={(e) =>
									handleInputChange("payment_method", e.target.value)
								}
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
							>
								<option value="">Select payment method</option>
								<option value="Credit Card">Credit Card</option>
								<option value="Debit Card">Debit Card</option>
								<option value="PayPal">PayPal</option>
								<option value="Bank Transfer">Bank Transfer</option>
								<option value="Cash">Cash</option>
							</select>
						</div>
					</div>
				</div>

				{/* QR Code Section */}
				<div className="bg-gray-50 rounded-2xl p-6">
					<h3 className="text-xl font-semibold mb-6">QR Code</h3>
					<div className="flex items-center space-x-6">
						<div className="relative">
							<img
								src={previewQR}
								alt="QR Code preview"
								className="border-4 border-black h-[200px] w-[200px] object-cover"
							/>
							<label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-lg">
								<Upload size={16} />
								<input
									type="file"
									accept="image/*"
									onChange={(e) => handleFileUpload("qrCode", e)}
									className="hidden"
								/>
							</label>
						</div>
						<div>
							<h4 className="text-lg font-medium mb-2">Update QR Code</h4>
							<p className="text-gray-500 mb-4">Upload a new QR code image</p>
							<label className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl cursor-pointer hover:bg-gray-200 transition">
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
				</div>

				{/* Action Buttons */}
				<div className="flex justify-end space-x-4 pt-6">
					<button
						type="button"
						onClick={onCancel}
						className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={() => handleSubmit()}
						className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
					>
						Save Changes
					</button>
				</div>
			</div>
		</div>
	);
};

// Demo component to show how it works
const EditInfo = () => {
	const [isEditing, setIsEditing] = useState(true);
	const [user] = useState({
		name: "John Doe",
		email: "john.doe@example.com",
		phone: "+1 (555) 123-4567",
		payment_method: "Credit Card",
		avatar: "/api/placeholder/200/200",
		qrCode: "/Subject2.png",
		totalExpenses: "$1,234.56",
		groups: "5",
	});

	const handleSave = (formData) => {
		console.log("Saving profile data:", formData);
		// Here you would typically send the data to your backend
		setIsEditing(false);
		alert("Profile updated successfully!");
	};

	const handleCancel = () => {
		setIsEditing(false);
		console.log("Edit cancelled");
	};

	return (
		<div className="min-h-screen bg-white p-4">
			{isEditing ? (
				<EditProfilePage
					user={user}
					onSave={handleSave}
					onCancel={handleCancel}
				/>
			) : (
				<div className="text-center py-20">
					<h2 className="text-2xl font-bold mb-4">Profile Edit Demo</h2>
					<button
						onClick={() => setIsEditing(true)}
						className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
					>
						Open Edit Profile
					</button>
				</div>
			)}
		</div>
	);
};

export default EditInfo;
