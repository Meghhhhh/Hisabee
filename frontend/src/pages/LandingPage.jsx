import React, { useRef, useEffect, useState } from 'react';
import { IoIosArrowUp } from 'react-icons/io';

const LandingPage = () => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: -9999, y: -9999 });

  useEffect(() => {
    const handleMouseMove = e => {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const gridSize = 30;
  const rows = Math.floor(window.innerHeight / gridSize);
  const cols = Math.floor(window.innerWidth / gridSize);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden"
    >
      {/* Dots Grid */}
      <div className="absolute inset-0">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex">
            {Array.from({ length: cols }).map((_, colIdx) => {
              const dotX = colIdx * gridSize + gridSize / 2;
              const dotY = rowIdx * gridSize + gridSize / 2;
              const distance = Math.hypot(
                mousePosition.x - dotX,
                mousePosition.y - dotY,
              );
              const maxDistance = 250;

              let baseOpacity = 0.2;
              let activeOpacity = Math.max(0, 1 - distance / maxDistance);
              const finalOpacity = Math.max(baseOpacity, activeOpacity);

              return (
                <div
                  key={colIdx}
                  className="w-[30px] h-[30px] flex items-center justify-center"
                >
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: `rgba(0, 122, 255, ${finalOpacity})`,
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="w-full h-full absolute border-2 flex justify-evenly items-center">
        {/* left most about us  */}
        <div className="z-10 items-center justify-center text-white text-xl font-bold font-[Montserrat] max-w-[460px]">
          <div className="text-[#ffd500] text-5xl">Split. Track. Relax.</div>
          <div className="text-[#48cae4] text-4xl my-4">Hisabee</div>
          <div className='pl-[1.5rem]'>
            <ul className="list-disc list-inside space-y-2">
              <li style={{ textIndent: '-1.5rem' }}>
                Effortlessly split expenses with friends.
              </li>
              <li style={{ textIndent: '-1.5rem' }}>
                Monitor your group's budget in real-time.
              </li>
              <li style={{ textIndent: '-1.5rem' }}>
                Stay organized and avoid last-minute confusion.
              </li>
              <li style={{ textIndent: '-1.5rem' }}>
                Travel smarter, stress less, and make memories.
              </li>
            </ul>
          </div>

          <div className="mt-4">
            <button className="capsule-button">Get Started</button>
            <button className="capsule-button">Login now</button>
          </div>
        </div>

        {/* the arrow part  */}
        <div className="absolute top-[250px] left-[600px] flex flex-col space-y-0">
          <IoIosArrowUp className="text-blue-600 -my-6" size={100} />
          <IoIosArrowUp className="text-blue-600 -my-6" size={100} />
          <IoIosArrowUp className="text-blue-600 -my-6" size={100} />
          <IoIosArrowUp className="text-blue-600 -my-6" size={100} />
        </div>

        {/* image part  */}
        <div className="">
          <img src="./Subject2.png" alt="Travel" className="w-[700px]" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
