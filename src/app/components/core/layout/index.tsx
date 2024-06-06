/* eslint-disable @typescript-eslint/unbound-method */
"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, type PropsWithChildren } from "react";
import { useAppSelector } from "~/app/hook";

import { barlow_Condensed } from "~/styles/fonts/barlowCondensed";
import { karla } from "~/styles/fonts/karla";
import { classNames } from "~/utils/classNames";
import FullPageLayout from "./FullPageLayout";
import Header from "./Header";
import MobileNav from "./MobileNav";
import Sidebar from "./Sidebar";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const { assignedRole } = useAppSelector((state) => state.session);
  const pathname = usePathname();

  /**
   * This resets the page table filter to its initial state on every
   * router pathname change
   */
  useEffect(() => {
    if (pathname) {
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignedRole, pathname]);

  if (
    pathname &&
    (pathname.includes("/auth") ||
      pathname === "/" ||
      pathname.includes("/page-not-found") ||
      pathname.includes("/forbidden") ||
      pathname.includes("/server-error") ||
      pathname.includes("/no-assigned-group") ||
      pathname.includes("/reset-password"))
  ) {
    return <FullPageLayout>{children}</FullPageLayout>;
  }

  return (
    <div className="flex h-screen">
      {pathname && !pathname.includes("email-action") && <Sidebar />}

      <div
        className={classNames(
          `${karla.variable} ${barlow_Condensed.variable} relative h-full w-full flex-1 overflow-y-auto bg-neutral-100 font-karla`,
        )}
      >
        <Header />
        <div className="relative flex h-[calc(100vh_-_4rem)] w-full flex-col">
          <div
            className={classNames(
              "relative h-full w-full overflow-y-auto bg-neutral-100",
            )}
          >
            {children}
          </div>
          <div className="absolute h-16" />

          <MobileNav />
        </div>
      </div>
    </div>
  );
};

export default Layout;
