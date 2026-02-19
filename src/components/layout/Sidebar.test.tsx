import { render, fireEvent } from "@testing-library/react";
import { Sidebar } from "./Sidebar";

const mockUsePathname = jest.fn(() => "/");

jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    onClick,
    className,
    title,
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
    className?: string;
    title?: string;
  }) {
    return (
      <a href={href} onClick={onClick} className={className} title={title}>
        {children}
      </a>
    );
  };
});

describe("Sidebar", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/");
  });

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

  it("highlights Dashboard when pathname is /", () => {
    mockUsePathname.mockReturnValue("/");
    const { container } = render(<Sidebar />);
    const dashboardLink = container.querySelector('a[href="/"]');
    expect(dashboardLink).toHaveClass("bg-blue-50 text-blue-600");
  });

  it("highlights Devices when pathname is /devices", () => {
    mockUsePathname.mockReturnValue("/devices");
    const { container } = render(<Sidebar />);
    const devicesLink = container.querySelector('a[href="/devices"]');
    expect(devicesLink).toHaveClass("bg-blue-50 text-blue-600");
    const dashboardLink = container.querySelector('a[href="/"]');
    expect(dashboardLink).not.toHaveClass("bg-blue-50");
  });

  it("highlights Devices for sub-routes like /devices/123", () => {
    mockUsePathname.mockReturnValue("/devices/123");
    const { container } = render(<Sidebar />);
    const devicesLink = container.querySelector('a[href="/devices"]');
    expect(devicesLink).toHaveClass("bg-blue-50 text-blue-600");
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
