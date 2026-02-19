import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { useDeviceStats, useDeviceTrends } from "@/hooks/useDeviceStats";
import { DeviceStatus, Device } from "@/types/device";

// Mock the useDevices module that useDeviceStats imports from
jest.mock("@/hooks/useDevices", () => ({
  useDevices: jest.fn(),
  useDeviceStats: jest.fn(),
}));

import {
  useDevices as mockUseDevices,
  useDeviceStats as mockUseStatsQuery,
} from "@/hooks/useDevices";

const mockedUseDevices = mockUseDevices as jest.Mock;
const mockedUseStatsQuery = mockUseStatsQuery as jest.Mock;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "Wrapper";
  return Wrapper;
};

const makeDevice = (overrides: Partial<Device> = {}): Device => ({
  id: "1",
  name: "Test Device",
  type: "router",
  ipAddress: "192.168.1.1",
  macAddress: "00:11:22:33:44:55",
  status: DeviceStatus.ONLINE,
  lastSeen: new Date().toISOString(),
  ...overrides,
});

const makeStatsResponse = (stats: {
  total: number;
  online: number;
  offline: number;
  warning: number;
  error: number;
  maintenance: number;
}) => ({
  data: { success: true, data: stats },
  isLoading: false,
  isError: false,
  isSuccess: true,
});

const makeDevicesResponse = (devices: Device[]) => ({
  data: {
    success: true,
    data: {
      data: devices,
      pagination: {
        page: 1,
        limit: 100,
        total: devices.length,
        totalPages: 1,
      },
    },
  },
  isLoading: false,
  isError: false,
  isSuccess: true,
});

const makeEmptyStatsResponse = () => ({
  data: undefined,
  isLoading: false,
  isError: false,
  isSuccess: false,
});

const makeEmptyDevicesResponse = () => ({
  data: undefined,
  isLoading: false,
  isError: false,
  isSuccess: false,
});

describe("useDeviceStats (computed hook)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("healthScore", () => {
    it("should calculate healthScore as percentage of online devices", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 10,
          online: 7,
          offline: 1,
          warning: 1,
          error: 1,
          maintenance: 0,
        }),
      );
      mockedUseDevices.mockReturnValue(makeDevicesResponse([]));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.healthScore).toBe(70);
    });

    it("should return 0 when total is 0", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 0,
          online: 0,
          offline: 0,
          warning: 0,
          error: 0,
          maintenance: 0,
        }),
      );
      mockedUseDevices.mockReturnValue(makeDevicesResponse([]));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.healthScore).toBe(0);
    });

    it("should return 100 when all devices are online", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 5,
          online: 5,
          offline: 0,
          warning: 0,
          error: 0,
          maintenance: 0,
        }),
      );
      mockedUseDevices.mockReturnValue(makeDevicesResponse([]));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.healthScore).toBe(100);
    });

    it("should round healthScore to nearest integer", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 3,
          online: 1,
          offline: 1,
          warning: 1,
          error: 0,
          maintenance: 0,
        }),
      );
      mockedUseDevices.mockReturnValue(makeDevicesResponse([]));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      // 1/3 * 100 = 33.33 -> rounds to 33
      expect(result.current.healthScore).toBe(33);
    });

    it("should return 0 when stats data is not available", () => {
      mockedUseStatsQuery.mockReturnValue(makeEmptyStatsResponse());
      mockedUseDevices.mockReturnValue(makeDevicesResponse([]));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.healthScore).toBe(0);
    });
  });

  describe("criticalDevices", () => {
    it("should filter devices with ERROR status", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 3,
          online: 1,
          offline: 0,
          warning: 0,
          error: 2,
          maintenance: 0,
        }),
      );

      const devices = [
        makeDevice({ id: "1", status: DeviceStatus.ONLINE }),
        makeDevice({ id: "2", status: DeviceStatus.ERROR, name: "Error Dev" }),
        makeDevice({
          id: "3",
          status: DeviceStatus.ERROR,
          name: "Error Dev 2",
        }),
      ];
      mockedUseDevices.mockReturnValue(makeDevicesResponse(devices));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.criticalDevices).toHaveLength(2);
      expect(result.current.criticalDevices[0].id).toBe("2");
      expect(result.current.criticalDevices[1].id).toBe("3");
    });

    it("should filter devices with WARNING status", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 2,
          online: 1,
          offline: 0,
          warning: 1,
          error: 0,
          maintenance: 0,
        }),
      );

      const devices = [
        makeDevice({ id: "1", status: DeviceStatus.ONLINE }),
        makeDevice({
          id: "2",
          status: DeviceStatus.WARNING,
          name: "Warn Dev",
        }),
      ];
      mockedUseDevices.mockReturnValue(makeDevicesResponse(devices));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.criticalDevices).toHaveLength(1);
      expect(result.current.criticalDevices[0].id).toBe("2");
    });

    it("should include both ERROR and WARNING devices", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 4,
          online: 1,
          offline: 1,
          warning: 1,
          error: 1,
          maintenance: 0,
        }),
      );

      const devices = [
        makeDevice({ id: "1", status: DeviceStatus.ONLINE }),
        makeDevice({ id: "2", status: DeviceStatus.OFFLINE }),
        makeDevice({ id: "3", status: DeviceStatus.WARNING }),
        makeDevice({ id: "4", status: DeviceStatus.ERROR }),
      ];
      mockedUseDevices.mockReturnValue(makeDevicesResponse(devices));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.criticalDevices).toHaveLength(2);
      const ids = result.current.criticalDevices.map((d) => d.id);
      expect(ids).toContain("3");
      expect(ids).toContain("4");
    });

    it("should return empty array when no critical devices exist", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 2,
          online: 2,
          offline: 0,
          warning: 0,
          error: 0,
          maintenance: 0,
        }),
      );

      const devices = [
        makeDevice({ id: "1", status: DeviceStatus.ONLINE }),
        makeDevice({ id: "2", status: DeviceStatus.ONLINE }),
      ];
      mockedUseDevices.mockReturnValue(makeDevicesResponse(devices));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.criticalDevices).toHaveLength(0);
    });

    it("should return empty array when devices data is not available", () => {
      mockedUseStatsQuery.mockReturnValue(makeEmptyStatsResponse());
      mockedUseDevices.mockReturnValue(makeEmptyDevicesResponse());

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.criticalDevices).toHaveLength(0);
    });
  });

  describe("statusDistribution", () => {
    it("should map stats to chart data points with correct colors", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 10,
          online: 5,
          offline: 2,
          warning: 1,
          error: 1,
          maintenance: 1,
        }),
      );
      mockedUseDevices.mockReturnValue(makeDevicesResponse([]));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.statusDistribution).toEqual([
        { name: "Online", value: 5, color: "#22c55e" },
        { name: "Offline", value: 2, color: "#6b7280" },
        { name: "Warning", value: 1, color: "#f59e0b" },
        { name: "Error", value: 1, color: "#ef4444" },
        { name: "Maintenance", value: 1, color: "#8b5cf6" },
      ]);
    });

    it("should filter out statuses with zero values", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 5,
          online: 3,
          offline: 2,
          warning: 0,
          error: 0,
          maintenance: 0,
        }),
      );
      mockedUseDevices.mockReturnValue(makeDevicesResponse([]));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.statusDistribution).toHaveLength(2);
      expect(result.current.statusDistribution).toEqual([
        { name: "Online", value: 3, color: "#22c55e" },
        { name: "Offline", value: 2, color: "#6b7280" },
      ]);
    });

    it("should return empty array when stats are not available", () => {
      mockedUseStatsQuery.mockReturnValue(makeEmptyStatsResponse());
      mockedUseDevices.mockReturnValue(makeDevicesResponse([]));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.statusDistribution).toEqual([]);
    });
  });

  describe("typeDistribution", () => {
    it("should aggregate device types and capitalize names", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 4,
          online: 4,
          offline: 0,
          warning: 0,
          error: 0,
          maintenance: 0,
        }),
      );

      const devices = [
        makeDevice({ id: "1", type: "router" }),
        makeDevice({ id: "2", type: "router" }),
        makeDevice({ id: "3", type: "switch" }),
        makeDevice({ id: "4", type: "firewall" }),
      ];
      mockedUseDevices.mockReturnValue(makeDevicesResponse(devices));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.typeDistribution).toEqual(
        expect.arrayContaining([
          { name: "Router", value: 2, color: "#3b82f6" },
          { name: "Switch", value: 1, color: "#8b5cf6" },
          { name: "Firewall", value: 1, color: "#ef4444" },
        ]),
      );
      expect(result.current.typeDistribution).toHaveLength(3);
    });

    it("should handle access_point type with underscore replacement", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 1,
          online: 1,
          offline: 0,
          warning: 0,
          error: 0,
          maintenance: 0,
        }),
      );

      const devices = [makeDevice({ id: "1", type: "access_point" })];
      mockedUseDevices.mockReturnValue(makeDevicesResponse(devices));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.typeDistribution).toEqual([
        { name: "Access point", value: 1, color: "#22c55e" },
      ]);
    });

    it("should use fallback color for unknown device types", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 1,
          online: 1,
          offline: 0,
          warning: 0,
          error: 0,
          maintenance: 0,
        }),
      );

      const devices = [makeDevice({ id: "1", type: "unknown_type" })];
      mockedUseDevices.mockReturnValue(makeDevicesResponse(devices));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.typeDistribution[0].color).toBe("#6b7280");
    });

    it("should return empty array when no devices are available", () => {
      mockedUseStatsQuery.mockReturnValue(makeEmptyStatsResponse());
      mockedUseDevices.mockReturnValue(makeEmptyDevicesResponse());

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.typeDistribution).toEqual([]);
    });
  });

  describe("averageMetrics", () => {
    it("should calculate average metrics across devices with metrics", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 2,
          online: 2,
          offline: 0,
          warning: 0,
          error: 0,
          maintenance: 0,
        }),
      );

      const devices = [
        makeDevice({
          id: "1",
          metrics: {
            cpu: 40,
            memory: 60,
            disk: 50,
            networkIn: 100,
            networkOut: 200,
            temperature: 60,
            uptime: 1000,
          },
        }),
        makeDevice({
          id: "2",
          metrics: {
            cpu: 80,
            memory: 70,
            disk: 30,
            networkIn: 300,
            networkOut: 400,
            temperature: 70,
            uptime: 2000,
          },
        }),
      ];
      mockedUseDevices.mockReturnValue(makeDevicesResponse(devices));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.averageMetrics).toEqual({
        cpu: 60,
        memory: 65,
        disk: 40,
        networkIn: 200,
        networkOut: 300,
        temperature: 65,
      });
    });

    it("should round averages to nearest integer", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 3,
          online: 3,
          offline: 0,
          warning: 0,
          error: 0,
          maintenance: 0,
        }),
      );

      const devices = [
        makeDevice({
          id: "1",
          metrics: {
            cpu: 33,
            memory: 50,
            disk: 20,
            networkIn: 100,
            networkOut: 100,
            temperature: 55,
            uptime: 1000,
          },
        }),
        makeDevice({
          id: "2",
          metrics: {
            cpu: 34,
            memory: 51,
            disk: 21,
            networkIn: 101,
            networkOut: 101,
            temperature: 56,
            uptime: 2000,
          },
        }),
        makeDevice({
          id: "3",
          metrics: {
            cpu: 35,
            memory: 52,
            disk: 22,
            networkIn: 102,
            networkOut: 102,
            temperature: 57,
            uptime: 3000,
          },
        }),
      ];
      mockedUseDevices.mockReturnValue(makeDevicesResponse(devices));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      // (33+34+35)/3 = 34, (50+51+52)/3 = 51, (20+21+22)/3 = 21
      // (100+101+102)/3 = 101, (55+56+57)/3 = 56
      expect(result.current.averageMetrics).toEqual({
        cpu: 34,
        memory: 51,
        disk: 21,
        networkIn: 101,
        networkOut: 101,
        temperature: 56,
      });
    });

    it("should skip devices without metrics", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 3,
          online: 3,
          offline: 0,
          warning: 0,
          error: 0,
          maintenance: 0,
        }),
      );

      const devices = [
        makeDevice({
          id: "1",
          metrics: {
            cpu: 50,
            memory: 60,
            disk: 40,
            networkIn: 100,
            networkOut: 200,
            temperature: 55,
            uptime: 1000,
          },
        }),
        makeDevice({ id: "2" }), // no metrics
        makeDevice({
          id: "3",
          metrics: {
            cpu: 70,
            memory: 80,
            disk: 60,
            networkIn: 300,
            networkOut: 400,
            temperature: 65,
            uptime: 2000,
          },
        }),
      ];
      mockedUseDevices.mockReturnValue(makeDevicesResponse(devices));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      // Only 2 devices with metrics: (50+70)/2=60, (60+80)/2=70, (40+60)/2=50
      expect(result.current.averageMetrics).toEqual({
        cpu: 60,
        memory: 70,
        disk: 50,
        networkIn: 200,
        networkOut: 300,
        temperature: 60,
      });
    });

    it("should return null when no devices have metrics", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 2,
          online: 2,
          offline: 0,
          warning: 0,
          error: 0,
          maintenance: 0,
        }),
      );

      const devices = [
        makeDevice({ id: "1" }), // no metrics
        makeDevice({ id: "2" }), // no metrics
      ];
      mockedUseDevices.mockReturnValue(makeDevicesResponse(devices));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.averageMetrics).toBeNull();
    });

    it("should return null when devices array is empty", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 0,
          online: 0,
          offline: 0,
          warning: 0,
          error: 0,
          maintenance: 0,
        }),
      );
      mockedUseDevices.mockReturnValue(makeDevicesResponse([]));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.averageMetrics).toBeNull();
    });

    it("should handle devices with optional temperature as undefined", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 2,
          online: 2,
          offline: 0,
          warning: 0,
          error: 0,
          maintenance: 0,
        }),
      );

      const devices = [
        makeDevice({
          id: "1",
          metrics: {
            cpu: 40,
            memory: 60,
            disk: 50,
            networkIn: 100,
            networkOut: 200,
            uptime: 1000,
            // temperature is undefined
          },
        }),
        makeDevice({
          id: "2",
          metrics: {
            cpu: 60,
            memory: 80,
            disk: 70,
            networkIn: 300,
            networkOut: 400,
            uptime: 2000,
            // temperature is undefined
          },
        }),
      ];
      mockedUseDevices.mockReturnValue(makeDevicesResponse(devices));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.averageMetrics).toEqual({
        cpu: 50,
        memory: 70,
        disk: 60,
        networkIn: 200,
        networkOut: 300,
        temperature: 0,
      });
    });
  });

  describe("uptimePercentage", () => {
    it("should calculate uptime as percentage of online + maintenance devices", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 10,
          online: 6,
          offline: 1,
          warning: 1,
          error: 1,
          maintenance: 1,
        }),
      );
      mockedUseDevices.mockReturnValue(makeDevicesResponse([]));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      // (6 + 1) / 10 * 100 = 70
      expect(result.current.uptimePercentage).toBe(70);
    });

    it("should return 0 when total is 0", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 0,
          online: 0,
          offline: 0,
          warning: 0,
          error: 0,
          maintenance: 0,
        }),
      );
      mockedUseDevices.mockReturnValue(makeDevicesResponse([]));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.uptimePercentage).toBe(0);
    });

    it("should return 100 when all devices are online or in maintenance", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 10,
          online: 8,
          offline: 0,
          warning: 0,
          error: 0,
          maintenance: 2,
        }),
      );
      mockedUseDevices.mockReturnValue(makeDevicesResponse([]));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.uptimePercentage).toBe(100);
    });

    it("should round uptime to nearest integer", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 3,
          online: 2,
          offline: 1,
          warning: 0,
          error: 0,
          maintenance: 0,
        }),
      );
      mockedUseDevices.mockReturnValue(makeDevicesResponse([]));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      // 2/3 * 100 = 66.67 -> rounds to 67
      expect(result.current.uptimePercentage).toBe(67);
    });

    it("should return 0 when stats are not available", () => {
      mockedUseStatsQuery.mockReturnValue(makeEmptyStatsResponse());
      mockedUseDevices.mockReturnValue(makeDevicesResponse([]));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.uptimePercentage).toBe(0);
    });
  });

  describe("empty and null states", () => {
    it("should handle both stats and devices being unavailable", () => {
      mockedUseStatsQuery.mockReturnValue(makeEmptyStatsResponse());
      mockedUseDevices.mockReturnValue(makeEmptyDevicesResponse());

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.stats).toBeNull();
      expect(result.current.devices).toEqual([]);
      expect(result.current.statusDistribution).toEqual([]);
      expect(result.current.typeDistribution).toEqual([]);
      expect(result.current.healthScore).toBe(0);
      expect(result.current.averageMetrics).toBeNull();
      expect(result.current.uptimePercentage).toBe(0);
      expect(result.current.criticalDevices).toEqual([]);
    });

    it("should handle stats available but no devices", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 5,
          online: 3,
          offline: 1,
          warning: 1,
          error: 0,
          maintenance: 0,
        }),
      );
      mockedUseDevices.mockReturnValue(makeDevicesResponse([]));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.stats).toEqual({
        total: 5,
        online: 3,
        offline: 1,
        warning: 1,
        error: 0,
        maintenance: 0,
      });
      expect(result.current.healthScore).toBe(60);
      expect(result.current.uptimePercentage).toBe(60);
      expect(result.current.statusDistribution).toHaveLength(3);
      expect(result.current.criticalDevices).toEqual([]);
      expect(result.current.averageMetrics).toBeNull();
    });

    it("should handle devices available but no stats", () => {
      mockedUseStatsQuery.mockReturnValue(makeEmptyStatsResponse());
      mockedUseDevices.mockReturnValue(
        makeDevicesResponse([
          makeDevice({ id: "1", status: DeviceStatus.ERROR }),
        ]),
      );

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.stats).toBeNull();
      expect(result.current.healthScore).toBe(0);
      expect(result.current.uptimePercentage).toBe(0);
      expect(result.current.statusDistribution).toEqual([]);
      expect(result.current.criticalDevices).toHaveLength(1);
    });

    it("should handle stats response with success false", () => {
      mockedUseStatsQuery.mockReturnValue({
        data: { success: false, message: "Server error" },
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      mockedUseDevices.mockReturnValue(makeDevicesResponse([]));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.stats).toBeNull();
      expect(result.current.healthScore).toBe(0);
      expect(result.current.statusDistribution).toEqual([]);
    });

    it("should handle devices response with success false", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 1,
          online: 1,
          offline: 0,
          warning: 0,
          error: 0,
          maintenance: 0,
        }),
      );
      mockedUseDevices.mockReturnValue({
        data: { success: false, message: "Server error" },
        isLoading: false,
        isError: false,
        isSuccess: true,
      });

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.devices).toEqual([]);
      expect(result.current.criticalDevices).toEqual([]);
      expect(result.current.typeDistribution).toEqual([]);
      expect(result.current.averageMetrics).toBeNull();
    });
  });

  describe("return value structure", () => {
    it("should return stats, devices, and all computed values", () => {
      mockedUseStatsQuery.mockReturnValue(
        makeStatsResponse({
          total: 2,
          online: 1,
          offline: 0,
          warning: 1,
          error: 0,
          maintenance: 0,
        }),
      );

      const devices = [
        makeDevice({ id: "1", status: DeviceStatus.ONLINE, type: "router" }),
        makeDevice({
          id: "2",
          status: DeviceStatus.WARNING,
          type: "switch",
        }),
      ];
      mockedUseDevices.mockReturnValue(makeDevicesResponse(devices));

      const { result } = renderHook(() => useDeviceStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty("stats");
      expect(result.current).toHaveProperty("devices");
      expect(result.current).toHaveProperty("statusDistribution");
      expect(result.current).toHaveProperty("typeDistribution");
      expect(result.current).toHaveProperty("healthScore");
      expect(result.current).toHaveProperty("averageMetrics");
      expect(result.current).toHaveProperty("uptimePercentage");
      expect(result.current).toHaveProperty("criticalDevices");
    });
  });
});

describe("useDeviceTrends", () => {
  const createWrapper2 = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    const Wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    Wrapper.displayName = "Wrapper";
    return Wrapper;
  };

  const sampleHistory = [
    { timestamp: "2025-01-01T00:00:00Z", metrics: { cpu: 30, memory: 40 } },
    { timestamp: "2025-01-02T00:00:00Z", metrics: { cpu: 35, memory: 45 } },
    { timestamp: "2025-01-03T00:00:00Z", metrics: { cpu: 40, memory: 50 } },
    { timestamp: "2025-01-04T00:00:00Z", metrics: { cpu: 50, memory: 55 } },
    { timestamp: "2025-01-05T00:00:00Z", metrics: { cpu: 60, memory: 65 } },
    { timestamp: "2025-01-06T00:00:00Z", metrics: { cpu: 70, memory: 75 } },
  ];

  describe("cpuTrend", () => {
    it("should map history data to cpu trend with formatted dates", () => {
      const { result } = renderHook(
        () => useDeviceTrends(sampleHistory),
        { wrapper: createWrapper2() },
      );

      expect(result.current.cpuTrend).toHaveLength(6);
      expect(result.current.cpuTrend[0].value).toBe(30);
      expect(result.current.cpuTrend[5].value).toBe(70);
      // Each point should have a date string
      result.current.cpuTrend.forEach((point) => {
        expect(typeof point.date).toBe("string");
        expect(point.date.length).toBeGreaterThan(0);
      });
    });

    it("should return empty array for empty history", () => {
      const { result } = renderHook(
        () => useDeviceTrends([]),
        { wrapper: createWrapper2() },
      );

      expect(result.current.cpuTrend).toEqual([]);
    });
  });

  describe("memoryTrend", () => {
    it("should map history data to memory trend with formatted dates", () => {
      const { result } = renderHook(
        () => useDeviceTrends(sampleHistory),
        { wrapper: createWrapper2() },
      );

      expect(result.current.memoryTrend).toHaveLength(6);
      expect(result.current.memoryTrend[0].value).toBe(40);
      expect(result.current.memoryTrend[5].value).toBe(75);
    });

    it("should return empty array for empty history", () => {
      const { result } = renderHook(
        () => useDeviceTrends([]),
        { wrapper: createWrapper2() },
      );

      expect(result.current.memoryTrend).toEqual([]);
    });
  });

  describe("averageCpu", () => {
    it("should calculate average CPU across all data points", () => {
      const { result } = renderHook(
        () => useDeviceTrends(sampleHistory),
        { wrapper: createWrapper2() },
      );

      // (30+35+40+50+60+70)/6 = 285/6 = 47.5 -> rounds to 48
      expect(result.current.averageCpu).toBe(48);
    });

    it("should return 0 for empty history", () => {
      const { result } = renderHook(
        () => useDeviceTrends([]),
        { wrapper: createWrapper2() },
      );

      expect(result.current.averageCpu).toBe(0);
    });

    it("should handle single data point", () => {
      const singlePoint = [
        {
          timestamp: "2025-01-01T00:00:00Z",
          metrics: { cpu: 42, memory: 55 },
        },
      ];

      const { result } = renderHook(
        () => useDeviceTrends(singlePoint),
        { wrapper: createWrapper2() },
      );

      expect(result.current.averageCpu).toBe(42);
    });
  });

  describe("averageMemory", () => {
    it("should calculate average memory across all data points", () => {
      const { result } = renderHook(
        () => useDeviceTrends(sampleHistory),
        { wrapper: createWrapper2() },
      );

      // (40+45+50+55+65+75)/6 = 330/6 = 55
      expect(result.current.averageMemory).toBe(55);
    });

    it("should return 0 for empty history", () => {
      const { result } = renderHook(
        () => useDeviceTrends([]),
        { wrapper: createWrapper2() },
      );

      expect(result.current.averageMemory).toBe(0);
    });
  });

  describe("isCpuIncreasing", () => {
    it("should return true when recent CPU is higher than older CPU", () => {
      const { result } = renderHook(
        () => useDeviceTrends(sampleHistory),
        { wrapper: createWrapper2() },
      );

      // Older 3 avg: (30+35+40)/3 = 35, Recent 3 avg: (50+60+70)/3 = 60
      expect(result.current.isCpuIncreasing).toBe(true);
    });

    it("should return false when recent CPU is lower than older CPU", () => {
      const decreasingHistory = [
        {
          timestamp: "2025-01-01T00:00:00Z",
          metrics: { cpu: 80, memory: 50 },
        },
        {
          timestamp: "2025-01-02T00:00:00Z",
          metrics: { cpu: 75, memory: 50 },
        },
        {
          timestamp: "2025-01-03T00:00:00Z",
          metrics: { cpu: 70, memory: 50 },
        },
        {
          timestamp: "2025-01-04T00:00:00Z",
          metrics: { cpu: 40, memory: 50 },
        },
        {
          timestamp: "2025-01-05T00:00:00Z",
          metrics: { cpu: 35, memory: 50 },
        },
        {
          timestamp: "2025-01-06T00:00:00Z",
          metrics: { cpu: 30, memory: 50 },
        },
      ];

      const { result } = renderHook(
        () => useDeviceTrends(decreasingHistory),
        { wrapper: createWrapper2() },
      );

      // Older 3 avg: (80+75+70)/3 = 75, Recent 3 avg: (40+35+30)/3 = 35
      expect(result.current.isCpuIncreasing).toBe(false);
    });

    it("should return false when history has fewer than 2 points", () => {
      const singlePoint = [
        {
          timestamp: "2025-01-01T00:00:00Z",
          metrics: { cpu: 50, memory: 50 },
        },
      ];

      const { result } = renderHook(
        () => useDeviceTrends(singlePoint),
        { wrapper: createWrapper2() },
      );

      expect(result.current.isCpuIncreasing).toBe(false);
    });

    it("should return false for empty history", () => {
      const { result } = renderHook(
        () => useDeviceTrends([]),
        { wrapper: createWrapper2() },
      );

      expect(result.current.isCpuIncreasing).toBe(false);
    });
  });

  describe("isMemoryIncreasing", () => {
    it("should return true when recent memory is higher than older memory", () => {
      const { result } = renderHook(
        () => useDeviceTrends(sampleHistory),
        { wrapper: createWrapper2() },
      );

      // Older 3 avg: (40+45+50)/3 = 45, Recent 3 avg: (55+65+75)/3 = 65
      expect(result.current.isMemoryIncreasing).toBe(true);
    });

    it("should return false when recent memory is lower than older memory", () => {
      const decreasingMemory = [
        {
          timestamp: "2025-01-01T00:00:00Z",
          metrics: { cpu: 50, memory: 90 },
        },
        {
          timestamp: "2025-01-02T00:00:00Z",
          metrics: { cpu: 50, memory: 85 },
        },
        {
          timestamp: "2025-01-03T00:00:00Z",
          metrics: { cpu: 50, memory: 80 },
        },
        {
          timestamp: "2025-01-04T00:00:00Z",
          metrics: { cpu: 50, memory: 40 },
        },
        {
          timestamp: "2025-01-05T00:00:00Z",
          metrics: { cpu: 50, memory: 35 },
        },
        {
          timestamp: "2025-01-06T00:00:00Z",
          metrics: { cpu: 50, memory: 30 },
        },
      ];

      const { result } = renderHook(
        () => useDeviceTrends(decreasingMemory),
        { wrapper: createWrapper2() },
      );

      expect(result.current.isMemoryIncreasing).toBe(false);
    });

    it("should return false when history has fewer than 2 points", () => {
      const singlePoint = [
        {
          timestamp: "2025-01-01T00:00:00Z",
          metrics: { cpu: 50, memory: 50 },
        },
      ];

      const { result } = renderHook(
        () => useDeviceTrends(singlePoint),
        { wrapper: createWrapper2() },
      );

      expect(result.current.isMemoryIncreasing).toBe(false);
    });

    it("should return false for empty history", () => {
      const { result } = renderHook(
        () => useDeviceTrends([]),
        { wrapper: createWrapper2() },
      );

      expect(result.current.isMemoryIncreasing).toBe(false);
    });
  });

  describe("return value structure", () => {
    it("should return all trend properties", () => {
      const { result } = renderHook(
        () => useDeviceTrends(sampleHistory),
        { wrapper: createWrapper2() },
      );

      expect(result.current).toHaveProperty("cpuTrend");
      expect(result.current).toHaveProperty("memoryTrend");
      expect(result.current).toHaveProperty("averageCpu");
      expect(result.current).toHaveProperty("averageMemory");
      expect(result.current).toHaveProperty("isCpuIncreasing");
      expect(result.current).toHaveProperty("isMemoryIncreasing");
    });
  });
});
