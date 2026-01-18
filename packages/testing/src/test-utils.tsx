import { TooltipProvider } from "@radix-ui/react-tooltip";
import { type RenderOptions, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement, ReactNode } from "react";

// Define a type for the providers' props if needed
// For now, we just mock the necessary providers
const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return <TooltipProvider delayDuration={0}>{children}</TooltipProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllTheProviders, ...options }),
  };
};

// Re-export everything
// biome-ignore lint/performance/noBarrelFile: intentional re-export for test utils
export * from "@testing-library/react";

// Override render method
export { customRender as render };
