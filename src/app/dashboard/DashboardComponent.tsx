"use client";
import { redirect } from "next/navigation";
import React from "react";
import { useAppSelector } from "~/app/hook";
import FinanceDashboard from "./Finance";
import HrbpDashboard from "./Hrbp";
import ManagerDashboard from "./Manager";
import MemberDashboard from "./Member";

const DashboardComponent: React.FC = () => {
  const { user, assignedRole } = useAppSelector((state) => state.session);

  if (!assignedRole) {
    if (user?.is_superuser) {
      redirect("/admin");
    } else {
      redirect("/profile");
    }
  }

  return (
    <div>
      {user && (
        <>
          {assignedRole === "REIMBURSEMENT_MANAGER" && <ManagerDashboard />}
          {assignedRole === "REIMBURSEMENT_USER" && <MemberDashboard />}
          {assignedRole === "REIMBURSEMENT_HRBP" && <HrbpDashboard />}
          {assignedRole === "REIMBURSEMENT_FINANCE" && <FinanceDashboard />}
        </>
      )}
    </div>
  );
};

export default DashboardComponent;
