import { TooltipProvider } from "@radix-ui/react-tooltip";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement, ReactNode } from "react";

// Define a type for the providers' props if needed
// For now, we just mock the necessary providers
const AllTheProviders = ({ children }: { children: ReactNode }) => (
  <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
);

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => ({
  user: userEvent.setup(),
  ...render(ui, { wrapper: AllTheProviders, ...options }),
});

export { fireEvent, screen, waitFor } from "@testing-library/react";
export { customRender as render };
