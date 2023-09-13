import React from "react";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { toggleSidebarCollapse } from "~/features/layout-state-slice";
import { classNames } from "~/utils/classNames";
import Navigation from "./Navigation";
import SidebarHeader from "./SidebarHeader";

const Sidebar: React.FC = () => {
  const { sideBarCollapsed: collapsed } = useAppSelector(
    (state) => state.layoutState,
  );

  const dispatch = useAppDispatch();

  const toggleSidebar = () => {
    dispatch(toggleSidebarCollapse());
  };
  return (
    <>
      {/* Sidebar for tablet screens */}
      <div className="z-20 hidden w-[88px] border-r bg-black transition-all ease-in-out md:block lg:hidden">
        <div className="h-screen w-full flex-col gap-4">
          <SidebarHeader collapsed={true} toggle={toggleSidebar} />
          <div className="flex flex-col gap-y-4 px-2 py-4 children:cursor-pointer ">
            <Navigation collapsed={true} />
          </div>
        </div>
      </div>

      {/* Sidebar for large screens */}
      <div
        className={classNames(
          collapsed ? "w-[88px]" : "w-64",
          "z-20 hidden border-r bg-black transition-all ease-in-out lg:block",
        )}
      >
        <div className="h-screen w-full flex-col gap-4">
          <SidebarHeader collapsed={collapsed} toggle={toggleSidebar} />
          <div className="flex flex-col gap-y-4 px-2 py-4 children:cursor-pointer ">
            <Navigation collapsed={collapsed} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
