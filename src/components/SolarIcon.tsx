
import React from 'react';

const SolarIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16 text-solar-primary" }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className} 
      fill="none"
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="7" r="2" />
      <path d="M12 3v2" />
      <path d="M12 9v2" />
      <path d="M6.3 6.3l1.4 1.4" />
      <path d="M16.3 6.3l-1.4 1.4" />
      <path d="M8 12H4" />
      <path d="M20 12h-4" />
      <path d="m6 16 6 2v4" />
      <path d="m18 16-6 2" />
      <rect x="4" y="13" width="16" height="3" />
    </svg>
  );
};

export default SolarIcon;
