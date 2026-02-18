import React from "react";
import { Card, CardHeader, CardBody } from "@/components/ui";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export interface DeviceChartProps {
  data: Array<{ time: string; value: number }>;
  title?: string;
  dataKey?: string;
  color?: string;
  type?: "line" | "area";
  className?: string;
}

export const DeviceChart: React.FC<DeviceChartProps> = ({
  data,
  title = "Performance",
  dataKey = "value",
  color = "#3b82f6",
  type = "line",
  className,
}) => {
  const ChartComponent = type === "area" ? AreaChart : LineChart;

  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="text-lg font-semibold">{title}</h3>
      </CardHeader>
      <CardBody>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                formatter={(value) => [`${value}%`, title]}
              />
              {type === "area" ? (
                <Area
                  type="monotone"
                  dataKey={dataKey}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.3}
                />
              ) : (
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              )}
            </ChartComponent>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};

export interface DeviceChartsProps {
  cpuData?: Array<{ time: string; value: number }>;
  memoryData?: Array<{ time: string; value: number }>;
  networkData?: Array<{ time: string; value: number }>;
  className?: string;
}

export const DeviceCharts: React.FC<DeviceChartsProps> = ({
  cpuData = [],
  memoryData = [],
  networkData = [],
  className,
}) => {
  return (
    <div className={`grid gap-4 ${className}`}>
      {cpuData.length > 0 && (
        <DeviceChart
          data={cpuData}
          title="CPU Usage"
          dataKey="cpu"
          color="#3b82f6"
          type="area"
        />
      )}
      {memoryData.length > 0 && (
        <DeviceChart
          data={memoryData}
          title="Memory Usage"
          dataKey="memory"
          color="#8b5cf6"
          type="area"
        />
      )}
      {networkData.length > 0 && (
        <DeviceChart
          data={networkData}
          title="Network Traffic"
          dataKey="network"
          color="#10b981"
          type="line"
        />
      )}
    </div>
  );
};
