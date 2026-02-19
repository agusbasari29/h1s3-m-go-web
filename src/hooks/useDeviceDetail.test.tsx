import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useDeviceDetail,
  useDeviceHistory,
  useRefreshDevice,
} from "@/hooks/useDeviceDetail";
import { ReactNode } from "react";
import { DeviceStatus } from "@/types/device";

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

const mockDevice = {
  id: "1",
  name: "Test Device",
  type: "router",
  ipAddress: "192.168.1.1",
  macAddress: "00:11:22:33:44:55",
  status: DeviceStatus.ONLINE,
  lastSeen: new Date().toISOString(),
};

const mockHistory = [
  {
    id: "1",
    deviceId: "1",
    timestamp: new Date().toISOString(),
    status: DeviceStatus.ONLINE,
    metrics: {
      cpu: 50,
      memory: 60,
      disk: 40,
      networkIn: 100,
      networkOut: 50,
      uptime: 1000,
    },
  },
];

jest.mock("@/lib/api", () => ({
  deviceApi: {
    detail: jest.fn(),
    history: jest.fn(),
    metrics: jest.fn(),
    refresh: jest.fn(),
  },
  ApiError: class ApiError extends Error {
    constructor(
      public status: number,
      message: string,
    ) {
      super(message);
      this.name = "ApiError";
    }
  },
}));

import { deviceApi } from "@/lib/api";

const mockDeviceApi = deviceApi as jest.Mocked<typeof deviceApi>;

describe("useDeviceDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch device detail", async () => {
    mockDeviceApi.detail.mockResolvedValue({
      success: true,
      data: mockDevice,
    });

    const { result } = renderHook(() => useDeviceDetail("1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("should not fetch when id is empty", async () => {
    const { result } = renderHook(() => useDeviceDetail(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFetching).toBe(false);
  });
});

describe("useDeviceHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch device history", async () => {
    mockDeviceApi.history.mockResolvedValue({
      success: true,
      data: mockHistory,
    });

    const { result } = renderHook(() => useDeviceHistory("1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("should pass params to API", async () => {
    mockDeviceApi.history.mockResolvedValue({
      success: true,
      data: mockHistory,
    });

    const { result } = renderHook(() => useDeviceHistory("1", { limit: 10 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockDeviceApi.history).toHaveBeenCalledWith("1", { limit: 10 });
  });
});

describe("useRefreshDevice", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should refresh device", async () => {
    mockDeviceApi.refresh.mockResolvedValue({
      success: true,
      data: mockDevice,
    });

    const { result } = renderHook(() => useRefreshDevice(), {
      wrapper: createWrapper(),
    });

    result.current.mutate("1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
