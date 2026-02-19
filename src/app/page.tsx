"use client";

import Link from "next/link";
import { useDeviceStats } from "@/hooks/useDeviceStats";
import { Card, CardBody, Badge } from "@/components/ui";
import { DeviceStatusIndicator, DeviceMetrics } from "@/components/devices";
import { DeviceMetrics as DeviceMetricsType } from "@/types/device";
import {
  Server,
  Wifi,
  WifiOff,
  Activity,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
  const {
    stats,
    devices,
    healthScore,
    criticalDevices,
    averageMetrics,
    isLoading,
    isError,
  } = useDeviceStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardBody>
                <div className="animate-pulse space-y-3">
                  <div className="h-4 w-24 rounded bg-gray-200" />
                  <div className="h-8 w-16 rounded bg-gray-200" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Card>
          <CardBody>
            <div className="py-8 text-center text-red-500">
              Failed to load dashboard data. Please try again later.
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Server className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Devices</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.total ?? 0}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Wifi className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Online</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats?.online ?? 0}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <WifiOff className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Offline</p>
                <p className="text-2xl font-bold text-gray-600">
                  {stats?.offline ?? 0}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Health Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {healthScore}%
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Critical Devices Alert */}
      {criticalDevices.length > 0 && (
        <Card>
          <CardBody>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                Critical Devices ({criticalDevices.length})
              </h2>
            </div>
            <div className="space-y-3">
              {criticalDevices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <DeviceStatusIndicator
                      status={device.status}
                      showLabel
                      size="md"
                    />
                    <span className="font-medium text-gray-900">
                      {device.name}
                    </span>
                    <Badge variant="default">{device.type}</Badge>
                  </div>
                  <Link
                    href={`/devices/${device.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Average Metrics */}
      {averageMetrics && (
        <DeviceMetrics
          metrics={
            {
              ...averageMetrics,
              uptime: 0,
            } as DeviceMetricsType
          }
        />
      )}

      {/* Quick Device List */}
      {devices.length > 0 && (
        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Devices
              </h2>
              <Link
                href="/devices"
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {devices.slice(0, 5).map((device) => (
                <Link
                  key={device.id}
                  href={`/devices/${device.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <DeviceStatusIndicator status={device.status} size="sm" />
                    <span className="font-medium text-gray-900">
                      {device.name}
                    </span>
                    <Badge variant="default">{device.type}</Badge>
                  </div>
                  <span className="text-sm text-gray-500">
                    {device.ipAddress}
                  </span>
                </Link>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
