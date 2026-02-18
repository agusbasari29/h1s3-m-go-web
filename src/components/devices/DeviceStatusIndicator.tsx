import React from "react";
import { cn } from "@/lib/utils";
import { DeviceStatus } from "@/types/device";

export interface DeviceStatusIndicatorProps {
  status: DeviceStatus;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const statusColors: Record<DeviceStatus, string> = {
  [DeviceStatus.ONLINE]: "bg-green-500",
  [DeviceStatus.OFFLINE]: "bg-gray-400",
  [DeviceStatus.WARNING]: "bg-yellow-500",
  [DeviceStatus.ERROR]: "bg-red-500",
  [DeviceStatus.MAINTENANCE]: "bg-purple-500",
};

const statusLabels: Record<DeviceStatus, string> = {
  [DeviceStatus.ONLINE]: "Online",
  [DeviceStatus.OFFLINE]: "Offline",
  [DeviceStatus.WARNING]: "Warning",
  [DeviceStatus.ERROR]: "Error",
  [DeviceStatus.MAINTENANCE]: "Maintenance",
};

const sizeClasses = {
  sm: "h-2 w-2",
  md: "h-3 w-3",
  lg: "h-4 w-4",
};

export const DeviceStatusIndicator: React.FC<DeviceStatusIndicatorProps> = ({
  status,
  showLabel = false,
  size = "md",
  className,
}) => {
  const isOnline = status === DeviceStatus.ONLINE;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="relative flex">
        <span
          className={cn(
            "inline-flex rounded-full",
            sizeClasses[size],
            statusColors[status],
          )}
        />
        {isOnline && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              sizeClasses[size],
              statusColors[status],
            )}
          />
        )}
      </span>
      {showLabel && (
        <span className="text-sm font-medium text-gray-600">
          {statusLabels[status]}
        </span>
      )}
    </div>
  );
};
