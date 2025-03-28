import React from "react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartDisplayProps {
  title: string;
  data: any[];
  type: "line" | "area" | "bar";
  dataKey: string;
  color?: string;
  additionalDataKeys?: Array<{ key: string; color: string }>;
}

const ChartDisplay: React.FC<ChartDisplayProps> = ({
  title,
  data,
  type,
  dataKey,
  color = "#10b981",
  additionalDataKeys = [],
}) => {
  return (
    <Card className="p-4 h-full animate-fade-in">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {type === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              {additionalDataKeys.map((addKey, i) => (
                <Line
                  key={i}
                  type="monotone"
                  dataKey={addKey.key}
                  stroke={addKey.color}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          ) : type === "area" ? (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                fill={color}
                fillOpacity={0.3}
              />
              {additionalDataKeys.map((addKey, i) => (
                <Area
                  key={i}
                  type="monotone"
                  dataKey={addKey.key}
                  stroke={addKey.color}
                  fill={addKey.color}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
              {additionalDataKeys.map((addKey, i) => (
                <Bar
                  key={i}
                  dataKey={addKey.key}
                  fill={addKey.color}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ChartDisplay;
