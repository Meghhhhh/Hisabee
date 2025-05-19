import Navbar from '../components/Navbar';
import Intro from '../components/Intro';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const getCurrUser = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/current-user`,
        {
          withCredentials: true,
        },
      );

      if(response.status < 300){
        setIsLoggedIn(true);
      } 
    };

    getCurrUser();
  }, []);

  return (
    <main className="bg-black  w-full h-full">
      <Navbar isLoggedIn={isLoggedIn}/>
      <div className="bg-black w-full h-full">
        <Intro />
      </div>
      <Footer />
    </main>
  );
};

export default Home;
