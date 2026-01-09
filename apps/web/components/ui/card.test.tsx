import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

describe("Card", () => {
  it("renders card with content correctly", () => {
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

    expect(screen.getByText("Card Title")).toBeDefined();
    expect(screen.getByText("Card Description")).toBeDefined();
    expect(screen.getByText("Card Content")).toBeDefined();
    expect(screen.getByText("Card Footer")).toBeDefined();
  });

  it("applies custom classes to Card", () => {
    render(<Card className="custom-card">Content</Card>);
    // Card renders a div, so we can look for text and check parent or generic div
    // Or we can verify the class is present on the container containing "Content"
    const cardContent = screen.getByText("Content");
    // Since Card is the wrapper, we expect "Content" to be inside it.
    // However, exact DOM structure depends on implementation. Default Card is a div.
    // Let's assume it renders a div with the class.
    // A safer way is to use data-testid if we can, but we don't want to modify source just for tests yet.
    // We will just check if the element with text "Content" is wrapped in the class?
    // Actually, Card renders a div.
    expect(cardContent.closest("div")?.className).toContain("custom-card");
  });
});
