import React, { useState, type PropsWithChildren } from "react";
import { barlow_Condensed } from "~/styles/fonts/barlowCondensed";
import { karla } from "~/styles/fonts/karla";
import { classNames } from "~/utils/classNames";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const [collapsed, setIsCollapsed] = useState<boolean>(false);

  const toggleSidebarWidth = () => {
    setIsCollapsed(!collapsed);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} toggleSidebarWidth={toggleSidebarWidth} />

      <main
        className={classNames(
          collapsed
            ? "md:max-w-[calc(100vw_-_24px)]"
            : "md:max-w-[calc(100vw_-_101px)]",
          `${karla.variable} ${barlow_Condensed.variable} w-full flex-1 overflow-y-auto bg-white font-karla`,
        )}
      >
        <Header />
        <div className="relative flex h-[calc(100vh_-_4rem)] w-full flex-col">
          <div
            className={classNames(
              "relative h-full w-full overflow-hidden overflow-y-auto bg-white p-4",
            )}
          >
            {children}
          </div>
          <div className="absolute h-16" />
        </div>
      </main>
    </div>
  );
};

export default Layout;
