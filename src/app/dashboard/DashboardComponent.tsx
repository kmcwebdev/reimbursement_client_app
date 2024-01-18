"use client";
import React from "react";
import { useAppSelector } from "~/app/hook";
import FinanceDashboard from "./Finance";
import HrbpDashboard from "./Hrbp";
import ManagerDashboard from "./Manager";
import MemberDashboard from "./Member";
import AdminDashboard from "./Admin";

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
            {assignedRole === "REIMBURSEMENT_MANAGER" && !user?.is_superuser && <ManagerDashboard />}
            {assignedRole === "REIMBURSEMENT_USER" && !user?.is_superuser  && <MemberDashboard />}
            {assignedRole === "REIMBURSEMENT_HRBP" && !user?.is_superuser  && <HrbpDashboard />}
            {assignedRole === "REIMBURSEMENT_FINANCE" && !user?.is_superuser  && <FinanceDashboard />}
          </>
        )}
        </>
      )}
    </div>
  );
};

export default DashboardComponent;
