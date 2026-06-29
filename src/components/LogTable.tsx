import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  power: string;
  load: string;
  voltage: string;
  current: string;
  battery: string;
}

interface LogTableProps {
  logs: LogEntry[];
}

const LogTable: React.FC<LogTableProps> = ({ logs }) => {

  return (
    <div className="p-6 h-full flex flex-col text-slate-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-white">Recent Records</h3>
        <Link to="/logs" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
          View all
        </Link>
      </div>
      
      <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
        {logs.map((log, index) => (
          <div 
            key={index} 
            className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col hover:bg-white/10 transition-colors animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex justify-between items-center w-full mb-2">
              <span className="text-xs text-slate-400 tracking-wide">{log.timestamp}</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-orange-400 border border-orange-500/20 bg-orange-500/10 px-1.5 py-0.5 rounded">L: {log.load}</span>
                <span className="text-xs font-bold text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 rounded">P: {log.power}</span>
              </div>
            </div>
            <div className="flex justify-between items-center w-full text-xs">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Volt</span>
                <span className="text-blue-300 font-medium">{log.voltage}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Amp</span>
                <span className="text-purple-300 font-medium">{log.current}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Bat</span>
                <span className="text-green-400 font-medium">{log.battery}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogTable;
