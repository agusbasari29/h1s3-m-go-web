import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deviceApi, ApiError } from "@/lib/api";
import {
  Device,
  DeviceFilters,
  DeviceStats,
  ApiResponse,
  PaginatedResponse,
} from "@/types/device";
import { QUERY_KEYS, PAGINATION_DEFAULT } from "@/lib/constants";

export function useDevices(filters: DeviceFilters = {}) {
  return useQuery<ApiResponse<PaginatedResponse<Device>>>({
    queryKey: [QUERY_KEYS.DEVICES, filters],
    queryFn: async () => {
      const params = {
        ...filters,
        page: filters.page || PAGINATION_DEFAULT.PAGE,
        limit: filters.limit || PAGINATION_DEFAULT.LIMIT,
      };
      return deviceApi.list(params);
    },
  });
}

export function useDeviceStats() {
  return useQuery<ApiResponse<DeviceStats>>({
    queryKey: [QUERY_KEYS.DEVICE_STATS],
    queryFn: () => deviceApi.stats(),
  });
}

export function useCreateDevice() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Device>, ApiError, Partial<Device>>({
    mutationFn: (deviceData) => deviceApi.create(deviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVICES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVICE_STATS] });
    },
  });
}

export function useUpdateDevice() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Device>,
    ApiError,
    { id: string; data: Partial<Device> }
  >({
    mutationFn: ({ id, data }) => deviceApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVICES] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DEVICE_DETAIL, variables.id],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVICE_STATS] });
    },
  });
}

export function useDeleteDevice() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Device>, ApiError, string>({
    mutationFn: (id) => deviceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVICES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVICE_STATS] });
    },
  });
}
