import { render, screen, fireEvent } from "@testing-library/react";
import { Select } from "./Select";

describe("Select", () => {
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  it("renders correctly", () => {
    const { container } = render(<Select options={options} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<Select label="Select Option" options={options} />);
    expect(screen.getByText("Select Option")).toBeInTheDocument();
  });

  it("renders all options", () => {
    render(<Select options={options} />);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("shows placeholder", () => {
    render(<Select options={options} placeholder="Choose one" />);
    expect(screen.getByText("Choose one")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<Select options={options} error="Error message" />);
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  it("handles change event", () => {
    const handleChange = jest.fn();
    render(<Select options={options} onChange={handleChange} />);
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "option1" },
    });
    expect(handleChange).toHaveBeenCalled();
  });
});
