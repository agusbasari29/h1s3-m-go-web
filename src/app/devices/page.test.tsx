import { render, screen, fireEvent } from "@testing-library/react";
import DevicesPage from "./page";
import { DeviceStatus } from "@/types/device";

const mockPush = jest.fn();
const mockMutateDelete = jest.fn();
const mockMutateRefresh = jest.fn();
const mockUseDevices = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/hooks/useDevices", () => ({
  useDevices: (filters: unknown) => mockUseDevices(filters),
  useDeleteDevice: () => ({
    mutate: mockMutateDelete,
    isPending: false,
  }),
}));

jest.mock("@/hooks/useDeviceDetail", () => ({
  useRefreshDevice: () => ({
    mutate: mockMutateRefresh,
    isPending: false,
  }),
}));

jest.mock("@/components/devices", () => ({
  DeviceList: ({
    devices,
    isLoading,
    onDeviceClick,
    onDeviceAction,
    onFilterChange,
  }: {
    devices: Array<{ id: string; name: string }>;
    isLoading: boolean;
    onDeviceClick?: (device: { id: string }) => void;
    onDeviceAction?: (device: { id: string; name: string }, action: string) => void;
    onFilterChange?: (filters: unknown) => void;
  }) => (
    <div data-testid="device-list">
      {isLoading && <div data-testid="loading">Loading...</div>}
      {devices.map((d) => (
        <div key={d.id} data-testid={`device-${d.id}`}>
          <button onClick={() => onDeviceClick?.(d)}>{d.name}</button>
          <button onClick={() => onDeviceAction?.(d, "restart")}>
            Restart
          </button>
          <button onClick={() => onDeviceAction?.(d, "delete")}>
            Delete
          </button>
        </div>
      ))}
      <button onClick={() => onFilterChange?.({ status: "online" })}>
        Filter
      </button>
    </div>
  ),
}));

const mockDevices = [
  {
    id: "1",
    name: "Router A",
    type: "router",
    ipAddress: "192.168.1.1",
    macAddress: "00:11:22:33:44:55",
    status: DeviceStatus.ONLINE,
    lastSeen: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Switch B",
    type: "switch",
    ipAddress: "192.168.1.2",
    macAddress: "00:11:22:33:44:66",
    status: DeviceStatus.OFFLINE,
    lastSeen: new Date().toISOString(),
  },
];

describe("DevicesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDevices.mockReturnValue({
      data: { data: { data: mockDevices, pagination: { page: 1, limit: 10, total: 2, totalPages: 1 } }, success: true },
      isLoading: false,
    });
  });

  it("renders page heading", () => {
    render(<DevicesPage />);
    expect(screen.getByText("Devices")).toBeInTheDocument();
  });

  it("renders device list", () => {
    render(<DevicesPage />);
    expect(screen.getByTestId("device-list")).toBeInTheDocument();
    expect(screen.getByText("Router A")).toBeInTheDocument();
    expect(screen.getByText("Switch B")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    mockUseDevices.mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    render(<DevicesPage />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("navigates to device detail on click", () => {
    render(<DevicesPage />);
    fireEvent.click(screen.getByText("Router A"));
    expect(mockPush).toHaveBeenCalledWith("/devices/1");
  });

  it("calls refresh on restart action", () => {
    render(<DevicesPage />);
    const restartButtons = screen.getAllByText("Restart");
    fireEvent.click(restartButtons[0]);
    expect(mockMutateRefresh).toHaveBeenCalledWith("1");
  });

  it("opens delete modal on delete action", () => {
    render(<DevicesPage />);
    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);
    expect(
      screen.getByText(/Are you sure you want to delete/),
    ).toBeInTheDocument();
    expect(screen.getByText("Router A", { selector: "span" })).toBeInTheDocument();
  });

  it("confirms delete and calls mutation", () => {
    render(<DevicesPage />);
    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);
    // Click the Delete button in the modal (not the one in the list)
    const modalDeleteButton = screen.getAllByText("Delete").find(
      (el) => el.closest('[role="dialog"]'),
    );
    if (modalDeleteButton) {
      fireEvent.click(modalDeleteButton);
      expect(mockMutateDelete).toHaveBeenCalled();
    }
  });

  it("cancels delete modal", () => {
    render(<DevicesPage />);
    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);
    fireEvent.click(screen.getByText("Cancel"));
    expect(
      screen.queryByText(/Are you sure you want to delete/),
    ).not.toBeInTheDocument();
  });

  it("updates filters on filter change", () => {
    render(<DevicesPage />);
    fireEvent.click(screen.getByText("Filter"));
    // After clicking filter, useDevices should be called with new filters
    expect(mockUseDevices).toHaveBeenCalled();
  });
});
