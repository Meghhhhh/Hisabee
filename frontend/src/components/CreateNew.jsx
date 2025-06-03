import React, { useState } from "react";
import { Link } from "react-router";

import {
	Plus,
	X,
	Users,
	DollarSign,
	Calendar,
	UserPlus,
	Trash2,
	ChevronLeft,
} from "lucide-react";

const AddHisabPage = ({ onSave, onCancel }) => {
	const [formData, setFormData] = useState({
		title: "",
		total_budget: "",
		created_by: "current_user_id", // This would come from auth context
	});

	const [contributors, setContributors] = useState([
		{
			id: 1,
			user_id: "current_user_id",
			name: "You",
			budget_contribution: "",
			isCreator: true,
		},
	]);

	// Mock user data - in real app, this would come from API/database
	const availableUsers = [
		{ id: "user1", name: "Rahul Sharma" },
		{ id: "user2", name: "Priya Patel" },
		{ id: "user3", name: "Amit Kumar" },
		{ id: "user4", name: "Neha Singh" },
		{ id: "user5", name: "Vikram Reddy" },
		{ id: "user6", name: "Anjali Gupta" },
	];

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
		const selectedUser = availableUsers.find((user) => user.id === userId);
		if (selectedUser) {
			updateContributor(contributorId, "user_id", userId);
			updateContributor(contributorId, "name", selectedUser.name);
		}
	};

	const calculateTotalContributions = () => {
		return contributors.reduce((sum, contributor) => {
			return sum + (parseFloat(contributor.budget_contribution) || 0);
		}, 0);
	};

	const handleSubmit = () => {
		// Validation
		if (!formData.title.trim()) {
			alert("Please enter a title for the hisab");
			return;
		}

		if (!formData.total_budget || parseFloat(formData.total_budget) <= 0) {
			alert("Please enter a valid total budget");
			return;
		}

		// Check if all contributors have valid data
		const validContributors = contributors.filter((c) => c.user_id && c.name);
		if (validContributors.length === 0) {
			alert("Please add at least one contributor");
			return;
		}

		// Prepare data for submission
		const hisabData = {
			...formData,
			total_budget: parseFloat(formData.total_budget),
			contributors: validContributors.map((c) => ({
				user_id: c.user_id,
				budget_contribution: parseFloat(c.budget_contribution) || 0,
			})),
		};

		onSave(hisabData);
	};

	const totalContributions = calculateTotalContributions();
	const budgetDifference =
		parseFloat(formData.total_budget || 0) - totalContributions;

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-4xl mx-auto px-4">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-4">
						<Link to={"/home"}>
							<button className="p-2 hover:bg-gray-200 rounded-lg transition">
								<ChevronLeft size={24} className="text-gray-600" />
							</button>
						</Link>
						<div>
							<h1 className="text-3xl font-bold text-gray-800">
								Create New Hisab
							</h1>
							<p className="text-gray-500 mt-1">
								Set up a shared expense tracker
							</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
					{/* Basic Information */}
					<div className="p-6 border-b border-gray-100">
						<h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
							<Calendar size={20} />
							Basic Information
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Hisab Title *
								</label>
								<input
									type="text"
									value={formData.title}
									onChange={(e) => handleInputChange("title", e.target.value)}
									placeholder="e.g., Goa Trip, Monthly Expenses"
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Total Budget *
								</label>
								<div className="relative">
									<DollarSign
										size={18}
										className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
									/>
									<input
										type="number"
										value={formData.total_budget}
										onChange={(e) =>
											handleInputChange("total_budget", e.target.value)
										}
										placeholder="0.00"
										className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Contributors Section */}
					<div className="p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
								<Users size={20} />
								Contributors (
								{contributors.filter((c) => c.user_id && c.name).length})
							</h2>
							<button
								onClick={addContributor}
								className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
							>
								<UserPlus size={16} />
								Add Member
							</button>
						</div>

						<div className="space-y-4">
							{contributors.map((contributor) => (
								<div key={contributor.id} className="bg-gray-50 rounded-lg p-4">
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Member
											</label>
											{contributor.isCreator ? (
												<div className="px-4 py-3 bg-indigo-100 text-indigo-800 rounded-lg font-medium">
													You (Creator)
												</div>
											) : (
												<select
													value={contributor.user_id}
													onChange={(e) =>
														handleUserSelect(contributor.id, e.target.value)
													}
													className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
												>
													<option value="">Select a member</option>
													{availableUsers.map((user) => (
														<option key={user.id} value={user.id}>
															{user.name}
														</option>
													))}
												</select>
											)}
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Budget Contribution
											</label>
											<div className="relative">
												<DollarSign
													size={16}
													className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
												/>
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
													className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
												/>
											</div>
										</div>

										<div className="flex justify-end">
											{!contributor.isCreator && (
												<button
													onClick={() => removeContributor(contributor.id)}
													className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition"
												>
													<Trash2 size={16} />
												</button>
											)}
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Budget Summary */}
						{formData.total_budget && (
							<div className="mt-6 bg-blue-50 rounded-lg p-4">
								<h3 className="font-medium text-gray-800 mb-3">
									Budget Summary
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
									<div>
										<div className="text-sm text-gray-500">Total Budget</div>
										<div className="text-xl font-bold text-gray-800">
											₹{parseFloat(formData.total_budget || 0).toLocaleString()}
										</div>
									</div>
									<div>
										<div className="text-sm text-gray-500">
											Total Contributions
										</div>
										<div className="text-xl font-bold text-indigo-600">
											₹{totalContributions.toLocaleString()}
										</div>
									</div>
									<div>
										<div className="text-sm text-gray-500">
											{budgetDifference >= 0 ? "Remaining" : "Over Budget"}
										</div>
										<div
											className={`text-xl font-bold ${
												budgetDifference >= 0
													? "text-green-600"
													: "text-red-600"
											}`}
										>
											₹{Math.abs(budgetDifference).toLocaleString()}
										</div>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Action Buttons */}
					<div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
						<button
							onClick={onCancel}
							className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
						>
							Cancel
						</button>
						<button
							onClick={handleSubmit}
							className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
						>
							Create Hisab
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

// Demo component to show how it works
const CreateNew = () => {
	const [showAddPage, setShowAddPage] = useState(true);

	const handleSave = (hisabData) => {
		console.log("Creating new hisab:", hisabData);
		// Here you would typically send the data to your backend
		alert("Hisab created successfully!");
		setShowAddPage(false);
	};

	const handleCancel = () => {
		setShowAddPage(false);
		console.log("Hisab creation cancelled");
	};

	return (
		<div>
			{showAddPage ? (
				<AddHisabPage onSave={handleSave} onCancel={handleCancel} />
			) : (
				<div className="min-h-screen bg-gray-50 flex items-center justify-center">
					<div className="text-center">
						<h2 className="text-2xl font-bold mb-4">Add Hisab Demo</h2>
						<button
							onClick={() => setShowAddPage(true)}
							className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
						>
							Create New Hisab
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default CreateNew;
