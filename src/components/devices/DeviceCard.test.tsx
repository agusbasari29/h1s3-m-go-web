import { render } from "@testing-library/react";
import { DeviceCard } from "./DeviceCard";
import { Device, DeviceStatus } from "@/types/device";

const mockDevice: Device = {
  id: "1",
  name: "Test Device",
  type: "server",
  ipAddress: "192.168.1.1",
  macAddress: "00:11:22:33:44:55",
  status: DeviceStatus.ONLINE,
  lastSeen: new Date().toISOString(),
  location: "Data Center A",
  tags: ["production"],
};

describe("DeviceCard", () => {
  it("renders correctly", () => {
    const { container } = render(<DeviceCard device={mockDevice} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders device name", () => {
    const { getByText } = render(<DeviceCard device={mockDevice} />);
    expect(getByText("Test Device")).toBeInTheDocument();
  });

  it("renders device type", () => {
    const { getByText } = render(<DeviceCard device={mockDevice} />);
    expect(getByText("server")).toBeInTheDocument();
  });

  it("renders IP address", () => {
    const { getByText } = render(<DeviceCard device={mockDevice} />);
    expect(getByText("192.168.1.1")).toBeInTheDocument();
  });

  it("renders location", () => {
    const { getByText } = render(<DeviceCard device={mockDevice} />);
    expect(getByText("Data Center A")).toBeInTheDocument();
  });

  it("renders tags", () => {
    const { getByText } = render(<DeviceCard device={mockDevice} />);
    expect(getByText("production")).toBeInTheDocument();
  });

  it("handles click", () => {
    const handleClick = jest.fn();
    const { container } = render(
      <DeviceCard device={mockDevice} onClick={handleClick} />,
    );
    container.firstChild && container.firstChild.click();
  });

  it("handles action", () => {
    const handleAction = jest.fn();
    const { getByText } = render(
      <DeviceCard device={mockDevice} onAction={handleAction} />,
    );
    getByText("Restart").click();
  });
});
