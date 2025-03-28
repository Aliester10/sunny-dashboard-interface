import React from "react";
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PowerGenerationCardProps {
  power: number;
}

const PowerGenerationCard: React.FC<PowerGenerationCardProps> = ({ power }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-md animate-fade-in mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-medium">Power Generation</h3>
          <Zap className="text-solar-primary w-4 h-4" />
        </div>

        <div className="bg-solar-cardBg rounded-lg p-3 flex items-center space-x-2">
          <Zap className="text-solar-primary w-5 h-5" />
          <div className="font-['Quartz_MS_Std', 'Digital-7', monospace] text-2xl tracking-wider text-solar-displayText">
            {Math.round(power)}
          </div>
          <div className="text-xs text-gray-500 self-end mb-1">W</div>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6 h-full animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-medium">Power Generation</h3>
        <Zap className="text-solar-primary w-6 h-6" />
      </div>
<<<<<<< HEAD

      <div className="flex items-center justify-center mt-4">
        <div className="font-['Quartz_MS_Std','Digital-7',monospace] text-7xl tracking-wider text-solar-displayText bg-solar-cardBg rounded-lg px-8 py-6 shadow-inner">
=======
      
      <div className="flex flex-col items-center justify-center mt-8 mb-8">
        <div className="font-['Quartz_MS_Std','Digital-7',monospace] text-8xl tracking-wider text-solar-displayText bg-solar-cardBg rounded-lg px-10 py-8 shadow-inner">
>>>>>>> d7be7b61b93627c8deefbc6c879ad470dd32ae40
          {Math.round(power)}
        </div>
        <span className="text-2xl text-gray-500 mt-4">Watts</span>
      </div>
<<<<<<< HEAD

      <div className="mt-6 text-sm text-gray-500">
        Real-time power generation from solar panels
      </div>

=======
      
      <div className="mt-6 text-sm text-gray-500 text-center">Real-time power generation from solar panels</div>
      
>>>>>>> d7be7b61b93627c8deefbc6c879ad470dd32ae40
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm">
          <span className="font-medium text-solar-primary">Status:</span>{" "}
          Producing
        </div>
        <div className="flex items-center">
          <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse-slow mr-2"></div>
          <span className="text-sm">Active</span>
        </div>
      </div>
    </Card>
  );
};

export default PowerGenerationCard;
