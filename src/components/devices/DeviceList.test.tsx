import { render, screen, fireEvent } from "@testing-library/react";
import { DeviceList } from "./DeviceList";
import { Device, DeviceStatus } from "@/types/device";

const mockDevices: Device[] = [
  {
    id: "1",
    name: "Device 1",
    type: "server",
    ipAddress: "192.168.1.1",
    macAddress: "00:11:22:33:44:55",
    status: DeviceStatus.ONLINE,
    lastSeen: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Device 2",
    type: "router",
    ipAddress: "192.168.1.2",
    macAddress: "00:11:22:33:44:66",
    status: DeviceStatus.OFFLINE,
    lastSeen: new Date().toISOString(),
  },
];

describe("DeviceList", () => {
  it("renders correctly", () => {
    const { container } = render(<DeviceList devices={mockDevices} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders device list", () => {
    render(<DeviceList devices={mockDevices} />);
    expect(screen.getByText("Device 1")).toBeInTheDocument();
    expect(screen.getByText("Device 2")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    const { container } = render(<DeviceList devices={[]} isLoading />);
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<DeviceList devices={[]} />);
    expect(screen.getByText("No devices found")).toBeInTheDocument();
  });

  it("shows device count", () => {
    render(<DeviceList devices={mockDevices} />);
    expect(screen.getByText("Showing 2 of 2 devices")).toBeInTheDocument();
  });

  it("handles search", () => {
    render(<DeviceList devices={mockDevices} />);
    fireEvent.change(screen.getByPlaceholderText("Search devices..."), {
      target: { value: "Device 1" },
    });
  });

  it("handles filter change", () => {
    render(<DeviceList devices={mockDevices} />);
    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    fireEvent.change(screen.getByLabelText("Status"), {
      target: { value: "online" },
    });
  });

  it("handles view mode change", () => {
    render(<DeviceList devices={mockDevices} />);
    fireEvent.click(screen.getByRole("button", { name: "Grid view" }));
  });
});
