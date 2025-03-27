
import React, { useState, useEffect } from 'react';
import SolarHeader from '@/components/SolarHeader';
import StatusIndicator from '@/components/StatusIndicator';
import SensorDisplay, { SensorData } from '@/components/SensorDisplay';
import SolarSidebar from '@/components/SolarSidebar';
import ChartDisplay from '@/components/ChartDisplay';
import BatteryStatus from '@/components/BatteryStatus';
import LogTable from '@/components/LogTable';
import SolarIcon from '@/components/SolarIcon';
import { useIsMobile } from '@/hooks/use-mobile';

// Sample data for charts
const generateChartData = () => {
  const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
  return hours.map(hour => ({
    name: hour,
    power: Math.floor(Math.random() * 200) + 100,
    voltage: Math.floor(Math.random() * 10) + 25,
    current: (Math.random() * 4 + 1).toFixed(1),
    light: Math.floor(Math.random() * 1500) + 200
  }));
};

// Sample log data
const sampleLogs = [
  {
    timestamp: '08:32:14',
    event: 'System Boot',
    type: 'info' as const
  },
  {
    timestamp: '09:15:22',
    event: 'Maximum Power Reached',
    type: 'success' as const,
    value: '245W'
  },
  {
    timestamp: '12:45:01',
    event: 'Battery Low',
    type: 'warning' as const,
    value: '15%'
  },
  {
    timestamp: '14:30:55',
    event: 'Voltage Fluctuation',
    type: 'warning' as const,
    value: '28.3V'
  },
  {
    timestamp: '16:03:12',
    event: 'Temperature High',
    type: 'error' as const,
    value: '75°C'
  },
  {
    timestamp: '17:22:34',
    event: 'Light Intensity Peak',
    type: 'info' as const,
    value: '1254 LUX'
  }
];

const Index = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 41.4,
    voltage: 27.8,
    current: 3.6,
    power: 100.1,
    lightIntensity: 891,
    batteryCapacity: 78
  });
  const [chartData, setChartData] = useState(generateChartData());
  
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Dashboard':
        return (
          <div className="space-y-6">
            {!isMobile && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SensorDisplay data={sensorData} compact={false} />
                <div className="lg:col-span-2">
                  <BatteryStatus 
                    level={Math.round(sensorData.batteryCapacity)} 
                    isCharging={sensorData.lightIntensity > 300} 
                  />
                </div>
              </div>
            )}
            
            {isMobile && (
              <>
                <div className="flex justify-center my-8">
                  <SolarIcon />
                </div>
                <SensorDisplay data={sensorData} compact={true} />
              </>
            )}
          </div>
        );
        
      case 'Historical Graphs':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartDisplay 
                title="Power Generation (Watts)" 
                data={chartData} 
                type="area" 
                dataKey="power" 
                color="#10b981" 
              />
              <ChartDisplay 
                title="Light Intensity (LUX)" 
                data={chartData} 
                type="line" 
                dataKey="light" 
                color="#f59e0b" 
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartDisplay 
                title="Voltage & Current" 
                data={chartData} 
                type="line" 
                dataKey="voltage" 
                color="#3b82f6"
                additionalDataKeys={[{ key: "current", color: "#8b5cf6" }]} 
              />
              <LogTable logs={sampleLogs} />
            </div>
          </div>
        );
        
      case 'System Settings':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">System Settings</h3>
                <p className="text-gray-500">Settings panel is under construction.</p>
              </Card>
            </div>
          </div>
        );
        
      case 'Notifications':
        return (
          <div className="space-y-6">
            <LogTable logs={sampleLogs} />
          </div>
        );
        
      default:
        return null;
    }
  };

  const now = new Date();
  const timestamp = `${now.getDate().toString().padStart(2, '0')} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()} - ${now.toTimeString().slice(0, 8)} WIB`;

  return (
    <div className="min-h-screen bg-solar-background">
      <div className="flex">
        {!isMobile && (
          <SolarSidebar 
            isOpen={sidebarOpen} 
            toggleSidebar={toggleSidebar} 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
          />
        )}
        
        <div className="flex-1 flex flex-col min-h-screen">
          <SolarHeader toggleMenu={toggleSidebar} />
          
          <StatusIndicator status="online" timestamp={timestamp} />
          
          <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
            {renderContent()}
          </main>
        </div>
      </div>
      
      {isMobile && (
        <SolarSidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar} 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />
      )}
    </div>
  );
};

// Helper component for System Settings
const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-xl p-4 shadow-md ${className}`}>
      {children}
    </div>
  );
};

export default Index;
