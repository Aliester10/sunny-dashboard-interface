
import React from 'react';
import { Thermometer, Battery, Sun, Zap, Gauge } from 'lucide-react';

export interface SensorData {
  temperature: number;
  voltage: number;
  current: number;
  power: number;
  lightIntensity: number;
  batteryCapacity: number;
}

interface SensorDisplayProps {
  data: SensorData;
  compact?: boolean;
}

const SensorDisplay: React.FC<SensorDisplayProps> = ({ data, compact = true }) => {
  const sensorCards = [
    { 
      icon: Thermometer, 
      value: data.temperature.toFixed(1), 
      unit: '°C', 
      label: 'Panel Temperature' 
    },
    { 
      icon: Gauge, 
      value: data.voltage.toFixed(1), 
      unit: 'V', 
      label: 'Panel Voltage' 
    },
    { 
      icon: Zap, 
      value: data.current.toFixed(1), 
      unit: 'A', 
      label: 'Panel Current' 
    },
    { 
      icon: Zap, 
      value: Math.round(data.power).toString(), 
      unit: 'W', 
      label: 'Generated Power' 
    },
    { 
      icon: Sun, 
      value: Math.round(data.lightIntensity).toString(), 
      unit: 'LUX', 
      label: 'Light Intensity' 
    },
    { 
      icon: Battery, 
      value: Math.round(data.batteryCapacity).toString(), 
      unit: '%', 
      label: 'Battery Capacity' 
    }
  ];

  if (compact) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-md animate-fade-in">
        <div className="grid grid-cols-2 gap-4">
          {sensorCards.slice(0, 4).map((sensor, index) => (
            <div key={index} className="bg-solar-cardBg rounded-lg p-3 flex items-center space-x-2">
              <sensor.icon className="text-solar-primary w-5 h-5" />
              <div className="font-lcd text-2xl tracking-wider text-solar-displayText">{sensor.value}</div>
              <div className="text-xs text-gray-500 self-end mb-1">{sensor.unit}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center mt-4 text-solar-primary">
          <Zap className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Realtime Sensors</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensorCards.map((sensor, index) => (
          <div key={index} className="sensor-card">
            <sensor.icon className="sensor-icon" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">{sensor.label}</span>
              <div className="flex items-baseline">
                <div className="sensor-value">{sensor.value}</div>
                <span className="sensor-unit">{sensor.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center mt-6 text-solar-primary">
        <Zap className="w-5 h-5 mr-2" />
        <span className="text-sm font-medium">Realtime Monitoring</span>
      </div>
    </div>
  );
};

export default SensorDisplay;
