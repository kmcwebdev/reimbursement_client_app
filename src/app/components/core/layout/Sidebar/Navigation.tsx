import { usePathname } from "next/navigation";
import React from "react";
import { type IconType } from "react-icons-all-files";
import { MdAdminPanelSettings } from "react-icons-all-files/md/MdAdminPanelSettings";
import { MdDashboard } from "react-icons-all-files/md/MdDashboard";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import { MdPerson } from "react-icons-all-files/md/MdPerson";
import { MdReceipt } from "react-icons-all-files/md/MdReceipt";
import { useAppSelector } from "~/app/hook";
import { Can } from "~/context/AbilityContext";
import NavigationItem from "./NavigationItem";

interface NavigationProps {
  collapsed: boolean;
}
const Navigation: React.FC<NavigationProps> = ({ collapsed }) => {
  const { user, assignedRole } = useAppSelector((state) => state.session);
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2">
      {user && user.is_superuser && (
        <NavigationItem
          label="Admin"
          icon={MdAdminPanelSettings as IconType}
          active={pathname ? pathname === "/admin" : false}
          href="/admin"
          collapsed={collapsed}
        />
      )}

      {assignedRole && (
        <NavigationItem
          label="Dashboard"
          icon={MdDashboard as IconType}
          active={pathname ? pathname === "/dashboard" : false}
          href="/dashboard"
          collapsed={collapsed}
        />
      )}

      <Can I="access" a="NAV_ITEM_APPROVAL">
        <NavigationItem
          label="Approval"
          icon={MdGavel as IconType}
          active={pathname ? pathname === "/approval" : false}
          href="/approval"
          collapsed={collapsed}
        />
      </Can>

      <Can I="access" a="NAV_ITEM_HISTORY">
        <NavigationItem
          label="History"
          icon={MdReceipt as IconType}
          active={pathname ? pathname === "/history" : false}
          href="/history"
          collapsed={collapsed}
        />
      </Can>

      <NavigationItem
        label="Profile"
        icon={MdPerson as IconType}
        active={pathname ? pathname === "/profile" : false}
        href="/profile"
        collapsed={collapsed}
      />
    </div>
  );
};

export default Navigation;
