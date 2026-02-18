import { deviceApi, api, ApiError } from "./api";
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

describe("api.post", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, "localStorage", {
      value: { getItem: jest.fn() },
      writable: true,
    });
  });

  it("sends POST request with data", async () => {
    const mockResponse = { id: "1", name: "New Device" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await api.post("/devices", { name: "New Device" });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs[1]?.method).toBe("POST");
    expect(callArgs[1]?.body).toBe(JSON.stringify({ name: "New Device" }));
    expect(result).toEqual(mockResponse);
  });

  it("throws ApiError on non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({}),
    } as Response);

    await expect(api.post("/devices")).rejects.toThrow(ApiError);
  });
});

describe("api.put", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, "localStorage", {
      value: { getItem: jest.fn() },
      writable: true,
    });
  });

  it("sends PUT request with data", async () => {
    const mockResponse = { id: "1", name: "Updated Device" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await api.put("/devices/1", { name: "Updated Device" });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs[1]?.method).toBe("PUT");
    expect(callArgs[1]?.body).toBe(JSON.stringify({ name: "Updated Device" }));
    expect(result).toEqual(mockResponse);
  });
});

describe("api.delete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, "localStorage", {
      value: { getItem: jest.fn() },
      writable: true,
    });
  });

  it("sends DELETE request", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    await api.delete("/devices/1");

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs[1]?.method).toBe("DELETE");
  });
});

describe("api with auth token", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn((key: string) =>
          key === "token" ? "jwt-token" : null,
        ),
      },
      writable: true,
    });
  });

  it("includes auth header when token exists", async () => {
    const mockResponse = { data: [] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    await api.get("/devices");

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const callArgs = mockFetch.mock.calls[0];
    const headers = callArgs[1]?.headers as Record<string, string>;
    expect(headers?.Authorization).toBe("Bearer jwt-token");
  });
});

describe("api.get with params", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, "localStorage", {
      value: { getItem: jest.fn() },
      writable: true,
    });
  });

  it("includes query params in URL", async () => {
    const mockResponse = {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    await api.get("/devices", { page: 2, limit: 20, status: "online" });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const callUrl = mockFetch.mock.calls[0][0] as string;
    expect(callUrl).toContain("page=2");
    expect(callUrl).toContain("limit=20");
    expect(callUrl).toContain("status=online");
  });

  it("skips undefined params", async () => {
    const mockResponse = { data: [] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    await api.get("/devices", { page: 1, limit: undefined });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const callUrl = mockFetch.mock.calls[0][0] as string;
    expect(callUrl).toContain("page=1");
    expect(callUrl).not.toContain("limit=");
  });
});

describe("retry logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, "localStorage", {
      value: { getItem: jest.fn() },
      writable: true,
    });
  });

  it("retries on server error", async () => {
    const mockResponse = { data: [] };
    mockFetch
      .mockRejectedValueOnce(new Error("Server error"))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

    const result = await api.get("/devices");

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(result).toEqual(mockResponse);
  });

  it("throws after max retries", async () => {
    mockFetch
      .mockRejectedValueOnce(new Error("Server error"))
      .mockRejectedValueOnce(new Error("Server error"))
      .mockRejectedValueOnce(new Error("Server error"));

    await expect(api.get("/devices")).rejects.toThrow();
  });
});
