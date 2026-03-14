import type { Mock } from "vitest";

/**
 * Mock IntersectionObserver entry factory options
 */
export type MockIntersectionEntryOptions = {
  id: string;
  isIntersecting: boolean;
  intersectionRatio: number;
};

/**
 * Creates a mock IntersectionObserverEntry for testing
 * @param options - The entry configuration
 * @returns A properly typed IntersectionObserverEntry
 */
export function createMockIntersectionEntry(
  options: MockIntersectionEntryOptions
): IntersectionObserverEntry {
  return {
    target: { id: options.id } as unknown as Element,
    isIntersecting: options.isIntersecting,
    intersectionRatio: options.intersectionRatio,
    time: 0,
    boundingClientRect: new DOMRect(),
    intersectionRect: new DOMRect(),
    rootBounds: null,
  };
}

/**
 * Event listener types for media query testing
 */
export type TypedEventListener = (event: Event | MediaQueryListEvent) => void;
export type EventListenerMap = Record<string, TypedEventListener[]>;

/**
 * Typed mock function for observers
 */
export type MockObserver = Mock<() => void>;
export type MockDisconnect = Mock<() => void>;

/**
 * Props for mock button components in tests
 */
export type MockButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  "data-testid"?: string;
};

/**
 * Props for mock input components in tests
 */
export type MockInputProps = {
  name?: string;
  type?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  "aria-label"?: string;
  "data-testid"?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
