import { useRouter } from "next/router";

import React from "react";
import { type IconType } from "react-icons-all-files";
import { MdDashboard } from "react-icons-all-files/md/MdDashboard";
import { MdPerson } from "react-icons-all-files/md/MdPerson";
import { MdReceipt } from "react-icons-all-files/md/MdReceipt";
import { Can } from "~/context/AbilityContext";
import NavigationItem from "./NavigationItem";

interface NavigationProps {
  collapsed: boolean;
}
const Navigation: React.FC<NavigationProps> = ({ collapsed }) => {
  const { pathname } = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <NavigationItem
        label="Dashboard"
        icon={MdDashboard as IconType}
        active={pathname.includes("dashboard")}
        href="/dashboard"
        collapsed={collapsed}
      />

      <Can I="access" a="CAN_APPROVE_REIMBURSEMENT">
        <NavigationItem
          label="Reimbursements"
          icon={MdReceipt as IconType}
          active={pathname.includes("approval")}
          href="/reimbursements"
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
