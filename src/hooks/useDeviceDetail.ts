import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deviceApi, ApiError } from "@/lib/api";
import { Device, DeviceHistory, ApiResponse } from "@/types/device";
import { QUERY_KEYS } from "@/lib/constants";

interface UseDeviceDetailOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

export function useDeviceDetail(
  id: string,
  options: UseDeviceDetailOptions = {},
) {
  const { enabled = true, refetchInterval } = options;

  return useQuery({
    queryKey: [QUERY_KEYS.DEVICE_DETAIL, id],
    queryFn: () => deviceApi.detail(id),
    enabled: !!id && enabled,
    refetchInterval,
  });
}

export function useDeviceHistory(
  id: string,
  params?: { start?: string; end?: string; limit?: number },
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [QUERY_KEYS.DEVICE_HISTORY, id, params],
    queryFn: () => deviceApi.history(id, params),
    enabled: !!id && enabled,
  });
}

export function useDeviceMetrics(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: [QUERY_KEYS.DEVICE_METRICS, id],
    queryFn: () => deviceApi.metrics(id),
    enabled: !!id && enabled,
  });
}

export function useRefreshDevice() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Device>, ApiError, string>({
    mutationFn: (id) => deviceApi.refresh(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DEVICE_DETAIL, id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DEVICE_METRICS, id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DEVICE_HISTORY, id],
      });
    },
  });
}
