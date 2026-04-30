import { render, screen } from "@testing-library/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

describe(Card, () => {
  it("renders the composed card structure with semantic heading content", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    );

    expect(
      screen.getByRole("heading", { level: 3, name: "Card Title" })
    ).toBeInTheDocument();
    expect(screen.getByText("Card Description")).toBeInTheDocument();
    expect(screen.getByText("Card Content")).toBeInTheDocument();
    expect(screen.getByText("Card Footer")).toBeInTheDocument();
  });

  it("forwards refs and custom classes to the root card element", () => {
    const ref = { current: null as HTMLDivElement | null };

    render(
      <Card className="custom-card" ref={ref}>
        Content
      </Card>
    );

    expect(ref.current).toHaveClass("custom-card");
    expect(ref.current).toHaveTextContent("Content");
  });
});
