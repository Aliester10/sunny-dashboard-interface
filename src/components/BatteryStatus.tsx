
import React from "react";
import { Card } from "@/components/ui/card";
import {
  Battery,
  BatteryCharging,
  BatteryMedium,
  BatteryLow,
  BatteryWarning,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface BatteryStatusProps {
  level: number;
  isCharging: boolean;
}

const BatteryStatus: React.FC<BatteryStatusProps> = ({ level, isCharging }) => {
  const isMobile = useIsMobile();

  const getBatteryIcon = () => {
    if (isCharging) return BatteryCharging;
    if (level > 70) return Battery;
    if (level > 40) return BatteryMedium;
    if (level > 15) return BatteryLow;
    return BatteryWarning;
  };

  const BatteryIcon = getBatteryIcon();

  const getStatusColor = () => {
    if (level > 70) return "text-green-500";
    if (level > 40) return "text-yellow-500";
    if (level > 15) return "text-orange-500";
    return "text-red-500";
  };

  const getBatteryStatus = () => {
    if (isCharging) return "Charging";
    if (level > 70) return "Good";
    if (level > 40) return "Moderate";
    if (level > 15) return "Low";
    return "Critical";
  };

  if (isMobile) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-md animate-fade-in mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-medium">Battery Status</h3>
          <BatteryIcon className={`h-4 w-4 ${getStatusColor()}`} />
        </div>

        <div className="bg-solar-cardBg rounded-lg p-3 flex justify-between items-center">
          <div className="flex items-center">
            <BatteryIcon className={`h-6 w-6 ${getStatusColor()} mr-2`} />
            <div className="font-['Quartz_MS_Std', 'Digital-7', monospace] text-2xl tracking-wider text-solar-displayText">
              {level}
            </div>
            <div className="text-xs text-gray-500 self-end mb-1">%</div>
          </div>
          <div className="text-xs px-2 py-1 rounded-full bg-gray-100">
            {getBatteryStatus()}
          </div>
        </div>

        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              level > 70
                ? "bg-green-500"
                : level > 40
                ? "bg-yellow-500"
                : level > 15
                ? "bg-orange-500"
                : "bg-red-500"
            } transition-all duration-500 ease-in-out`}
            style={{ width: `${level}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6 animate-fade-in h-full flex flex-col justify-between">
      <h3 className="text-xl font-medium mb-6">Battery Status</h3>
      
      <div className="flex flex-col items-center justify-center mb-4">
        <BatteryIcon className={`h-20 w-20 ${getStatusColor()} mb-4`} />
        <div className="font-['Quartz_MS_Std', 'Digital-7', monospace] text-5xl tracking-wider">{level}%</div>
        <p className={`text-lg font-medium ${getStatusColor()} mt-2`}>{getBatteryStatus()}</p>
      </div>
      
      <div className="mt-4 h-6 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${
            level > 70
              ? "bg-green-500"
              : level > 40
              ? "bg-yellow-500"
              : level > 15
              ? "bg-orange-500"
              : "bg-red-500"
          } transition-all duration-500 ease-in-out`}
          style={{ width: `${level}%` }}
        ></div>
      </div>
      
      <div className="mt-6 text-sm text-gray-500 flex items-center justify-center">
        {isCharging ? (
          <div className="flex items-center">
            <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span>Currently charging from solar panel</span>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="h-2 w-2 bg-gray-400 rounded-full mr-2"></div>
            <span>Not currently charging</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BatteryStatus;
