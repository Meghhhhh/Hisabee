import Navbar from '../components/Navbar';
import Intro from '../components/Intro';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getCurrUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API_URL}/user/current-user`,
          {
            withCredentials: true,
          },
        );

        if (response.status < 300) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setLoading(false);
      }
    };

    getCurrUser();
  }, []);

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
