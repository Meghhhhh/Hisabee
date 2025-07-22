import { homevid } from '../constants/index1';
import React from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import Dashboard from "./Dashboard";

const Intro = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (isLoggedIn) return <Dashboard />;

  return (
    <div className="min-h-screen px-6 py-12 bg-black text-white relative overflow-hidden">
      {/* Animated background (green theme) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-emerald-500/20 to-green-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-80 h-80 bg-gradient-to-r from-green-400/20 to-cyan-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating green particles */}
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

      <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col justify-center items-center min-h-[90vh]">
        <p className="text-emerald-400 text-lg mb-2 font-roboto font-light tracking-wider">
          For friends who need financing!
        </p>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent font-roboto">
          Grow on your Trips
        </h1>
        <p className="text-xl md:text-2xl leading-relaxed text-white/80 font-roboto mb-8">
          Financing Made Fast and Flexible, Wherever You Travel
        </p>

        <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-8 mb-8 border border-white/10 shadow-lg hover:scale-105 transition-transform duration-300 w-full max-w-lg">
          <p className="text-gray-300 text-lg mb-1 font-roboto">
            Simplify spending, track expenses, and travel stress-free.
          </p>
          <p className="text-gray-300 text-lg font-roboto">
            Hisabee transforms the way you manage finances on your trips.
          </p>
        </div>

        <Link to="/register">
          <button className="px-8 py-3 mt-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full font-semibold text-white hover:from-emerald-600 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-emerald-500/30">
            Get Started →
          </button>
        </Link>

        <div className="mt-14 mb-12 w-full animate-fadeIn">
          <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            <video
              src={homevid}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
