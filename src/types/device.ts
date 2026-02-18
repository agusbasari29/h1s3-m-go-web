export enum DeviceStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  WARNING = "warning",
  ERROR = "error",
  MAINTENANCE = "maintenance",
}

export interface DeviceMetrics {
  cpu: number;
  memory: number;
  disk: number;
  networkIn: number;
  networkOut: number;
  temperature?: number;
  uptime: number;
}

export interface DeviceHistory {
  id: string;
  deviceId: string;
  timestamp: string;
  status: DeviceStatus;
  metrics: DeviceMetrics;
  event?: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  ipAddress: string;
  macAddress: string;
  status: DeviceStatus;
  lastSeen: string;
  location?: string;
  tags?: string[];
  metrics?: DeviceMetrics;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DeviceStats {
  total: number;
  online: number;
  offline: number;
  warning: number;
  error: number;
  maintenance: number;
}

export interface DeviceFilters {
  status?: DeviceStatus;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}
