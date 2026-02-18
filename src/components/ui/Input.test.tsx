import { render, screen } from "@testing-library/react";
import { Input } from "./Input";

describe("Input", () => {
  it("renders correctly", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("shows helper text when no error", () => {
    render(<Input helperText="Enter your email" />);
    expect(screen.getByText("Enter your email")).toBeInTheDocument();
  });

  it("does not show helper text when error is present", () => {
    render(<Input error="Error" helperText="Helper" />);
    expect(screen.queryByText("Helper")).not.toBeInTheDocument();
  });
});
