import React, { type PropsWithChildren } from "react";
import { barlow_Condensed } from "~/styles/fonts/barlowCondensed";
import { karla } from "~/styles/fonts/karla";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main
        className={`${karla.variable} ${barlow_Condensed.variable} flex-1 overflow-y-auto bg-white font-karla`}
      >
        <Header />
        <div className="relative flex h-[calc(100vh_-_4rem)]">
          <div className="h-full w-full overflow-y-auto bg-white p-4">
            {children}

            {/* <div className="h-16" /> !DO NOT REMOVE (Space for components that has footer) */}
            <div className="h-16" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
