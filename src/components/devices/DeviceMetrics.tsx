import React from "react";
import { Card, CardHeader, CardBody } from "@/components/ui";
import { DeviceMetrics as DeviceMetricsType } from "@/types/device";
import { Cpu, HardDrive, Wifi, Thermometer, Clock } from "lucide-react";
import { formatBytes, formatUptime } from "@/lib/utils";

export interface DeviceMetricsProps {
  metrics: DeviceMetricsType;
  className?: string;
}

interface MetricItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color?: string;
}

const MetricItem: React.FC<MetricItemProps> = ({
  icon: Icon,
  label,
  value,
  color,
}) => (
  <div className="flex items-center gap-3">
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-lg ${color || "bg-gray-100"}`}
    >
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

const ProgressBar: React.FC<{ value: number; color?: string }> = ({
  value,
  color = "bg-blue-600",
}) => (
  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
    <div
      className={`h-full ${color} transition-all`}
      style={{ width: `${Math.min(value, 100)}%` }}
    />
  </div>
);

export const DeviceMetrics: React.FC<DeviceMetricsProps> = ({
  metrics,
  className,
}) => {
  const getColorForValue = (value: number): string => {
    if (value >= 90) return "bg-red-500";
    if (value >= 70) return "bg-yellow-500";
    return "bg-blue-600";
  };

  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="text-lg font-semibold">Device Metrics</h3>
      </CardHeader>
      <CardBody>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">CPU</span>
              <span className="font-medium">{metrics.cpu}%</span>
            </div>
            <ProgressBar
              value={metrics.cpu}
              color={getColorForValue(metrics.cpu)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Memory</span>
              <span className="font-medium">{metrics.memory}%</span>
            </div>
            <ProgressBar
              value={metrics.memory}
              color={getColorForValue(metrics.memory)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Disk</span>
              <span className="font-medium">{metrics.disk}%</span>
            </div>
            <ProgressBar
              value={metrics.disk}
              color={getColorForValue(metrics.disk)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Network</span>
              <span className="font-medium">
                ↓ {formatBytes(metrics.networkIn)} / ↑{" "}
                {formatBytes(metrics.networkOut)}
              </span>
            </div>
            <ProgressBar
              value={(metrics.networkIn + metrics.networkOut) / 10240}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {metrics.temperature && (
            <MetricItem
              icon={Thermometer}
              label="Temperature"
              value={`${metrics.temperature}°C`}
              color="bg-orange-100 text-orange-600"
            />
          )}
          <MetricItem
            icon={Clock}
            label="Uptime"
            value={formatUptime(metrics.uptime)}
            color="bg-green-100 text-green-600"
          />
        </div>
      </CardBody>
    </Card>
  );
};
