
import React, { useState, useEffect } from 'react';
import SolarHeader from '@/components/SolarHeader';
import StatusIndicator from '@/components/StatusIndicator';
import SensorDisplay, { SensorData } from '@/components/SensorDisplay';
import BatteryStatus from '@/components/BatteryStatus';
import SolarIcon from '@/components/SolarIcon';
import PowerGenerationCard from '@/components/PowerGenerationCard';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 41.4,
    voltage: 27.8,
    current: 3.6,
    power: 100.1,
    lightIntensity: 891,
    batteryCapacity: 78
  });
  
  useEffect(() => {
    // Simulate sensor data updates every 3 seconds
    const interval = setInterval(() => {
      setSensorData(prev => ({
        temperature: parseFloat((prev.temperature + (Math.random() * 0.6 - 0.3)).toFixed(1)),
        voltage: parseFloat((prev.voltage + (Math.random() * 0.4 - 0.2)).toFixed(1)),
        current: parseFloat((prev.current + (Math.random() * 0.2 - 0.1)).toFixed(1)),
        power: parseFloat((prev.voltage * prev.current).toFixed(1)),
        lightIntensity: Math.max(100, Math.min(1500, prev.lightIntensity + Math.floor(Math.random() * 40 - 20))),
        batteryCapacity: Math.max(0, Math.min(100, prev.batteryCapacity + (Math.random() > 0.7 ? 1 : -1)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const now = new Date();
  const timestamp = `${now.getDate().toString().padStart(2, '0')} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()} - ${now.toTimeString().slice(0, 8)} WIB`;

  return (
    <div className="min-h-screen bg-solar-background">
      <SolarHeader />
      <StatusIndicator status="online" timestamp={timestamp} />
      
      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        {isMobile ? (
          <>
            <div className="flex justify-center my-6">
              <SolarIcon className="w-36 h-36 text-solar-primary" />
            </div>
            <SensorDisplay data={sensorData} compact={true} />
            <PowerGenerationCard power={sensorData.power} />
            <BatteryStatus 
              level={Math.round(sensorData.batteryCapacity)} 
              isCharging={sensorData.lightIntensity > 300} 
            />
          </>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-center my-4">
              <SolarIcon className="w-40 h-40 text-solar-primary" />
            </div>
            
            {/* SensorDisplay now at the top */}
            <div className="grid grid-cols-1 gap-6">
              <SensorDisplay data={sensorData} compact={false} />
            </div>
            
            {/* PowerGenerationCard and BatteryStatus below */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-1 lg:col-span-2">
                <PowerGenerationCard power={sensorData.power} />
              </div>
              <div className="lg:col-span-1">
                <BatteryStatus 
                  level={Math.round(sensorData.batteryCapacity)} 
                  isCharging={sensorData.lightIntensity > 300} 
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
