import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useDevices,
  useDeviceStats,
  useCreateDevice,
  useUpdateDevice,
  useDeleteDevice,
} from "@/hooks/useDevices";
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

jest.mock("@/lib/api", () => ({
  deviceApi: {
    list: jest.fn(),
    stats: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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

describe("useDevices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch devices", async () => {
    mockDeviceApi.list.mockResolvedValue({
      success: true,
      data: {
        data: [mockDevice],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      },
    });

    const { result } = renderHook(() => useDevices(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });

  it("should handle error", async () => {
    mockDeviceApi.list.mockRejectedValue(new Error("Failed to fetch"));

    const { result } = renderHook(() => useDevices(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useDeviceStats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch device stats", async () => {
    mockDeviceApi.stats.mockResolvedValue({
      success: true,
      data: {
        total: 5,
        online: 3,
        offline: 1,
        warning: 1,
        error: 0,
        maintenance: 0,
      },
    });

    const { result } = renderHook(() => useDeviceStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useCreateDevice", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a device", async () => {
    mockDeviceApi.create.mockResolvedValue({
      success: true,
      data: mockDevice,
    });

    const { result } = renderHook(() => useCreateDevice(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ name: "New Device" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useUpdateDevice", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update a device", async () => {
    mockDeviceApi.update.mockResolvedValue({
      success: true,
      data: { ...mockDevice, name: "Updated Device" },
    });

    const { result } = renderHook(() => useUpdateDevice(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: "1", data: { name: "Updated Device" } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useDeleteDevice", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a device", async () => {
    mockDeviceApi.delete.mockResolvedValue({
      success: true,
      data: mockDevice,
    });

    const { result } = renderHook(() => useDeleteDevice(), {
      wrapper: createWrapper(),
    });

    result.current.mutate("1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
