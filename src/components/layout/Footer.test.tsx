import { render } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders correctly", () => {
    const { container } = render(<Footer />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders copyright text", () => {
    const { container } = render(<Footer />);
    expect(container.textContent).toContain("Device Monitor");
  });
});
