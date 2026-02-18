export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const API_TIMEOUT = parseInt(process.env.API_TIMEOUT || "5000", 10);

export const API_RETRY = parseInt(process.env.API_RETRY || "3", 10);

export const DEVICE_ENDPOINTS = {
  LIST: "/devices",
  DETAIL: (id: string) => `/devices/${id}`,
  STATS: "/devices/stats",
  HISTORY: (id: string) => `/devices/${id}/history`,
  METRICS: (id: string) => `/devices/${id}/metrics`,
};

export const STATUS_COLORS = {
  online: "#22c55e",
  offline: "#6b7280",
  warning: "#f59e0b",
  error: "#ef4444",
  maintenance: "#8b5cf6",
};

export const STATUS_LABELS = {
  online: "Online",
  offline: "Offline",
  warning: "Warning",
  error: "Error",
  maintenance: "Maintenance",
};

export const PAGINATION_DEFAULT = {
  PAGE: 1,
  LIMIT: 10,
};

export const QUERY_KEYS = {
  DEVICES: "devices",
  DEVICE_DETAIL: "device-detail",
  DEVICE_STATS: "device-stats",
  DEVICE_HISTORY: "device-history",
  DEVICE_METRICS: "device-metrics",
};
