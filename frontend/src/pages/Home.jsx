import Navbar from '../components/Navbar';
import Intro from '../components/Intro';
import Footer from '../components/Footer';
import { useCurrentUser } from '../hooks/useCurrentUser';

const Home = () => {
  const { loading, isLoggedIn } = useCurrentUser();

  if (loading) {
    return (
      <main className="bg-black w-full h-screen flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading...</div>
      </main>
    );
  }

  return (
    <main className="bg-black w-full h-full">
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="bg-black w-full h-full">
        <Intro />
      </div>
      <Footer />
    </main>
  );
};

export default Home;
