import { render, screen } from "@testing-library/react";

import { CertificationCard } from "./certification-card";

// Mock GSAP for Card3D
vi.mock(import("@gsap/react"), () => ({
  useGSAP: () => ({ contextSafe: (fn: unknown) => fn }),
}));

vi.mock(import("gsap"), () => ({
  default: {
    to: vi.fn(),
  },
}));

const mockCert = {
  date: "Jan 2024",
  description: "A **test** certification description.",
  image: "/test-cert.png",
  name: "Test Certification",
  organization: "Test Org",
};

const DESCRIPTION_REGEX = /certification description/;

describe(CertificationCard, () => {
  it("renders certification details", () => {
    render(<CertificationCard cert={mockCert} />);
    expect(screen.getByText("Test Certification")).toBeDefined();
    expect(screen.getByText("Test Org")).toBeDefined();
    expect(screen.getByText("Jan 2024")).toBeDefined();

    // Check for description rendering via Markdown (looking for the strong tag content)
    // The markdown component renders **test** as bold
    expect(screen.getByText("test")).toBeDefined();
    expect(screen.getByText(DESCRIPTION_REGEX)).toBeDefined();
  });

  it("renders image with correct alt text", () => {
    render(<CertificationCard cert={mockCert} />);
    const img = screen.getByAltText("Test Certification");
    expect(img).toBeDefined();
    expect(img.getAttribute("src")).toContain("test-cert.png");
  });
});
