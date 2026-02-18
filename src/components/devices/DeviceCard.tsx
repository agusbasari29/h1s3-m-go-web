import React from "react";
import { Card, CardBody, Badge } from "@/components/ui";
import { Device, DeviceStatus } from "@/types/device";
import { DeviceStatusIndicator } from "./DeviceStatusIndicator";
import { Server, MapPin, Clock } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export interface DeviceCardProps {
  device: Device;
  onClick?: () => void;
  onAction?: (action: string) => void;
}

const statusVariantMap: Record<
  DeviceStatus,
  "online" | "offline" | "warning" | "error" | "maintenance"
> = {
  [DeviceStatus.ONLINE]: "online",
  [DeviceStatus.OFFLINE]: "offline",
  [DeviceStatus.WARNING]: "warning",
  [DeviceStatus.ERROR]: "error",
  [DeviceStatus.MAINTENANCE]: "maintenance",
};

export const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  onClick,
  onAction,
}) => {
  const handleViewDetails = () => {
    onClick?.();
  };

  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAction?.("restart");
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAction?.("delete");
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleViewDetails}
    >
      <CardBody>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Server className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{device.name}</h3>
              <p className="text-sm text-gray-500">{device.type}</p>
            </div>
          </div>
          <DeviceStatusIndicator status={device.status} />
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">{device.ipAddress}</span>
          </div>
          {device.location && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              <span>{device.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{formatDateTime(device.lastSeen)}</span>
          </div>
        </div>

        {device.tags && device.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {device.tags.map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleViewDetails}
            className="flex-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            View Details
          </button>
          <button
            onClick={handleRestart}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Restart
          </button>
        </div>
      </CardBody>
    </Card>
  );
};
