import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders with children", () => {
    render(<Badge>Badge</Badge>);
    expect(screen.getByText("Badge")).toBeInTheDocument();
  });

  it("applies default variant", () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container.firstChild).toHaveClass("bg-gray-100");
  });

  it("applies online variant", () => {
    const { container } = render(<Badge variant="online">Online</Badge>);
    expect(container.firstChild).toHaveClass("bg-green-100");
  });

  it("applies offline variant", () => {
    const { container } = render(<Badge variant="offline">Offline</Badge>);
    expect(container.firstChild).toHaveClass("bg-gray-100");
  });

  it("applies error variant", () => {
    const { container } = render(<Badge variant="error">Error</Badge>);
    expect(container.firstChild).toHaveClass("bg-red-100");
  });
});
