import { useRouter } from "next/router";

import React from "react";
import { type IconType } from "react-icons-all-files";
import { MdDashboard } from "react-icons-all-files/md/MdDashboard";
import { MdPerson } from "react-icons-all-files/md/MdPerson";
import { MdReceipt } from "react-icons-all-files/md/MdReceipt";
import { useAppSelector } from "~/app/hook";
import { Can } from "~/context/AbilityContext";
import NavigationItem from "./NavigationItem";

interface NavigationProps {
  collapsed: boolean;
}
const Navigation: React.FC<NavigationProps> = ({ collapsed }) => {
  const { user } = useAppSelector((state) => state.session);
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

      {user &&
        user.assignedRole === "External Reimbursement Approver Manager" && (
          <Can I="access" a="CAN_APPROVE_REIMBURSEMENT">
            <NavigationItem
              label="Approval"
              icon={MdReceipt as IconType}
              active={pathname.includes("approval")}
              href="/approval"
              collapsed={collapsed}
            />
          </Can>
        )}

      {user &&
        (user.assignedRole === "HRBP" || user.assignedRole === "Finance") && (
          <NavigationItem
            label="Reimbursements"
            icon={MdReceipt as IconType}
            active={pathname.includes("reimbursements")}
            href="/reimbursements"
            collapsed={collapsed}
          />
        )}

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
