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
          {user.groups.includes("REIMBURSEMENT_MANAGER") && (
            <ManagerDashboard />
          )}
          {user.groups.includes("REIMBURSEMENT_MEMBER") && <MemberDashboard />}
          {user.groups.includes("REIMBURSEMENT_HRBP") && <HrbpDashboard />}
          {user.groups.includes("REIMBURSEMENT_FINANCE") && (
            <FinanceDashboard />
          )}
        </>
      )}
    </div>
  );
};

export default DashboardComponent;
