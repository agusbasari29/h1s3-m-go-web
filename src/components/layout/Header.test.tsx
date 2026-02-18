import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

describe("Header", () => {
  it("renders correctly", () => {
    const { container } = render(<Header />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders logo text", () => {
    render(<Header />);
    expect(screen.getByText("Device Monitor")).toBeInTheDocument();
  });
});
