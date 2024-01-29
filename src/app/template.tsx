"use client";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import PageAnimation from "./components/animation/PageAnimation";

const Template = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  if (
    pathname?.includes("forbidden") ||
    pathname?.includes("page-not-found") ||
    pathname?.includes("email-action")
  ) {
    return <>{children}</>;
  }

  return <PageAnimation className="h-full">{children}</PageAnimation>;
};

export default Template;
