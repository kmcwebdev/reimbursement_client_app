import React, { type PropsWithChildren } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 overflow-y-auto bg-[#F3F4F6]">
        <Header />
        <div className="relative flex h-[calc(100vh_-_4rem)]">
          <div className=" h-full w-full overflow-y-auto bg-[#F3F4F6] p-4">
            {children}

            {/* <div className="h-16" /> !DO NOT REMOVE (Space for components that has footer) */}
            <div className="h-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
