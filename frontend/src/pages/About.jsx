import React from "react";
import { Github, Linkedin } from "lucide-react";

const About = () => {
	return (
		<div className="min-h-screen px-6 py-12 bg-black text-white relative overflow-hidden">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute bottom-32 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
			</div>
			{/* Floating particles */}
			<div className="absolute inset-0 pointer-events-none">
				{[...Array(20)].map((_, i) => (
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
			
				
			<div className="max-w-4xl mx-auto text-center relative z-10">
				{/* Main header with gradient text */}
				<div className="mb-12">
					<h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
						About Hisabee
					</h1>
					<div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full"></div>
				</div>

				{/* Hero section with glass morphism */}
				<div className="backdrop-blur-sm bg-white/5 rounded-3xl p-8 mb-12 border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-500">
					<p className="text-xl mb-6 leading-relaxed">
						<span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-bold text-2xl">
							Hisabee
						</span>{" "}
						is your ultimate trip expense manager. Whether you're traveling solo
						or in a group, Hisabee helps you keep track of every rupee spent,
						live and transparently.
					</p>

					<div className="grid md:grid-cols-2 gap-8 mt-8">
						<div className="backdrop-blur-sm bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-400/20">
							<h3 className="text-2xl font-bold text-purple-300 mb-4">
								✨ Features
							</h3>
							<ul className="text-left space-y-3 text-lg">
								<li className="flex items-center">
									<span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
									Log every expense instantly during the trip
								</li>
								<li className="flex items-center">
									<span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
									Track group spending in real-time
								</li>
								<li className="flex items-center">
									<span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
									Split costs fairly among all members
								</li>
								<li className="flex items-center">
									<span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
									Get a clear summary at the end of the trip
								</li>
							</ul>
						</div>

						<div className="backdrop-blur-sm bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-400/20">
							<h3 className="text-2xl font-bold text-blue-300 mb-4">
								🚀 Get Started
							</h3>
							<p className="text-lg leading-relaxed">
								Start your trip, add your crew, and let Hisabee handle the money
								talk — so you can focus on the fun.
							</p>
							<div className="mt-4 p-4 bg-black/30 rounded-lg">
								<code className="text-green-400 text-sm">
									$ npm install fun
									<br />
									$ travel --with-friends
									<br />$ hisabee --track-expenses
								</code>
							</div>
						</div>
					</div>
				</div>

				{/* Team section */}
				<div className="mb-12">
					<h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
						Meet the Creators
					</h2>
					<div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-red-400 mx-auto rounded-full mb-12"></div>
				</div>

				<div className="grid md:grid-cols-3 gap-8">
					{/* Creator 1 */}
					<div className="group backdrop-blur-sm bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-8 rounded-3xl border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
						<div className="relative mb-6">
							<div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 p-1">
								<div className="w-full h-full rounded-full bg-black flex items-center justify-center">
									<span className="text-4xl font-bold text-cyan-400">MA</span>
								</div>
							</div>
							<div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-ping opacity-75"></div>
						</div>
						<h3 className="text-2xl font-bold text-cyan-300 mb-3">Meet Amin</h3>
						<p className="text-gray-300 leading-relaxed">
							Frontend developer and UI/UX enthusiast who brought Hisabee's
							clean design and smooth flow to life.
						</p>
						<div className="mt-4 flex justify-center space-x-2">
							<span className="px-3 py-1 bg-cyan-500/30 rounded-full text-xs text-cyan-200">
								Frontend
							</span>
							<span className="px-3 py-1 bg-blue-500/30 rounded-full text-xs text-blue-200">
								UI/UX
							</span>
						</div>
						<div className="mt-4 flex justify-center space-x-4">
							<a
								href="https://github.com/MeetAmin7809"
								className="p-2 bg-cyan-500/20 rounded-full hover:bg-cyan-500/30 transition-colors duration-300 hover:scale-110 transform"
							>
								<Github className="w-5 h-5 text-cyan-400" />
							</a>
							<a
								href="https://www.linkedin.com/in/meet-amin-335902264/"
								className="p-2 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors duration-300 hover:scale-110 transform"
							>
								<Linkedin className="w-5 h-5 text-blue-400" />
							</a>
						</div>
					</div>

					{/* Creator 2 */}
					<div className="group backdrop-blur-sm bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-8 rounded-3xl border border-purple-400/20 hover:border-purple-400/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
						<div className="relative mb-6">
							<div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-pink-500 p-1">
								<div className="w-full h-full rounded-full bg-black flex items-center justify-center">
									<span className="text-4xl font-bold text-purple-400">MP</span>
								</div>
							</div>
							<div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping opacity-75"></div>
						</div>
						<h3 className="text-2xl font-bold text-purple-300 mb-3">
							Megh Prajapati
						</h3>
						<p className="text-gray-300 leading-relaxed">
							Backend wizard who handled real-time expense syncing and made data
							management effortless.
						</p>
						<div className="mt-4 flex justify-center space-x-2">
							<span className="px-3 py-1 bg-purple-500/30 rounded-full text-xs text-purple-200">
								Backend
							</span>
							<span className="px-3 py-1 bg-pink-500/30 rounded-full text-xs text-pink-200">
								Real-time
							</span>
						</div>
						<div className="mt-4 flex justify-center space-x-4">
							<a
								href="https://github.com/Meghhhhh"
								className="p-2 bg-purple-500/20 rounded-full hover:bg-purple-500/30 transition-colors duration-300 hover:scale-110 transform"
							>
								<Github className="w-5 h-5 text-purple-400" />
							</a>
							<a
								href="https://www.linkedin.com/in/megh-prajapati-ab13a82b3/"
								className="p-2 bg-pink-500/20 rounded-full hover:bg-pink-500/30 transition-colors duration-300 hover:scale-110 transform"
							>
								<Linkedin className="w-5 h-5 text-pink-400" />
							</a>
						</div>
					</div>

					{/* Creator 3 */}
					<div className="group backdrop-blur-sm bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-8 rounded-3xl border border-green-400/20 hover:border-green-400/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
						<div className="relative mb-6">
							<div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-500 p-1">
								<div className="w-full h-full rounded-full bg-black flex items-center justify-center">
									<span className="text-4xl font-bold text-green-400">HR</span>
								</div>
							</div>
							<div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-ping opacity-75"></div>
						</div>
						<h3 className="text-2xl font-bold text-green-300 mb-3">
							Harshit Rajput
						</h3>
						<p className="text-gray-300 leading-relaxed">
							Product thinker and tester who ensured Hisabee works smoothly for
							all types of travelers.
						</p>
						<div className="mt-4 flex justify-center space-x-2">
							<span className="px-3 py-1 bg-green-500/30 rounded-full text-xs text-green-200">
								Product
							</span>
							<span className="px-3 py-1 bg-emerald-500/30 rounded-full text-xs text-emerald-200">
								Testing
							</span>
						</div>
						<div className="mt-4 flex justify-center space-x-4">
							<a
								href="http://github.com/HARSHIT5114"
								className="p-2 bg-green-500/20 rounded-full hover:bg-green-500/30 transition-colors duration-300 hover:scale-110 transform"
							>
								<Github className="w-5 h-5 text-green-400" />
							</a>
							<a
								href="https://www.linkedin.com/in/harshit-rajput-268132250/"
								className="p-2 bg-emerald-500/20 rounded-full hover:bg-emerald-500/30 transition-colors duration-300 hover:scale-110 transform"
							>
								<Linkedin className="w-5 h-5 text-emerald-400" />
							</a>
						</div>
					</div>
				</div>

				{/* Footer CTA */}
				<div className="mt-16 backdrop-blur-sm bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl p-8 border border-indigo-400/20">
					<h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
						Ready to Track Your Adventures?
					</h3>
					<p className="text-xl text-gray-300 mb-6">
						Join thousands of travelers who trust Hisabee with their expense
						management
					</p>
					<button className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-semibold text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30">
						Start Your Journey
					</button>
				</div>
			</div>
		</div>
	);
};

export default About;
