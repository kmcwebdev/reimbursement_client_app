import Image from "next/image";
import React from "react";
import { AiOutlineMenuFold } from "react-icons-all-files/ai/AiOutlineMenuFold";
import { AiOutlineMenuUnfold } from "react-icons-all-files/ai/AiOutlineMenuUnfold";
import { classNames } from "~/utils/classNames";

interface SidebarHeaderProps {
  collapsed: boolean;
  toggle: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed, toggle }) => {
  const iconAttr = {
    className: "h-5 w-5 cursor-pointer text-white",
    onClick: toggle,
  };

  return (
    <div className="flex h-16 items-center justify-between px-2 text-white">
      <div
        className={classNames(
          collapsed ? "w-6" : "w-[101px]",
          "overflow-hidden",
        )}
      >
        <div className="relative h-6 w-[101px]">
          <Image
            src="https://cdn.kmc.solutions/project-statics/KMC-logo-updated-white%20(1).png"
            alt="kmc-logo"
            fill
          />
        </div>
      </div>

      {collapsed ? (
        <AiOutlineMenuUnfold {...iconAttr} />
      ) : (
        <AiOutlineMenuFold {...iconAttr} />
      )}
    </div>
  );
};

export default SidebarHeader;
