import React from "react";

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
    <div className="p-6 h-full animate-fade-in flex flex-col text-slate-300">
      <h3 className="text-lg font-medium mb-6 text-slate-200 tracking-wide">{title}</h3>
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
    </div>
  );
};

export default ChartDisplay;
