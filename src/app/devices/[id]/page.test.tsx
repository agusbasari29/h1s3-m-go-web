import { render, screen, fireEvent } from "@testing-library/react";
import DeviceDetailPage from "./page";
import { DeviceStatus } from "@/types/device";

const mockPush = jest.fn();
const mockMutateRefresh = jest.fn();
const mockMutateDelete = jest.fn();

jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "1" }),
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  };
});

const mockUseDeviceDetail = jest.fn();
const mockUseDeviceMetrics = jest.fn();
const mockUseDeviceHistory = jest.fn();

jest.mock("@/hooks/useDeviceDetail", () => ({
  useDeviceDetail: (id: string) => mockUseDeviceDetail(id),
  useDeviceMetrics: (id: string) => mockUseDeviceMetrics(id),
  useDeviceHistory: (id: string) => mockUseDeviceHistory(id),
  useRefreshDevice: () => ({
    mutate: mockMutateRefresh,
    isPending: false,
  }),
}));

jest.mock("@/hooks/useDevices", () => ({
  useDeleteDevice: () => ({
    mutate: mockMutateDelete,
    isPending: false,
  }),
}));

// Mock recharts to avoid rendering issues in tests
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Line: () => null,
  Area: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}));

const mockDevice = {
  id: "1",
  name: "Router A",
  type: "router",
  ipAddress: "192.168.1.1",
  macAddress: "00:11:22:33:44:55",
  status: DeviceStatus.ONLINE,
  lastSeen: new Date().toISOString(),
  location: "Data Center A",
  tags: ["production", "critical"],
};

const mockMetrics = {
  cpu: 45,
  memory: 60,
  disk: 70,
  networkIn: 1024,
  networkOut: 512,
  temperature: 55,
  uptime: 86400,
};

const mockHistory = [
  {
    id: "h1",
    deviceId: "1",
    timestamp: new Date().toISOString(),
    status: DeviceStatus.ONLINE,
    metrics: {
      cpu: 40,
      memory: 55,
      disk: 70,
      networkIn: 1000,
      networkOut: 500,
      uptime: 86400,
    },
  },
];

describe("DeviceDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDeviceDetail.mockReturnValue({
      data: { data: mockDevice, success: true },
      isLoading: false,
      isError: false,
    });
    mockUseDeviceMetrics.mockReturnValue({
      data: { data: mockMetrics, success: true },
    });
    mockUseDeviceHistory.mockReturnValue({
      data: { data: mockHistory, success: true },
    });
  });

  it("renders device name", () => {
    render(<DeviceDetailPage />);
    expect(screen.getByText("Router A")).toBeInTheDocument();
  });

  it("renders device details", () => {
    render(<DeviceDetailPage />);
    expect(screen.getByText("192.168.1.1")).toBeInTheDocument();
    expect(screen.getByText("00:11:22:33:44:55")).toBeInTheDocument();
    expect(screen.getByText("Data Center A")).toBeInTheDocument();
  });

  it("renders device tags", () => {
    render(<DeviceDetailPage />);
    expect(screen.getByText("production")).toBeInTheDocument();
    expect(screen.getByText("critical")).toBeInTheDocument();
  });

  it("renders back link to devices", () => {
    render(<DeviceDetailPage />);
    const backLink = screen.getByText("Back to Devices").closest("a");
    expect(backLink).toHaveAttribute("href", "/devices");
  });

  it("renders metrics panel", () => {
    render(<DeviceDetailPage />);
    expect(screen.getByText("Device Metrics")).toBeInTheDocument();
    expect(screen.getByText("45%")).toBeInTheDocument();
  });

  it("renders history section", () => {
    render(<DeviceDetailPage />);
    expect(screen.getByText("Device History")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    mockUseDeviceDetail.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    const { container } = render(<DeviceDetailPage />);
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockUseDeviceDetail.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    render(<DeviceDetailPage />);
    expect(
      screen.getByText(
        "Failed to load device details. The device may not exist.",
      ),
    ).toBeInTheDocument();
  });

  it("handles refresh action", () => {
    render(<DeviceDetailPage />);
    fireEvent.click(screen.getByText("Refresh"));
    expect(mockMutateRefresh).toHaveBeenCalledWith("1");
  });

  it("opens delete modal", () => {
    render(<DeviceDetailPage />);
    // Click the Delete button (not the one in modal)
    const deleteBtn = screen.getAllByText("Delete")[0];
    fireEvent.click(deleteBtn);
    expect(
      screen.getByText(/Are you sure you want to delete/),
    ).toBeInTheDocument();
  });

  it("cancels delete modal", () => {
    render(<DeviceDetailPage />);
    const deleteBtn = screen.getAllByText("Delete")[0];
    fireEvent.click(deleteBtn);
    fireEvent.click(screen.getByText("Cancel"));
    expect(
      screen.queryByText(/Are you sure you want to delete/),
    ).not.toBeInTheDocument();
  });

  it("renders without metrics when not available", () => {
    mockUseDeviceMetrics.mockReturnValue({ data: undefined });
    render(<DeviceDetailPage />);
    expect(screen.queryByText("Device Metrics")).not.toBeInTheDocument();
  });

  it("renders without charts when history is empty", () => {
    mockUseDeviceHistory.mockReturnValue({ data: { data: [], success: true } });
    render(<DeviceDetailPage />);
    expect(screen.getByText("No history available")).toBeInTheDocument();
  });
});
