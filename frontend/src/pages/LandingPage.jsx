import React, { useRef, useEffect, useState } from 'react';

const LandingPage = () => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: -9999, y: -9999 });

  useEffect(() => {
    const handleMouseMove = (e) => {
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
              const distance = Math.hypot(mousePosition.x - dotX, mousePosition.y - dotY);
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
      <div className="relative z-10 flex items-center justify-center h-full text-white text-4xl font-bold pointer-events-none">
        LandingPage
      </div>
    </div>
  );
};

export default LandingPage;
