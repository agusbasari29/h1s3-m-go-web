import { render, screen } from "@testing-library/react";
import { DeviceHistory } from "./DeviceHistory";
import {
  DeviceHistory as DeviceHistoryType,
  DeviceStatus,
} from "@/types/device";

const mockHistory: DeviceHistoryType[] = [
  {
    id: "1",
    deviceId: "d1",
    timestamp: new Date().toISOString(),
    status: DeviceStatus.ONLINE,
    metrics: {
      cpu: 50,
      memory: 60,
      disk: 70,
      networkIn: 100,
      networkOut: 50,
      uptime: 3600,
    },
  },
  {
    id: "2",
    deviceId: "d1",
    timestamp: new Date().toISOString(),
    status: DeviceStatus.ERROR,
    metrics: {
      cpu: 100,
      memory: 90,
      disk: 80,
      networkIn: 0,
      networkOut: 0,
      uptime: 0,
    },
    event: "Device went offline",
  },
];

describe("DeviceHistory", () => {
  it("renders correctly", () => {
    const { container } = render(<DeviceHistory history={mockHistory} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders title", () => {
    const { getByText } = render(<DeviceHistory history={mockHistory} />);
    expect(getByText("Device History")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    const { getByText } = render(<DeviceHistory history={[]} />);
    expect(getByText("No history available")).toBeInTheDocument();
  });

  it("renders history items", () => {
    render(<DeviceHistory history={mockHistory} />);
    expect(screen.getByText("Device went offline")).toBeInTheDocument();
  });

  it("renders metrics", () => {
    render(<DeviceHistory history={mockHistory} />);
    expect(screen.getByText("CPU: 50%")).toBeInTheDocument();
  });
});
