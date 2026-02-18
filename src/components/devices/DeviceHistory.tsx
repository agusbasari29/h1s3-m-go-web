import React from "react";
import { Card, CardHeader, CardBody } from "@/components/ui";
import {
  DeviceHistory as DeviceHistoryType,
  DeviceStatus,
} from "@/types/device";
import { DeviceStatusIndicator } from "./DeviceStatusIndicator";
import { Clock, AlertCircle, Info } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export interface DeviceHistoryProps {
  history: DeviceHistoryType[];
  className?: string;
}

export const DeviceHistory: React.FC<DeviceHistoryProps> = ({
  history,
  className,
}) => {
  const getEventIcon = (status: DeviceStatus, event?: string) => {
    if (status === DeviceStatus.ERROR || status === DeviceStatus.WARNING) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
    if (event) {
      return <Info className="h-4 w-4 text-blue-500" />;
    }
    return <Clock className="h-4 w-4 text-gray-400" />;
  };

  const getStatusBadgeVariant = (
    status: DeviceStatus,
  ): "online" | "offline" | "warning" | "error" | "maintenance" => {
    switch (status) {
      case DeviceStatus.ONLINE:
        return "online";
      case DeviceStatus.OFFLINE:
        return "offline";
      case DeviceStatus.WARNING:
        return "warning";
      case DeviceStatus.ERROR:
        return "error";
      case DeviceStatus.MAINTENANCE:
        return "maintenance";
      default:
        return "offline";
    }
  };

  if (history.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <h3 className="text-lg font-semibold">Device History</h3>
        </CardHeader>
        <CardBody>
          <div className="py-8 text-center text-gray-500">
            No history available
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="text-lg font-semibold">Device History</h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  {getEventIcon(item.status, item.event)}
                </div>
                {history.indexOf(item) < history.length - 1 && (
                  <div className="h-full w-0.5 bg-gray-200" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDateTime(item.timestamp)}
                    </p>
                    {item.event && (
                      <p className="mt-1 text-sm text-gray-600">{item.event}</p>
                    )}
                  </div>
                  <DeviceStatusIndicator status={item.status} showLabel />
                </div>
                {item.metrics && (
                  <div className="mt-2 flex gap-4 text-xs text-gray-500">
                    <span>CPU: {item.metrics.cpu}%</span>
                    <span>Memory: {item.metrics.memory}%</span>
                    <span>Disk: {item.metrics.disk}%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
