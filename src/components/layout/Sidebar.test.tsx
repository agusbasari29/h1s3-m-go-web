import { render, fireEvent } from "@testing-library/react";
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

  it("opens mobile menu", () => {
    const { container } = render(<Sidebar />);
    const menuButton = container.querySelector('[aria-label="Open menu"]');
    fireEvent.click(menuButton!);
    expect(container.querySelector(".fixed.inset-0")).toBeInTheDocument();
  });

  it("closes mobile menu on overlay click", () => {
    const { container } = render(<Sidebar />);
    const menuButton = container.querySelector('[aria-label="Open menu"]');
    fireEvent.click(menuButton!);
    const overlay = container.querySelector(".fixed.inset-0");
    fireEvent.click(overlay!);
    expect(overlay).not.toBeInTheDocument();
  });

  it("closes mobile menu on close button click", () => {
    const { container } = render(<Sidebar />);
    const menuButton = container.querySelector('[aria-label="Open menu"]');
    fireEvent.click(menuButton!);
    const closeButton = container.querySelector('[aria-label="Close menu"]');
    fireEvent.click(closeButton!);
    expect(container.querySelector(".fixed.inset-0")).not.toBeInTheDocument();
  });

  it("activates navigation item on click", () => {
    const { container } = render(<Sidebar />);
    const dashboardLink = container.querySelector('a[href="/"]');
    fireEvent.click(dashboardLink!);
    expect(dashboardLink).toHaveClass("bg-blue-50 text-blue-600");
  });

  it("closes mobile menu when navigation item is clicked", () => {
    const { container } = render(<Sidebar />);
    const menuButton = container.querySelector('[aria-label="Open menu"]');
    fireEvent.click(menuButton!);
    const devicesLink = container.querySelector('a[href="/devices"]');
    fireEvent.click(devicesLink!);
    expect(container.querySelector(".fixed.inset-0")).not.toBeInTheDocument();
  });
});
