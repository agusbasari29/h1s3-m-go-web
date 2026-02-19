import {
  API_BASE_URL,
  API_TIMEOUT,
  API_RETRY,
  DEVICE_ENDPOINTS,
} from "./constants";
import {
  Device,
  DeviceHistory,
  DeviceMetrics,
  DeviceStats,
  PaginatedResponse,
  ApiResponse,
} from "@/types/device";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries: number = API_RETRY,
): Promise<Response> {
  let lastError: Error | null = null;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetchWithTimeout(url, options);

      if (!response.ok && response.status >= 500) {
        throw new ApiError(response.status, `Server error: ${response.status}`);
      }

      return response;
    } catch (error) {
      lastError = error as Error;

      if (error instanceof TypeError && error.message.includes("aborted")) {
        throw new ApiError(408, "Request timeout");
      }

      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  throw lastError || new ApiError(500, "Request failed");
}

function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>,
  ): Promise<T> {
    const url = new URL(endpoint, API_BASE_URL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetchWithRetry(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error: ${response.status}`);
    }

    return response.json();
  },

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error: ${response.status}`);
    }

    return response.json();
  },

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error: ${response.status}`);
    }

    return response.json();
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error: ${response.status}`);
    }

    return response.json();
  },
};

export const deviceApi = {
  list: (filters?: Record<string, string | number | undefined>) =>
    api.get<ApiResponse<PaginatedResponse<Device>>>(
      DEVICE_ENDPOINTS.LIST,
      filters,
    ),

  detail: (id: string) =>
    api.get<ApiResponse<Device>>(DEVICE_ENDPOINTS.DETAIL(id)),

  stats: () => api.get<ApiResponse<DeviceStats>>(DEVICE_ENDPOINTS.STATS),

  history: (
    id: string,
    params?: { start?: string; end?: string; limit?: number },
  ) =>
    api.get<ApiResponse<DeviceHistory[]>>(DEVICE_ENDPOINTS.HISTORY(id), params),

  metrics: (id: string) =>
    api.get<ApiResponse<DeviceMetrics>>(DEVICE_ENDPOINTS.METRICS(id)),

  create: (data: Partial<Device>) =>
    api.post<ApiResponse<Device>>(DEVICE_ENDPOINTS.LIST, data),

  update: (id: string, data: Partial<Device>) =>
    api.put<ApiResponse<Device>>(DEVICE_ENDPOINTS.DETAIL(id), data),

  delete: (id: string) =>
    api.delete<ApiResponse<Device>>(DEVICE_ENDPOINTS.DETAIL(id)),

  refresh: (id: string) =>
    api.post<ApiResponse<Device>>(`${DEVICE_ENDPOINTS.DETAIL(id)}/refresh`),
};

export { ApiError };
