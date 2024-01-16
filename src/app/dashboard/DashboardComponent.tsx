"use client";
import React from "react";
import { useAppSelector } from "~/app/hook";
import FinanceDashboard from "./Finance";
import HrbpDashboard from "./Hrbp";
import ManagerDashboard from "./Manager";
import MemberDashboard from "./Member";

const DashboardComponent: React.FC = () => {
  const { assignedRole } = useAppSelector((state) => state.session);

  return (
    <div>
      {assignedRole === "REIMBURSEMENT_MANAGER" && <ManagerDashboard />}
      {assignedRole === "REIMBURSEMENT_USER" && <MemberDashboard />}
      {assignedRole === "REIMBURSEMENT_HRBP" && <HrbpDashboard />}
      {assignedRole === "REIMBURSEMENT_FINANCE" && <FinanceDashboard />}
    </div>
  );
};

export default DashboardComponent;
