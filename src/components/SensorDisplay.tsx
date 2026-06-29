
import React from 'react';
import { Thermometer, Battery, Sun, Zap, Gauge } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
    }
  ];

  if (compact) {
    return (
      <div className="bg-card text-card-foreground rounded-xl p-4 shadow-md border animate-fade-in">
        <div className="grid grid-cols-2 gap-4">
          {sensorCards.map((sensor, index) => (
            <div key={index} className="bg-muted rounded-lg p-3 flex items-center space-x-2">
              <sensor.icon className="text-solar-primary w-5 h-5" />
              <div className="font-['Quartz_MS_Std', 'Digital-7', monospace] text-2xl tracking-wider text-foreground">{sensor.value}</div>
              <div className="text-xs text-muted-foreground self-end mb-1">{sensor.unit}</div>
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
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-medium">Sensor Data</h3>
        <Zap className="text-solar-primary w-5 h-5" />
      </div>
      <div className="grid grid-cols-2 gap-6">
        {sensorCards.map((sensor, index) => (
          <div key={index} className="sensor-card flex items-center space-x-4 p-4">
            <div className="bg-solar-primary/10 p-2 rounded-full">
              <sensor.icon className="sensor-icon" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">{sensor.label}</span>
              <div className="flex items-baseline">
                <div className="font-['Quartz_MS_Std', 'Digital-7', monospace] text-3xl tracking-wider text-foreground">{sensor.value}</div>
                <span className="text-xs text-muted-foreground ml-1">{sensor.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center mt-6 text-solar-primary">
        <Zap className="w-5 h-5 mr-2" />
        <span className="text-sm font-medium">Realtime Monitoring</span>
      </div>
    </Card>
  );
};

export default SensorDisplay;
