import { fireEvent, render, screen } from "@testing-library/react";

import type { Certification } from "@/lib/types";

import { CertificationCard } from "./certification-card";

vi.mock(import("@gsap/react"), () => ({
  useGSAP: () => ({ contextSafe: (fn: unknown) => fn }),
}));

vi.mock(import("gsap"), () => ({
  default: {
    to: vi.fn(),
  },
}));

const mockCert: Certification = {
  description: "A **test** certification description.",
  image: "/test-cert.png",
  issuedAt: { month: 1, year: 2024 },
  name: "Test Certification",
  organization: "Test Org",
};

describe(CertificationCard, () => {
  it("renders certification details and formatted issue date", () => {
    render(<CertificationCard cert={mockCert} />);

    expect(screen.getByText("Test Certification")).toBeInTheDocument();
    expect(screen.getByText("Test Org")).toBeInTheDocument();
    expect(screen.getByText("Jan 2024")).toBeInTheDocument();
    expect(screen.getByText("test").tagName).toBe("STRONG");
  });

  it("shows a fallback when the image fails to load", () => {
    render(<CertificationCard cert={mockCert} />);

    fireEvent.error(screen.getByAltText("Test Certification"));

    expect(screen.getByText("Image not available")).toBeInTheDocument();
  });
});
