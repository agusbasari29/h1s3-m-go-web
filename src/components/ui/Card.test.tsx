import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardBody, CardFooter } from "./Card";

describe("Card", () => {
  it("renders correctly", () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with children", () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});

describe("CardHeader", () => {
  it("renders correctly", () => {
    const { container } = render(<CardHeader>Header</CardHeader>);
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe("CardBody", () => {
  it("renders correctly", () => {
    const { container } = render(<CardBody>Body</CardBody>);
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe("CardFooter", () => {
  it("renders correctly", () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);
    expect(container.firstChild).toBeInTheDocument();
  });
});
