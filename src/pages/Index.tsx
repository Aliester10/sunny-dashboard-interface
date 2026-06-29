
import React, { useState, useEffect } from 'react';
import SolarHeader from '@/components/SolarHeader';
import ChartDisplay from '@/components/ChartDisplay';
import LogTable from '@/components/LogTable';
import MetricCard from '@/components/MetricCard';
import { Zap, Battery, Gauge, Zap as ZapIcon, Activity } from 'lucide-react';

const Index = () => {
  const [sensorData, setSensorData] = useState({
    voltage: 27.8,
    current: 3.6,
    power: 100.1,
    batteryCapacity: 78,
    load: 65.2
  });

  const [chartData, setChartData] = useState<any[]>(Array.from({ length: 20 }, (_, i) => ({
    name: new Date(Date.now() - (20 - i) * 3000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    power: Math.floor(Math.random() * 20 + 80),
  })));

  const [dailyLogs] = useState<any[]>([
    { timestamp: 'Hari ini 12:00', power: '102.5 W', load: '65.2 W', voltage: '28.1 V', current: '3.6 A', battery: '76 %' },
    { timestamp: 'Hari ini 09:00', power: '98.0 W', load: '62.4 W', voltage: '27.5 V', current: '3.5 A', battery: '71 %' },
    { timestamp: 'Kemarin 16:00', power: '105.2 W', load: '70.1 W', voltage: '28.4 V', current: '3.7 A', battery: '82 %' },
    { timestamp: 'Kemarin 08:00', power: '85.4 W', load: '45.8 W', voltage: '26.8 V', current: '3.1 A', battery: '65 %' },
  ]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => {
        const newVoltage = parseFloat((prev.voltage + (Math.random() * 0.4 - 0.2)).toFixed(1));
        const newCurrent = parseFloat((prev.current + (Math.random() * 0.2 - 0.1)).toFixed(1));
        const newPower = parseFloat((newVoltage * newCurrent).toFixed(1));
        const newLoad = parseFloat(Math.max(20, Math.min(150, prev.load + (Math.random() * 10 - 5))).toFixed(1));
        const isCharging = newPower > newLoad;
        
        setChartData(currentChart => {
          const newChart = [...currentChart, {
            name: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            power: newPower
          }];
          if (newChart.length > 20) newChart.shift();
          return newChart;
        });

        return {
          voltage: newVoltage,
          current: newCurrent,
          power: newPower,
          batteryCapacity: Math.max(0, Math.min(100, prev.batteryCapacity + (isCharging ? (Math.random() * 0.5) : -(Math.random() * 0.5)))),
          load: newLoad
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Determine battery color based on capacity
  const batteryColor = sensorData.batteryCapacity > 60 ? 'from-emerald-400 to-green-600' : 
                       sensorData.batteryCapacity > 20 ? 'from-yellow-400 to-orange-500' : 
                       'from-red-400 to-rose-600';

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <SolarHeader />
      
      {/* Optional decorative background elements */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <main className="p-4 md:p-8 max-w-[1400px] mx-auto relative z-10">
        <div className="space-y-6 md:space-y-8">
          
          {/* Top Row: 5 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
            <MetricCard 
              title="Power Generation" 
              value={Math.round(sensorData.power)} 
              unit="W" 
              icon={Zap} 
              gradient="from-emerald-400 to-cyan-500"
              subtitle="Real-time output"
            />
            <MetricCard 
              title="Battery Status" 
              value={Math.round(sensorData.batteryCapacity)} 
              unit="%" 
              icon={Battery} 
              gradient={batteryColor}
              subtitle={sensorData.power >= sensorData.load ? "⚡ Charging" : "🔋 Discharging"}
            />
            <MetricCard 
              title="Panel Voltage" 
              value={sensorData.voltage.toFixed(1)} 
              unit="V" 
              icon={Gauge} 
              gradient="from-blue-400 to-indigo-500"
              subtitle="System voltage"
            />
            <MetricCard 
              title="Panel Current" 
              value={sensorData.current.toFixed(1)} 
              unit="A" 
              icon={ZapIcon} 
              gradient="from-purple-400 to-pink-500"
              subtitle="System current"
            />
            <MetricCard 
              title="Load Consumption" 
              value={sensorData.load.toFixed(1)} 
              unit="W" 
              icon={Activity} 
              gradient="from-orange-400 to-red-500"
              subtitle="Power usage"
            />
          </div>

          {/* Bottom Row: Charts and Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="glass-panel p-1 h-full">
                <ChartDisplay 
                  title="Power Generation Histori (W)" 
                  data={chartData} 
                  type="area" 
                  dataKey="power" 
                  color="#10b981" 
                />
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="glass-panel p-1 h-full">
                <LogTable logs={dailyLogs} />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Index;
