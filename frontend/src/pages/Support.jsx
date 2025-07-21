import React from "react";

const Support = () => {
	return (
		<div className="min-h-screen bg-gray-900 text-white px-4 py-8 sm:px-6 md:px-10 lg:px-16 xl:px-20">
			{/* Hero Section */}
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-4">Support</h1>
				<p className="text-lg text-gray-300 max-w-2xl mx-auto">
					We're here to help you. Find answers, ask questions, or contact our
					team directly.
				</p>
			</div>

			{/* Contact Form */}
			<div className="bg-gray-800 p-6 rounded-lg mb-12 max-w-2xl mx-auto">
				<h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
				<form className="space-y-4">
					<div>
						<label htmlFor="name" className="block text-sm mb-1">
							Name
						</label>
						<input
							type="text"
							id="name"
							className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
						/>
					</div>
					<div>
						<label htmlFor="email" className="block text-sm mb-1">
							Email
						</label>
						<input
							type="email"
							id="email"
							className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
						/>
					</div>
					<div>
						<label htmlFor="message" className="block text-sm mb-1">
							Your Message
						</label>
						<textarea
							id="message"
							rows="4"
							className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
						></textarea>
					</div>
					<button
						type="submit"
						className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg text-white font-medium transition-colors"
					>
						Send Message
					</button>
				</form>
			</div>

			{/* FAQ Section */}
			{/* FAQ Section */}
			<div className="max-w-2xl mx-auto">
				<h2 className="text-2xl font-semibold mb-6">
					Frequently Asked Questions
				</h2>
				<div className="space-y-4">
					{/* Question 1 */}
					<div className="bg-gray-800 rounded-lg p-4">
						<details className="group">
							<summary className="flex justify-between items-center cursor-pointer">
								<span className="font-medium text-gray-100">
									What is your refund policy?
								</span>
								<svg
									className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</summary>
							<p className="text-gray-400 mt-2 pl-2">
								We offer a 30-day money-back guarantee. If you're not satisfied,
								contact support and we'll issue a full refund.
							</p>
						</details>
					</div>

					{/* Question 2 */}
					<div className="bg-gray-800 rounded-lg p-4">
						<details className="group">
							<summary className="flex justify-between items-center cursor-pointer">
								<span className="font-medium text-gray-100">
									How do I reset my password?
								</span>
								<svg
									className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</summary>
							<p className="text-gray-400 mt-2 pl-2">
								Go to the login page and click on "Forgot Password". Enter your
								email and follow the instructions sent to you.
							</p>
						</details>
					</div>

					{/* Question 3 */}
					<div className="bg-gray-800 rounded-lg p-4">
						<details className="group">
							<summary className="flex justify-between items-center cursor-pointer">
								<span className="font-medium text-gray-100">
									How can I update my account information?
								</span>
								<svg
									className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</summary>
							<p className="text-gray-400 mt-2 pl-2">
								Log in to your account and navigate to Settings. There, you can
								update your email, password, and profile.
							</p>
						</details>
					</div>

					{/* Question 4 */}
					<div className="bg-gray-800 rounded-lg p-4">
						<details className="group">
							<summary className="flex justify-between items-center cursor-pointer">
								<span className="font-medium text-gray-100">
									How do I contact support outside business hours?
								</span>
								<svg
									className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</summary>
							<p className="text-gray-400 mt-2 pl-2">
								Please fill out the form above and we'll get back to you as soon
								as possible. Typical response time is 24 hours.
							</p>
						</details>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Support;
