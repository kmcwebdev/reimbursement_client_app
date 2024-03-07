"use client";
import { LazyMotion, domAnimation } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import PageAnimation from "./components/animation/PageAnimation";

const Template = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  if (
    pathname?.includes("forbidden") ||
    pathname?.includes("page-not-found") ||
    pathname?.includes("server-error") ||
    pathname?.includes("email-action")
  ) {
    return <>{children}</>;
  }

  return (
    <LazyMotion features={domAnimation}>
      <PageAnimation className="h-full">{children}</PageAnimation>
    </LazyMotion>
  );
};

export default Template;
