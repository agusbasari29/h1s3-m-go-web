import { render, screen } from "@testing-library/react";
import { DeviceChart } from "./DeviceChart";

const mockData = [
  { time: "10:00", value: 50 },
  { time: "11:00", value: 60 },
  { time: "12:00", value: 70 },
];

describe("DeviceChart", () => {
  it("renders correctly", () => {
    const { container } = render(<DeviceChart data={mockData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with title", () => {
    const { getByText } = render(
      <DeviceChart data={mockData} title="CPU Usage" />,
    );
    expect(getByText("CPU Usage")).toBeInTheDocument();
  });

  it("renders line chart type", () => {
    const { container } = render(<DeviceChart data={mockData} type="line" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with custom color", () => {
    const { container } = render(
      <DeviceChart data={mockData} color="#ff0000" />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
