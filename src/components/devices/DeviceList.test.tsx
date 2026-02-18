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

  it("handles filter change with status", () => {
    render(<DeviceList devices={mockDevices} />);
    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    fireEvent.change(screen.getByLabelText("Status"), {
      target: { value: "online" },
    });
    expect(screen.getByText("Showing 1 of 2 devices")).toBeInTheDocument();
  });

  it("handles filter change with type", () => {
    render(<DeviceList devices={mockDevices} />);
    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "server" },
    });
    expect(screen.getByText("Showing 1 of 2 devices")).toBeInTheDocument();
  });

  it("handles clear filters", () => {
    render(<DeviceList devices={mockDevices} />);
    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    fireEvent.change(screen.getByLabelText("Status"), {
      target: { value: "online" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByText("Showing 2 of 2 devices")).toBeInTheDocument();
  });

  it("renders list view mode", () => {
    render(<DeviceList devices={mockDevices} />);
    fireEvent.click(screen.getByRole("button", { name: "List view" }));
    expect(screen.getByText("Device 1")).toBeInTheDocument();
    expect(screen.getByText("Device 2")).toBeInTheDocument();
  });

  it("calls onDeviceClick when device is clicked", () => {
    const onDeviceClick = jest.fn();
    render(<DeviceList devices={mockDevices} onDeviceClick={onDeviceClick} />);
    fireEvent.click(screen.getByText("Device 1"));
    expect(onDeviceClick).toHaveBeenCalledWith(mockDevices[0]);
  });

  it("calls onDeviceAction when device action is triggered", () => {
    const onDeviceAction = jest.fn();
    render(
      <DeviceList devices={mockDevices} onDeviceAction={onDeviceAction} />,
    );
    fireEvent.click(screen.getByText("Device 1"));
    const restartButtons = screen.getAllByText("Restart");
    fireEvent.click(restartButtons[0]);
    expect(onDeviceAction).toHaveBeenCalledWith(mockDevices[0], "restart");
  });
});
