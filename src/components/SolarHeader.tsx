
import React, { useState, useEffect } from 'react';
import { SunIcon } from "lucide-react";

const SolarHeader: React.FC = () => {
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();

      // Set greeting based on time of day
      if (hours >= 5 && hours < 12) {
        setGreeting("Good Morning!");
      } else if (hours >= 12 && hours < 18) {
        setGreeting("Good Afternoon!");
      } else {
        setGreeting("Good Evening!");
      }

      // Format time as HH:MM:SS
      const timeString = now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      // Format date as DD MMM YYYY
      const dateString = now.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };

    // Update immediately and then every second
    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="p-4 md:p-6 flex justify-between items-center animate-fade-in border-b border-gray-100">
      <div className="hidden md:block">
        <h2 className="text-lg font-medium text-gray-800">{greeting}</h2>
        <p className="text-sm text-gray-500">{currentDate}</p>
      </div>

      <div className="flex flex-col items-center mx-auto md:mx-0">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/7b1140d8-b2c5-4b3c-89da-49cd5e78467f.png" 
            alt="Umalo Logo" 
            className="h-6 w-auto"
          />
          <h1 className="text-lg font-semibold text-gray-700">Smart Solar Tracker</h1>
        </div>
        <div className="text-xs text-gray-500">Powered By Umalo</div>
      </div>

      <div className="hidden md:block text-right">
        <div className="text-lg font-medium text-gray-800">{currentTime}</div>
        <div className="text-xs text-gray-500">Western Indonesia Time</div>
      </div>
    </header>
  );
};

export default SolarHeader;
