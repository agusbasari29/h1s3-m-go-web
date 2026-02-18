import { render } from "@testing-library/react";
import { DeviceMetrics } from "./DeviceMetrics";
import { DeviceMetrics as DeviceMetricsType } from "@/types/device";

const mockMetrics: DeviceMetricsType = {
  cpu: 50,
  memory: 60,
  disk: 70,
  networkIn: 1024,
  networkOut: 512,
  temperature: 65,
  uptime: 3600,
};

describe("DeviceMetrics", () => {
  it("renders correctly", () => {
    const { container } = render(<DeviceMetrics metrics={mockMetrics} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders title", () => {
    const { getByText } = render(<DeviceMetrics metrics={mockMetrics} />);
    expect(getByText("Device Metrics")).toBeInTheDocument();
  });

  it("renders CPU value", () => {
    const { getByText } = render(<DeviceMetrics metrics={mockMetrics} />);
    expect(getByText("50%")).toBeInTheDocument();
  });

  it("renders memory value", () => {
    const { getByText } = render(<DeviceMetrics metrics={mockMetrics} />);
    expect(getByText("60%")).toBeInTheDocument();
  });

  it("renders temperature", () => {
    const { getByText } = render(<DeviceMetrics metrics={mockMetrics} />);
    expect(getByText("65°C")).toBeInTheDocument();
  });
});
