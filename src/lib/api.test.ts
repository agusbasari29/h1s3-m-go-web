import { deviceApi, ApiError } from "./api";
import { DEVICE_ENDPOINTS } from "./constants";

global.fetch = jest.fn();

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("deviceApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, "localStorage", {
      value: { getItem: jest.fn() },
      writable: true,
    });
  });

  describe("list", () => {
    it("fetches device list with filters", async () => {
      const mockResponse = {
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await deviceApi.list({ page: 1, limit: 10 });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });

    it("throws ApiError on failure", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      await expect(deviceApi.list()).rejects.toThrow(ApiError);
    });
  });

  describe("detail", () => {
    it("fetches device detail by id", async () => {
      const mockDevice = { id: "1", name: "Device 1", status: "online" };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDevice,
      } as Response);

      const result = await deviceApi.detail("1");

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockDevice);
    });
  });

  describe("stats", () => {
    it("fetches device stats", async () => {
      const mockStats = {
        total: 10,
        online: 8,
        offline: 2,
        warning: 0,
        error: 0,
        maintenance: 0,
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      } as Response);

      const result = await deviceApi.stats();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockStats);
    });
  });

  describe("history", () => {
    it("fetches device history", async () => {
      const mockHistory: unknown[] = [];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockHistory,
      } as Response);

      const result = await deviceApi.history("1", { limit: 10 });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockHistory);
    });
  });

  describe("metrics", () => {
    it("fetches device metrics", async () => {
      const mockMetrics = { cpu: 50, memory: 60, disk: 70, uptime: 3600 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMetrics,
      } as Response);

      const result = await deviceApi.metrics("1");

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockMetrics);
    });
  });
});

describe("ApiError", () => {
  it("creates error with status and message", () => {
    const error = new ApiError(404, "Not found");

    expect(error.status).toBe(404);
    expect(error.message).toBe("Not found");
    expect(error.name).toBe("ApiError");
  });
});
