import { render } from "@testing-library/react";
import { Sidebar } from "./Sidebar";

describe("Sidebar", () => {
  it("renders correctly", () => {
    const { container } = render(<Sidebar />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders logo text", () => {
    const { getByText } = render(<Sidebar />);
    expect(getByText("Device Monitor")).toBeInTheDocument();
  });

  it("renders navigation items", () => {
    const { getByText } = render(<Sidebar />);
    expect(getByText("Dashboard")).toBeInTheDocument();
    expect(getByText("Devices")).toBeInTheDocument();
    expect(getByText("Settings")).toBeInTheDocument();
  });

  it("renders mobile menu button", () => {
    const { container } = render(<Sidebar />);
    expect(
      container.querySelector('[aria-label="Open menu"]'),
    ).toBeInTheDocument();
  });
});
