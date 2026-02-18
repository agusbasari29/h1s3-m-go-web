import React, { useState } from "react";
import { Device, DeviceStatus, DeviceFilters } from "@/types/device";
import { DeviceCard } from "./DeviceCard";
import { Select, Input, Button } from "@/components/ui";
import { Grid, List, Search, Filter } from "lucide-react";

export interface DeviceListProps {
  devices: Device[];
  onDeviceClick?: (device: Device) => void;
  onDeviceAction?: (device: Device, action: string) => void;
  onFilterChange?: (filters: DeviceFilters) => void;
  isLoading?: boolean;
}

const statusOptions = [
  { value: "", label: "All Status" },
  { value: DeviceStatus.ONLINE, label: "Online" },
  { value: DeviceStatus.OFFLINE, label: "Offline" },
  { value: DeviceStatus.WARNING, label: "Warning" },
  { value: DeviceStatus.ERROR, label: "Error" },
  { value: DeviceStatus.MAINTENANCE, label: "Maintenance" },
];

const typeOptions = [
  { value: "", label: "All Types" },
  { value: "server", label: "Server" },
  { value: "router", label: "Router" },
  { value: "switch", label: "Switch" },
  { value: "workstation", label: "Workstation" },
];

export const DeviceList: React.FC<DeviceListProps> = ({
  devices,
  onDeviceClick,
  onDeviceAction,
  onFilterChange,
  isLoading = false,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange?.({
      search: searchQuery,
      status: (statusFilter as DeviceStatus) || undefined,
      type: typeFilter || undefined,
    });
  };

  const filteredDevices = devices.filter((device) => {
    if (
      searchQuery &&
      !device.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (statusFilter && device.status !== statusFilter) {
      return false;
    }
    if (typeFilter && device.type !== typeFilter) {
      return false;
    }
    return true;
  });

  return (
    <div>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search devices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <div className="flex rounded-md border border-gray-300">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"}`}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-50"}`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="mb-4 flex flex-wrap gap-4 rounded-lg border bg-gray-50 p-4">
          <div className="w-40">
            <Select
              label="Status"
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
          <div className="w-40">
            <Select
              label="Type"
              options={typeOptions}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            />
          </div>
          <div className="flex items-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatusFilter("");
                setTypeFilter("");
                setSearchQuery("");
                onFilterChange?.({});
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : filteredDevices.length === 0 ? (
        <div className="py-12 text-center text-gray-500">No devices found</div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onClick={() => onDeviceClick?.(device)}
              onAction={(action) => onDeviceAction?.(device, action)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onClick={() => onDeviceClick?.(device)}
              onAction={(action) => onDeviceAction?.(device, action)}
            />
          ))}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredDevices.length} of {devices.length} devices
      </div>
    </div>
  );
};
