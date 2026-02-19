"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDevices, useDeleteDevice } from "@/hooks/useDevices";
import { useRefreshDevice } from "@/hooks/useDeviceDetail";
import { DeviceList } from "@/components/devices";
import { Modal, Button } from "@/components/ui";
import { Device, DeviceFilters } from "@/types/device";

export default function DevicesPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<DeviceFilters>({});
  const [deleteTarget, setDeleteTarget] = useState<Device | null>(null);

  const { data, isLoading } = useDevices(filters);
  const deleteDevice = useDeleteDevice();
  const refreshDevice = useRefreshDevice();

  const devices = data?.data?.data ?? [];

  const handleDeviceClick = (device: Device) => {
    router.push(`/devices/${device.id}`);
  };

  const handleDeviceAction = (device: Device, action: string) => {
    if (action === "restart") {
      refreshDevice.mutate(device.id);
    } else if (action === "delete") {
      setDeleteTarget(device);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteDevice.mutate(deleteTarget.id, {
        onSettled: () => setDeleteTarget(null),
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Devices</h1>

      <DeviceList
        devices={devices}
        isLoading={isLoading}
        onDeviceClick={handleDeviceClick}
        onDeviceAction={handleDeviceAction}
        onFilterChange={setFilters}
      />

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Device"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{deleteTarget?.name}</span>? This
            action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
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
