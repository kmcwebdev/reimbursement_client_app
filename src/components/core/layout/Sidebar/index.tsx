import React from "react";
import { classNames } from "~/utils/classNames";
import Navigation from "./Navigation";
import SidebarHeader from "./SidebarHeader";

interface SidebarProps {
  collapsed: boolean;
  toggleSidebarWidth: () => void;
}
const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebarWidth }) => {
  return (
    <div
      className={classNames(
        collapsed ? "w-[88px]" : "w-64",
        "z-20 hidden border-r bg-black transition-all ease-in-out md:block",
      )}
    >
      <div className="flex h-screen w-full flex-col gap-4">
        <SidebarHeader collapsed={collapsed} toggle={toggleSidebarWidth} />
        <div className="flex flex-col gap-y-4 px-2 py-4 children:cursor-pointer ">
          <Navigation collapsed={collapsed} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
