import React, { useState, useEffect } from 'react';

const SolarHeader: React.FC = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const dateString = now.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="bg-transparent relative z-20 w-full">
      <div className="max-w-[1400px] mx-auto p-4 md:px-8 md:py-6 flex justify-between items-center w-full">
        {/* Kiri: Logo */}
        <div className="flex-1 flex justify-start items-center">
          <img 
            src="/lovable-uploads/7b1140d8-b2c5-4b3c-89da-49cd5e78467f.png" 
            alt="Umalo Logo" 
            className="h-10 md:h-12 w-auto drop-shadow-md"
          />
        </div>

        {/* Tengah: Judul */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-sm whitespace-nowrap">Solar Dashboard</h1>
          <div className="hidden md:block text-[11px] text-slate-400 mt-1 uppercase tracking-widest font-medium whitespace-nowrap">Monitoring System • Powered By Umalo</div>
        </div>

        {/* Kanan: Jam dan Tanggal */}
        <div className="flex-1 hidden sm:flex flex-col items-end justify-center">
          <div 
            className="text-2xl md:text-3xl font-bold tracking-tight text-white whitespace-nowrap text-glow"
            style={{ fontFamily: "'Quartz MS Std', 'Digital-7', monospace" }}
          >
            {currentTime}
          </div>
          <div className="text-[10px] md:text-xs font-medium text-slate-400 uppercase tracking-widest mt-1 whitespace-nowrap">{currentDate}</div>
        </div>
      </div>
    </header>
  );
};

export default SolarHeader;
