"use client";
import React from "react";
import { useAppSelector } from "~/app/hook";
import FinanceDashboard from "./Finance";
import HrbpDashboard from "./Hrbp";
import ManagerDashboard from "./Manager";
import MemberDashboard from "./Member";

const DashboardComponent: React.FC = () => {
  const { user } = useAppSelector((state) => state.session);
  return (
    <div>
      {user && (
        <>
          {user.assignedRole === "External Reimbursement Approver Manager" && (
            <ManagerDashboard />
          )}
          {user.assignedRole === "Member" && <MemberDashboard />}
          {user.assignedRole === "HRBP" && <HrbpDashboard />}
          {user.assignedRole === "Finance" && <FinanceDashboard />}
        </>
      )}
    </div>
  );
};

export default DashboardComponent;
