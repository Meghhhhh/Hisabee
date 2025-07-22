import React, { useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addHisab } from "../../store/slice/hisabSlice.js";

import { Users, Calendar, UserPlus, Trash2, ChevronLeft } from "lucide-react";

const CreateNew = () => {
	const [formData, setFormData] = useState({
		title: "",
		total_budget: "",
		created_by: useSelector((state) => state.user.id),
	});

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [contributors, setContributors] = useState([
		{
			id: 1,
			user_id: useSelector((state) => state.user.user_id),
			name: "You",
			budget_contribution: "",
			isCreator: true,
		},
	]);

	const availableUsers = useSelector((state) => state.user.friends);

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const addContributor = () => {
		const newId = Math.max(...contributors.map((c) => c.id)) + 1;
		setContributors((prev) => [
			...prev,
			{
				id: newId,
				user_id: "",
				name: "",
				budget_contribution: "",
				isCreator: false,
			},
		]);
	};

	const removeContributor = (id) => {
		setContributors((prev) => prev.filter((c) => c.id !== id));
	};

	const updateContributor = (id, field, value) => {
		setContributors((prev) =>
			prev.map((contributor) =>
				contributor.id === id ? { ...contributor, [field]: value } : contributor
			)
		);
	};

	const handleUserSelect = (contributorId, userId) => {
		const selectedUser = availableUsers.find((user) => user.user_id === userId);
		if (selectedUser) {
			updateContributor(contributorId, "user_id", userId);
			updateContributor(contributorId, "name", selectedUser.name);
		}
	};

	const calculateTotalContributions = () => {
		return contributors.reduce(
			(sum, contributor) =>
				sum + (parseFloat(contributor.budget_contribution) || 0),
			0
		);
	};

	const handleSubmit = async () => {
		if (!formData.title.trim()) {
			toast.error("Please enter a title for the hisab");
			return;
		}

		if (!formData.total_budget || parseFloat(formData.total_budget) <= 0) {
			toast.error("Please enter a valid total budget");
			return;
		}

		const validContributors = contributors.filter((c) => c.user_id && c.name);
		if (validContributors.length === 0) {
			toast.error("Please add at least one contributor");
			return;
		}

		try {
			// 1. Create the hisab -- currency_code is now always 'INR'
			const res = await axios.post(
				`${import.meta.env.VITE_BACKEND_API_URL}/hisabs`,
				{
					title: formData.title,
					total_budget: parseFloat(formData.total_budget),
					currency_code: "INR",
				},
				{
					withCredentials: true,
				}
			);
			const hisab = res.data;
			toast.success(hisab.message || "Hisab created successfully!");

			// 2. Add contributors
			for (const c of contributors) {
				await axios.post(
					`${import.meta.env.VITE_BACKEND_API_URL}/hisabs/${
						hisab.hisab_id
					}/participants`,
					{
						user_id: c.user_id,
						budget_contribution: parseFloat(c.budget_contribution) || 0,
					},
					{
						withCredentials: true,
					}
				);
			}

			dispatch(addHisab(hisab));
			navigate("/home");
		} catch (error) {
			toast.error(
				error.response?.data?.message ||
					"Something went wrong. Please try again."
			);
		}
	};

	const totalContributions = calculateTotalContributions();
	const budgetDifference =
		(parseFloat(formData.total_budget) || 0) - totalContributions;

	return (
		<div className="min-h-screen px-6 py-12 bg-black text-white relative overflow-hidden">
			{/* Animated background */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-emerald-500/20 to-green-400/20 rounded-full blur-2xl animate-pulse" />
				<div className="absolute bottom-32 right-20 w-80 h-80 bg-gradient-to-r from-green-400/20 to-cyan-400/20 rounded-full blur-2xl animate-pulse delay-1000" />
			</div>

			{/* Floating particles */}
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

			<div className="max-w-4xl mx-auto relative z-10">
				{/* Header */}
				<div className="mb-8 flex items-center gap-2">
					<Link to="/home">
						<button className="p-2 backdrop-blur-sm bg-emerald-500/10 rounded-lg border border-emerald-400/20 hover:bg-emerald-500/20 transition-all hover:scale-95">
							<ChevronLeft size={24} className="text-emerald-400" />
						</button>
					</Link>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
						Create New Trip
					</h1>
				</div>

				<p className="text-sm text-gray-400 mb-6">
					Set up a shared expense tracker for your next trip
				</p>

				{/* Form Card */}
				<div className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 shadow-lg mb-6">
					<div className="mb-6">
						<h2 className="text-xl font-semibold text-emerald-300 mb-4 flex items-center gap-2">
							<Calendar size={20} />
							Basic Information
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-emerald-200 mb-2">
									Trip Title *
								</label>
								<input
									type="text"
									value={formData.title}
									onChange={(e) => handleInputChange("title", e.target.value)}
									placeholder="e.g., Goa Trip, Monthly Expenses"
									className="w-full px-4 py-3 bg-black/40 rounded-lg border border-emerald-400/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition placeholder-gray-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-emerald-200 mb-2">
									Total Budget *
								</label>
								<div className="relative">
									<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 font-bold text-lg">
										₹
									</span>
									<input
										type="number"
										value={formData.total_budget}
										onChange={(e) =>
											handleInputChange("total_budget", e.target.value)
										}
										placeholder="0.00"
										className="w-full pl-8 pr-4 py-3 bg-black/40 rounded-lg border border-emerald-400/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition placeholder-gray-500"
									/>
								</div>
							</div>
						</div>
					</div>

					<div>
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl font-semibold text-emerald-300 flex items-center gap-2">
								<Users size={20} />
								Members (
								{contributors.filter((c) => c.user_id && c.name).length})
							</h2>
							<button
								onClick={addContributor}
								className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg flex items-center gap-2 hover:from-emerald-600 hover:to-green-600 transition-all hover:scale-105"
							>
								<UserPlus size={16} /> Add Member
							</button>
						</div>

						<div className="space-y-4">
							{contributors.map((contributor) => (
								<div
									key={contributor.id}
									className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10"
								>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
										<div>
											<span className="block text-sm font-medium text-emerald-200 mb-2">
												Member
											</span>
											{contributor.isCreator ? (
												<div className="px-4 py-3 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 rounded-lg font-medium">
													You (Creator)
												</div>
											) : (
												<select
													value={contributor.user_id}
													onChange={(e) =>
														handleUserSelect(contributor.id, e.target.value)
													}
													className="w-full px-4 py-3 bg-black/40 rounded-lg border border-emerald-400/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
												>
													<option value="">Select a member</option>
													{availableUsers.map((user) => (
														<option key={user.user_id} value={user.user_id}>
															{user.name}
														</option>
													))}
												</select>
											)}
										</div>
										<div>
											<span className="block text-sm font-medium text-emerald-200 mb-2">
												Budget
											</span>
											<div className="relative">
												<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 font-bold text-lg">
													₹
												</span>
												<input
													type="number"
													value={contributor.budget_contribution}
													onChange={(e) =>
														updateContributor(
															contributor.id,
															"budget_contribution",
															e.target.value
														)
													}
													placeholder="0.00"
													className="w-full pl-8 pr-4 py-3 bg-black/40 rounded-lg border border-emerald-400/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition placeholder-gray-500"
												/>
											</div>
										</div>
										<div className="flex justify-end">
											{!contributor.isCreator && (
												<button
													onClick={() => removeContributor(contributor.id)}
													className="p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition hover:scale-110"
												>
													<Trash2 size={16} />
												</button>
											)}
										</div>
									</div>
								</div>
							))}
						</div>

						{formData.total_budget && (
							<div className="mt-6 backdrop-blur-sm bg-white/10 rounded-lg p-4 border border-green-400/20">
								<h3 className="font-medium text-emerald-200 mb-3">
									Budget Summary
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
									<div>
										<div className="text-sm text-emerald-200/80">
											Total Budget
										</div>
										<div className="text-xl font-bold text-white">
											₹{parseFloat(formData.total_budget || 0).toLocaleString()}
										</div>
									</div>
									<div>
										<div className="text-sm text-emerald-200/80">
											Total Contributions
										</div>
										<div className="text-xl font-bold text-emerald-400">
											₹{totalContributions.toLocaleString()}
										</div>
									</div>
									<div>
										<div className="text-sm text-emerald-200/80">
											{budgetDifference >= 0 ? "Remaining" : "Over Budget"}
										</div>
										<div
											className={`text-xl font-bold ${
												budgetDifference >= 0
													? "text-green-400"
													: "text-red-400"
											}`}
										>
											₹{Math.abs(budgetDifference).toLocaleString()}
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Action buttons */}
				<div className="flex justify-end gap-4 mt-6">
					<button className="px-6 py-3 bg-transparent rounded-lg border-2 border-emerald-400/50 text-emerald-400 hover:bg-emerald-500/10 transition-all hover:scale-105 font-medium">
						Cancel
					</button>
					<button
						onClick={handleSubmit}
						className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all hover:scale-105 font-medium"
					>
						Create Hisab
					</button>
				</div>
			</div>
		</div>
	);
};

export default CreateNew;
