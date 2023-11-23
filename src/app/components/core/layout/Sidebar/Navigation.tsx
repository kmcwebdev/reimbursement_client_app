import { usePathname } from "next/navigation";
import React from "react";
import { type IconType } from "react-icons-all-files";
import { MdDashboard } from "react-icons-all-files/md/MdDashboard";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import { MdPerson } from "react-icons-all-files/md/MdPerson";
import { MdReceipt } from "react-icons-all-files/md/MdReceipt";
import { Can } from "~/context/AbilityContext";
import NavigationItem from "./NavigationItem";

interface NavigationProps {
  collapsed: boolean;
}
const Navigation: React.FC<NavigationProps> = ({ collapsed }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2">
      <NavigationItem
        label="Dashboard"
        icon={MdDashboard as IconType}
        active={pathname.includes("dashboard")}
        href="/dashboard"
        collapsed={collapsed}
      />

      <Can I="access" a="NAV_ITEM_APPROVAL">
        <NavigationItem
          label="Approval"
          icon={MdGavel as IconType}
          active={pathname.includes("approval")}
          href="/approval"
          collapsed={collapsed}
        />
      </Can>

      <Can I="access" a="NAV_ITEM_HISTORY">
        <NavigationItem
          label="History"
          icon={MdReceipt as IconType}
          active={pathname.includes("history")}
          href="/history"
          collapsed={collapsed}
        />
      </Can>

      <NavigationItem
        label="Profile"
        icon={MdPerson as IconType}
        active={pathname.includes("profile")}
        href="/profile"
        collapsed={collapsed}
      />
    </div>
  );
};

export default Navigation;
