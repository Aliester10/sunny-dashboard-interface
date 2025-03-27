
import React, { useState, useEffect } from 'react';
import { Settings, SunIcon } from 'lucide-react';

interface SolarHeaderProps {
  toggleMenu?: () => void;
}

const SolarHeader: React.FC<SolarHeaderProps> = ({ toggleMenu }) => {
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      
      // Set greeting based on time of day
      if (hours >= 5 && hours < 12) {
        setGreeting('Good Morning!');
      } else if (hours >= 12 && hours < 18) {
        setGreeting('Good Afternoon!');
      } else {
        setGreeting('Good Evening!');
      }
      
      // Format time as HH:MM:SS
      const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      // Format date as DD MMM YYYY
      const dateString = now.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
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
    <header className="p-4 flex justify-between items-center animate-fade-in">
      <div className="flex items-center space-x-2">
        <button className="text-solar-primary font-medium">Cal.</button>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-2">
          <SunIcon className="h-6 w-6 text-solar-primary" />
          <h1 className="text-lg font-semibold text-gray-700">Smart Solar Tracker</h1>
        </div>
        <div className="text-xs text-gray-500">v1.3 By SolarTech</div>
      </div>
      
      <button 
        onClick={toggleMenu} 
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Settings className="h-5 w-5 text-gray-600" />
      </button>
    </header>
  );
};

export default SolarHeader;
