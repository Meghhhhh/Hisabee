import { useState } from "react";
import { Link } from "react-router";
import { logoImg } from "../constants/index1";
import { CgProfile, CgHeadset } from "react-icons/cg";
import { CiBellOn, CiLogout } from "react-icons/ci";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { Plus } from "lucide-react";
import { useSelector } from "react-redux";

const Navbar = () => {
	const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
	const [menuOpen, setMenuOpen] = useState(false);
	const avatar = useSelector((state) => state.user.avatar);
	const toggleMenu = () => setMenuOpen(!menuOpen);

	return (
		<header className="w-full px-3 py-3 sm:px-5 md:px-6 lg:px-8 xl:px-10 flex justify-center items-center bg-[#0b0b0f]">
			<nav className="w-full h-8 sm:h-[25px] flex items-center screen-max-width gap-6">
				{/* Logo */}
				<Link to="/home" className="flex-shrink-0">
					<img src={logoImg} alt="logo-hisabee" width={37} height={25} />
				</Link>

				{/* Desktop Nav */}
				<div className="flex-1 flex justify-end items-center gap-2 sm:gap-3 lg:gap-4">
					{/* Support Button - Always visible */}
					<a
						href="/support"
						className="hidden sm:flex items-center gap-1 px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-400/20 text-white hover:from-blue-500/30 hover:to-cyan-500/30 transition-colors"
					>
						<CgHeadset size={20} />
						<span>About</span>
					</a>
					<a
						href="/support"
						className="hidden sm:flex items-center gap-1 px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-400/20 text-white hover:from-blue-500/30 hover:to-cyan-500/30 transition-colors"
					>
						<CgHeadset size={20} />
						<span>Support</span>
					</a>
					{/* New Hisab Button: Only visible when logged in */}
					{isLoggedIn && (
						<Link
							to="/newhisab"
							className="hidden sm:flex items-center gap-1 px-2 sm:px-3 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg border border-indigo-400/20 text-white hover:from-indigo-600/20 hover:to-purple-600/20 transition-colors"
						>
							<Plus size={18} />
							<span>New Hisab</span>
						</Link>
					)}
					{/* Auth buttons */}
					{isLoggedIn ? (
						<div className="flex gap-2 sm:gap-4">
							<Link to="/profile" title="Profile">
								<img src={avatar} alt="profile" className="w-7 h-7 rounded-full" />
							</Link>
							<Link to="/notifications" title="Notifications">
								<CiBellOn
									className="text-white hover:text-cyan-300"
									size={30}
								/>
							</Link>
							{/* <Link to="/logout" title="Logout">
								<CiLogout className="text-white hover:text-red-300" size={24} />
							</Link> */}
						</div>
					) : (
						<Link
							to="/signup"
							className="text-base sm:text-lg lg:text-xl text-white hover:text-gray-300 transition-colors"
						>
							Login
						</Link>
					)}
				</div>

				{/* Mobile Hamburger Menu */}
				<button
					className="sm:hidden ml-auto focus:outline-none"
					onClick={toggleMenu}
				>
					{menuOpen ? (
						<RiCloseLine size={24} className="text-white" />
					) : (
						<RiMenu3Line size={24} className="text-white" />
					)}
				</button>

				{/* Mobile Menu Overlay */}
				{menuOpen && (
					<div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
						<div className="bg-[#0b0b0f] rounded-xl p-6 max-w-xs w-full text-center space-y-4">
							{/* Support Button */}
							<Link
								to="/support"
								className="block py-2 px-4 text-lg text-white bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/20 hover:from-blue-500/30 hover:to-cyan-500/30 rounded-lg transition-colors"
								onClick={toggleMenu}
							>
								Support
							</Link>
							{/* New Hisab Button: Only when logged in */}
							{isLoggedIn && (
								<Link
									to="/newhisab"
									className="block py-2 px-4 text-lg text-white bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/20 hover:from-indigo-600/20 hover:to-purple-600/20 rounded-lg transition-colors"
									onClick={toggleMenu}
								>
									New Hisab
								</Link>
							)}
							{/* Auth buttons */}
							{isLoggedIn ? (
								<div className="flex justify-center gap-6 pt-4">
									<Link
										to="/profile"
										className="p-2 bg-gray-700 rounded-full"
										onClick={toggleMenu}
									>
										<img src={avatar} alt="profile" className="w-8 h-8 rounded-full" />
									</Link>
									<Link
										to="/notifications"
										className="p-2 bg-gray-700 rounded-full"
										onClick={toggleMenu}
									>
										<CiBellOn size={28} className="text-white" />
									</Link>
									<Link
										to="/logout"
										className="p-2 bg-gray-700 rounded-full"
										onClick={toggleMenu}
									>
										<CiLogout size={28} className="text-white" />
									</Link>
								</div>
							) : (
								<Link
									to="/signup"
									className="block py-2 px-4 text-lg text-white hover:bg-gray-700 rounded transition-colors"
									onClick={toggleMenu}
								>
									Login
								</Link>
							)}
						</div>
					</div>
				)}
			</nav>
		</header>
	);
};

export default Navbar;
