import { useMemo } from "react";
import { useDevices, useDeviceStats as useStatsQuery } from "./useDevices";
import {
  Device,
  DeviceStatus,
  DeviceStats as DeviceStatsType,
} from "@/types/device";

interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
}

interface TrendData {
  date: string;
  value: number;
}

export function useDeviceStats() {
  const { data: statsResponse, ...statsRest } = useStatsQuery();
  const { data: devicesResponse, ...devicesRest } = useDevices({ limit: 100 });

  const stats = statsResponse?.success ? statsResponse.data : null;
  const devices = useMemo(
    () => (devicesResponse?.success ? devicesResponse.data.data : []),
    [devicesResponse],
  );

  const statusDistribution = useMemo((): ChartDataPoint[] => {
    if (!stats) return [];
    return [
      { name: "Online", value: stats.online, color: "#22c55e" },
      { name: "Offline", value: stats.offline, color: "#6b7280" },
      { name: "Warning", value: stats.warning, color: "#f59e0b" },
      { name: "Error", value: stats.error, color: "#ef4444" },
      { name: "Maintenance", value: stats.maintenance, color: "#8b5cf6" },
    ].filter((item) => item.value > 0);
  }, [stats]);

  const typeDistribution = useMemo((): ChartDataPoint[] => {
    if (!devices) return [];
    const typeMap = new Map<string, number>();
    devices.forEach((device: Device) => {
      const count = typeMap.get(device.type) || 0;
      typeMap.set(device.type, count + 1);
    });
    return Array.from(typeMap.entries()).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).replace("_", " "),
      value,
      color: getColorForType(name),
    }));
  }, [devices]);

  const healthScore = useMemo((): number => {
    if (!stats || stats.total === 0) return 0;
    const healthy = stats.online;
    return Math.round((healthy / stats.total) * 100);
  }, [stats]);

  const averageMetrics = useMemo(() => {
    if (!devices || devices.length === 0) return null;
    const devicesWithMetrics = devices.filter(
      (d: Device) => d.metrics,
    ) as (Device & { metrics: NonNullable<Device["metrics"]> })[];
    if (devicesWithMetrics.length === 0) return null;

    const sum = devicesWithMetrics.reduce(
      (acc, device) => ({
        cpu: acc.cpu + device.metrics.cpu,
        memory: acc.memory + device.metrics.memory,
        disk: acc.disk + device.metrics.disk,
        networkIn: acc.networkIn + device.metrics.networkIn,
        networkOut: acc.networkOut + device.metrics.networkOut,
        temperature: (acc.temperature || 0) + (device.metrics.temperature || 0),
      }),
      {
        cpu: 0,
        memory: 0,
        disk: 0,
        networkIn: 0,
        networkOut: 0,
        temperature: 0,
      },
    );

    const count = devicesWithMetrics.length;
    return {
      cpu: Math.round(sum.cpu / count),
      memory: Math.round(sum.memory / count),
      disk: Math.round(sum.disk / count),
      networkIn: Math.round(sum.networkIn / count),
      networkOut: Math.round(sum.networkOut / count),
      temperature: Math.round(sum.temperature / count),
    };
  }, [devices]);

  const uptimePercentage = useMemo((): number => {
    if (!stats || stats.total === 0) return 0;
    return Math.round(((stats.online + stats.maintenance) / stats.total) * 100);
  }, [stats]);

  const criticalDevices = useMemo((): Device[] => {
    if (!devices) return [];
    return devices.filter(
      (d: Device) =>
        d.status === DeviceStatus.ERROR || d.status === DeviceStatus.WARNING,
    );
  }, [devices]);

  return {
    stats,
    devices,
    statusDistribution,
    typeDistribution,
    healthScore,
    averageMetrics,
    uptimePercentage,
    criticalDevices,
    ...statsRest,
    ...devicesRest,
  };
}

function getColorForType(type: string): string {
  const colors: Record<string, string> = {
    router: "#3b82f6",
    switch: "#8b5cf6",
    access_point: "#22c55e",
    firewall: "#ef4444",
    gateway: "#f59e0b",
  };
  return colors[type] || "#6b7280";
}

export function useDeviceTrends(
  historyData: {
    timestamp: string;
    metrics: { cpu: number; memory: number };
  }[],
) {
  const cpuTrend = useMemo((): TrendData[] => {
    return historyData.map((point) => ({
      date: new Date(point.timestamp).toLocaleDateString(),
      value: point.metrics.cpu,
    }));
  }, [historyData]);

  const memoryTrend = useMemo((): TrendData[] => {
    return historyData.map((point) => ({
      date: new Date(point.timestamp).toLocaleDateString(),
      value: point.metrics.memory,
    }));
  }, [historyData]);

  const averageCpu = useMemo((): number => {
    if (cpuTrend.length === 0) return 0;
    const sum = cpuTrend.reduce((acc, point) => acc + point.value, 0);
    return Math.round(sum / cpuTrend.length);
  }, [cpuTrend]);

  const averageMemory = useMemo((): number => {
    if (memoryTrend.length === 0) return 0;
    const sum = memoryTrend.reduce((acc, point) => acc + point.value, 0);
    return Math.round(sum / memoryTrend.length);
  }, [memoryTrend]);

  const isCpuIncreasing = useMemo((): boolean => {
    if (cpuTrend.length < 2) return false;
    const recent = cpuTrend.slice(-3).reduce((acc, p) => acc + p.value, 0) / 3;
    const older = cpuTrend.slice(0, 3).reduce((acc, p) => acc + p.value, 0) / 3;
    return recent > older;
  }, [cpuTrend]);

  const isMemoryIncreasing = useMemo((): boolean => {
    if (memoryTrend.length < 2) return false;
    const recent =
      memoryTrend.slice(-3).reduce((acc, p) => acc + p.value, 0) / 3;
    const older =
      memoryTrend.slice(0, 3).reduce((acc, p) => acc + p.value, 0) / 3;
    return recent > older;
  }, [memoryTrend]);

  return {
    cpuTrend,
    memoryTrend,
    averageCpu,
    averageMemory,
    isCpuIncreasing,
    isMemoryIncreasing,
  };
}
