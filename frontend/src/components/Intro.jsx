import { homevid } from "../constants/index1"
import { Link } from 'react-router';
import { useState } from 'react';
import Dashboard from './Dashboard';

const Intro = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {isLoggedIn ? (
        <>
          <Dashboard />
        </>
      ) : (
        <div>
          <div className="flex flex-col justify-center items-center">
            <p className="text-green-500 text-sm mt-20 font-roboto font-bold">
              For friends who needs Financing!!
            </p>
            <h1 className="text-white mt-5 text-5xl font-roboto font-bold">
              Grow on your Trips.
            </h1>
            <p className="text-white mt-5 text-3xl font-roboto font-bold">
              Financing Made Fast and Flexible, Wherever You Travel
            </p>
            <p className="text-gray-400 mt-10 text-sm font-roboto">
              Simplify spending, track expenses, and travel stress-free.
            </p>
            <p className="text-gray-400 mt-2 text-sm font-roboto">
              Hisabee transforms the way you manage finances on your trips.
            </p>
          </div>
          <div className="flex justify-center items-center mt-10">
           <Link to={"/Register"}>
            <button className="w-35 h-10 bg-green-400 cursor-pointer">
                Get Started! →
            </button>
          </Link>
          </div>
          <div className="flex justify-center items-center mt-6">
            <div className="bg-gray-700 w-[75%] h-90 rounded-lg flex justify-center items-center">
              <video
                src={homevid} // puting a demo of dashboard
                autoPlay
                loop
                muted
                className=" w-[95%] h-[95%] object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Intro;
