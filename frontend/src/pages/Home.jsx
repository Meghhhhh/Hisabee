import Navbar from "../components/Navbar";
import Intro from "../components/Intro";
import Footer from "../components/Footer";
import { useCurrentUser } from "../hooks/useCurrentUser";

// If you want even more responsive control
const Home = () => {
	const { loading, isLoggedIn } = useCurrentUser();

	if (loading) {
		return (
			<main className="bg-black w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
				<div className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl animate-pulse text-center max-w-md">
					<div className="mb-4">
						<div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					</div>
					Loading...
				</div>
			</main>
		);
	}

	return (
		<main className="bg-black w-full min-h-screen flex flex-col">
			<header className="flex-shrink-0">
				<Navbar isLoggedIn={isLoggedIn} />
			</header>
			<section className="flex-1 w-full bg-black overflow-hidden">
				<Intro />
			</section>
			<footer className="flex-shrink-0">
				<Footer />
			</footer>
		</main>
	);
};

export default Home;
