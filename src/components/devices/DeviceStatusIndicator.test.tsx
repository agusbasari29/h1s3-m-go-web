import { render } from "@testing-library/react";
import { DeviceStatusIndicator } from "./DeviceStatusIndicator";
import { DeviceStatus } from "@/types/device";

describe("DeviceStatusIndicator", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <DeviceStatusIndicator status={DeviceStatus.ONLINE} />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with offline status", () => {
    const { container } = render(
      <DeviceStatusIndicator status={DeviceStatus.OFFLINE} />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with error status", () => {
    const { container } = render(
      <DeviceStatusIndicator status={DeviceStatus.ERROR} />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with warning status", () => {
    const { container } = render(
      <DeviceStatusIndicator status={DeviceStatus.WARNING} />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with maintenance status", () => {
    const { container } = render(
      <DeviceStatusIndicator status={DeviceStatus.MAINTENANCE} />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
