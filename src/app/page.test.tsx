import { render, screen } from "@testing-library/react";
import DashboardPage from "./page";
import { DeviceStatus } from "@/types/device";

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

const mockUseDeviceStats = jest.fn();

jest.mock("@/hooks/useDeviceStats", () => ({
  useDeviceStats: () => mockUseDeviceStats(),
}));

const mockStats = {
  total: 20,
  online: 15,
  offline: 3,
  warning: 1,
  error: 1,
  maintenance: 0,
};

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
    status: DeviceStatus.ERROR,
    lastSeen: new Date().toISOString(),
  },
];

describe("DashboardPage", () => {
  beforeEach(() => {
    mockUseDeviceStats.mockReturnValue({
      stats: mockStats,
      devices: mockDevices,
      healthScore: 75,
      uptimePercentage: 80,
      criticalDevices: [mockDevices[1]],
      averageMetrics: null,
      statusDistribution: [],
      isLoading: false,
      isError: false,
    });
  });

  it("renders dashboard heading", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders stat cards with data", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Total Devices")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("Online")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("Offline")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Health Score")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("shows loading skeleton when isLoading is true", () => {
    mockUseDeviceStats.mockReturnValue({
      stats: null,
      devices: [],
      healthScore: 0,
      criticalDevices: [],
      averageMetrics: null,
      statusDistribution: [],
      isLoading: true,
      isError: false,
    });
    const { container } = render(<DashboardPage />);
    expect(container.querySelectorAll(".animate-pulse").length).toBe(4);
  });

  it("shows error message when isError is true", () => {
    mockUseDeviceStats.mockReturnValue({
      stats: null,
      devices: [],
      healthScore: 0,
      criticalDevices: [],
      averageMetrics: null,
      statusDistribution: [],
      isLoading: false,
      isError: true,
    });
    render(<DashboardPage />);
    expect(
      screen.getByText("Failed to load dashboard data. Please try again later."),
    ).toBeInTheDocument();
  });

  it("renders critical devices section when present", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Critical Devices (1)")).toBeInTheDocument();
    expect(screen.getAllByText("Switch B").length).toBeGreaterThanOrEqual(1);
  });

  it("does not render critical devices section when empty", () => {
    mockUseDeviceStats.mockReturnValue({
      stats: mockStats,
      devices: mockDevices,
      healthScore: 75,
      criticalDevices: [],
      averageMetrics: null,
      statusDistribution: [],
      isLoading: false,
      isError: false,
    });
    render(<DashboardPage />);
    expect(screen.queryByText(/Critical Devices/)).not.toBeInTheDocument();
  });

  it("renders recent devices list", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Recent Devices")).toBeInTheDocument();
    expect(screen.getByText("Router A")).toBeInTheDocument();
    expect(screen.getByText("View all")).toBeInTheDocument();
  });

  it("renders view all link to /devices", () => {
    render(<DashboardPage />);
    const viewAllLink = screen.getByText("View all").closest("a");
    expect(viewAllLink).toHaveAttribute("href", "/devices");
  });
});
