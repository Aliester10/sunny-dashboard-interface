
import React from 'react';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'error';
  timestamp: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, timestamp }) => {
  const statusColor = {
    'online': 'bg-solar-primary',
    'offline': 'bg-gray-400',
    'error': 'bg-red-500'
  };
  
  const statusText = {
    'online': 'Online',
    'offline': 'Offline',
    'error': 'Error'
  };

  return (
    <div className="flex flex-col items-center mt-6 mb-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-700 mb-1">{status === 'online' ? 'Good Evening!' : 'System Status'}</h2>
      <div className="flex items-center space-x-2">
        <div className={`h-2.5 w-2.5 rounded-full ${statusColor[status]} animate-pulse-slow`}></div>
        <span className="text-solar-primary font-medium">{statusText[status]}</span>
      </div>
      <div className="text-xs text-gray-500 mt-1">{timestamp}</div>
    </div>
  );
};

export default StatusIndicator;
