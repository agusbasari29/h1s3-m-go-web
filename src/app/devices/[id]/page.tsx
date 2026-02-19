"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  useDeviceDetail,
  useDeviceMetrics,
  useDeviceHistory,
  useRefreshDevice,
} from "@/hooks/useDeviceDetail";
import { useDeleteDevice } from "@/hooks/useDevices";
import {
  DeviceStatusIndicator,
  DeviceMetrics,
  DeviceCharts,
  DeviceHistory,
} from "@/components/devices";
import { Card, CardBody, Badge, Button, Modal } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";
import { ArrowLeft, RefreshCw, Trash2 } from "lucide-react";

export default function DeviceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: deviceData, isLoading, isError } = useDeviceDetail(id);
  const { data: metricsData } = useDeviceMetrics(id);
  const { data: historyData } = useDeviceHistory(id);
  const refreshDevice = useRefreshDevice();
  const deleteDevice = useDeleteDevice();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const device = deviceData?.data;
  const metrics = metricsData?.data;
  const history = useMemo(() => historyData?.data ?? [], [historyData]);

  const cpuData = useMemo(
    () => history.map((h) => ({ time: h.timestamp, cpu: h.metrics.cpu })),
    [history],
  );
  const memoryData = useMemo(
    () =>
      history.map((h) => ({ time: h.timestamp, memory: h.metrics.memory })),
    [history],
  );
  const networkData = useMemo(
    () =>
      history.map((h) => ({
        time: h.timestamp,
        network: h.metrics.networkIn,
      })),
    [history],
  );

  const handleRefresh = () => {
    refreshDevice.mutate(id);
  };

  const handleConfirmDelete = () => {
    deleteDevice.mutate(id, {
      onSuccess: () => router.push("/devices"),
      onSettled: () => setShowDeleteModal(false),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Link
          href="/devices"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Devices
        </Link>
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (isError || !device) {
    return (
      <div className="space-y-6">
        <Link
          href="/devices"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Devices
        </Link>
        <Card>
          <CardBody>
            <div className="py-8 text-center text-red-500">
              Failed to load device details. The device may not exist.
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/devices"
        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Devices
      </Link>

      {/* Device header */}
      <Card>
        <CardBody>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {device.name}
                </h1>
                <DeviceStatusIndicator
                  status={device.status}
                  showLabel
                  size="lg"
                />
              </div>
              <div className="grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                <div>
                  <span className="font-medium">Type:</span> {device.type}
                </div>
                <div>
                  <span className="font-medium">IP:</span> {device.ipAddress}
                </div>
                <div>
                  <span className="font-medium">MAC:</span> {device.macAddress}
                </div>
                {device.location && (
                  <div>
                    <span className="font-medium">Location:</span>{" "}
                    {device.location}
                  </div>
                )}
                <div>
                  <span className="font-medium">Last Seen:</span>{" "}
                  {formatDateTime(device.lastSeen)}
                </div>
              </div>
              {device.tags && device.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {device.tags.map((tag) => (
                    <Badge key={tag} variant="default">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                loading={refreshDevice.isPending}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Metrics panel */}
      {metrics && <DeviceMetrics metrics={metrics} />}

      {/* Charts */}
      {history.length > 0 && (
        <DeviceCharts
          cpuData={cpuData}
          memoryData={memoryData}
          networkData={networkData}
        />
      )}

      {/* History timeline */}
      <DeviceHistory history={history} />

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Device"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{device.name}</span>? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmDelete}
              loading={deleteDevice.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
