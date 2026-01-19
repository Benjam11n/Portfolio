"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";

export const ConditionalNavbar = () => {
  const pathname = usePathname();

  const shouldShowNavbar = !pathname.startsWith("/projects/");

  if (!shouldShowNavbar) {
    return null;
  }

  return <Navbar />;
};
