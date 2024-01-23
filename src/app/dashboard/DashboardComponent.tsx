"use client";
import React from "react";
import { useAppSelector } from "~/app/hook";
import AdminDashboard from "./Admin";
import FinanceDashboard from "./Finance";
import HrbpDashboard from "./Hrbp";
import ManagerDashboard from "./Manager";
import MemberDashboard from "./Member";

const DashboardComponent: React.FC = () => {
  const { user, assignedRole } = useAppSelector((state) => state.session);

  return (
    <div>
      {user && (
        <>
          {user.is_superuser ? (
            <AdminDashboard />
          ) : (
            <>
              {assignedRole === "REIMBURSEMENT_MANAGER" && <ManagerDashboard />}
              {assignedRole === "REIMBURSEMENT_USER" && <MemberDashboard />}
              {assignedRole === "REIMBURSEMENT_HRBP" && <HrbpDashboard />}
              {assignedRole === "REIMBURSEMENT_FINANCE" && <FinanceDashboard />}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardComponent;
